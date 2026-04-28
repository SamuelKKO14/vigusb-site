import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.22.4";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getServiceClient, getUserClient } from "../_shared/supabase.ts";
import { sendEmail } from "../_shared/resend.ts";
import {
  telephoneRecu,
  reparationTerminee,
  reservationAnnulee,
} from "../_shared/email-templates.ts";

const STATUTS_VALIDES = [
  "en_attente", "recue", "en_cours",
  "terminee", "recuperee", "annulee", "no_show",
  // Vague 3 — nouveaux statuts
  "diagnostic", "en_reparation", "prete",
] as const;

const UpdateSchema = z.object({
  reparation_id: z.string().uuid(),
  nouveau_statut: z.enum(STATUTS_VALIDES),
  commentaire: z.string().optional(),
});

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Vérifier auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Non autorisé" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const data = UpdateSchema.parse(body);

    // Client authentifié (pour vérif RLS)
    const userClient = getUserClient(authHeader);

    // Vérifier l'identité du user
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Token invalide" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceClient = getServiceClient();

    // Récupérer la réparation + magasin
    const { data: reparation, error: repError } = await serviceClient
      .from("reparations")
      .select("*, magasins(*)")
      .eq("id", data.reparation_id)
      .single();

    if (repError || !reparation) {
      return new Response(
        JSON.stringify({ error: "Réparation introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier que le staff a accès à ce magasin
    const { data: access } = await serviceClient
      .from("staff_magasins")
      .select("role")
      .eq("user_id", user.id)
      .or(`magasin_id.eq.${reparation.magasin_id},role.eq.admin`);

    if (!access || access.length === 0) {
      return new Response(
        JSON.stringify({ error: "Accès refusé à ce magasin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ancien_statut = reparation.statut;

    // Update statut
    const { error: updateError } = await serviceClient
      .from("reparations")
      .update({
        statut: data.nouveau_statut,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.reparation_id);

    if (updateError) throw updateError;

    // Log
    await serviceClient.from("reparation_logs").insert({
      reparation_id: data.reparation_id,
      ancien_statut,
      nouveau_statut: data.nouveau_statut,
      user_id: user.id,
      commentaire: data.commentaire ?? null,
    });

    // Emails transactionnels selon le nouveau statut
    const magasin = reparation.magasins;
    try {
      if (data.nouveau_statut === "recue") {
        await sendEmail({
          to: reparation.email,
          subject: `Téléphone réceptionné — ${reparation.ticket_number}`,
          html: telephoneRecu({
            ticket_number: reparation.ticket_number,
            prenom: reparation.prenom,
            marque: "",
            modele: reparation.modele,
          }),
        });
      } else if (data.nouveau_statut === "terminee" || data.nouveau_statut === "prete") {
        await sendEmail({
          to: reparation.email,
          subject: `Ton tel est prêt ! — ${reparation.ticket_number}`,
          html: reparationTerminee({
            ticket_number: reparation.ticket_number,
            prenom: reparation.prenom,
            marque: "",
            modele: reparation.modele,
            magasin_nom: magasin.nom,
            magasin_adresse: magasin.adresse,
          }),
        });
      } else if (data.nouveau_statut === "annulee") {
        await sendEmail({
          to: reparation.email,
          subject: `Réservation annulée — ${reparation.ticket_number}`,
          html: reservationAnnulee({
            ticket_number: reparation.ticket_number,
            prenom: reparation.prenom,
            raison: data.commentaire,
          }),
        });
      }
    } catch (emailErr) {
      console.error("Email error (non-bloquant):", emailErr);
    }

    return new Response(
      JSON.stringify({ success: true, ancien_statut, nouveau_statut: data.nouveau_statut }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Données invalides", details: err.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.error("update-statut error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
