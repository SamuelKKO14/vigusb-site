import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.22.4";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";
import { sendEmail } from "../_shared/resend.ts";
import { confirmationReservation } from "../_shared/email-templates.ts";

const ReparationSchema = z.object({
  prenom: z.string().min(1).max(100),
  nom: z.string().min(1).max(100),
  email: z.string().email(),
  telephone: z.string().min(8).max(20),
  // marque, reparations, total_estime: acceptés depuis le tunnel mais plus stockés en DB (colonnes supprimées vague 3)
  marque: z.string().optional().default(""),
  modele: z.string().min(1),
  reparations: z.array(
    z.object({
      label: z.string(),
      prix: z.number().nonnegative(),
    })
  ).optional().default([]),
  total_estime: z.number().nonnegative().optional().default(0),
  magasin_code: z.string().min(2).max(10),
  rdv_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  rdv_heure: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
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

  try {
    const body = await req.json();
    const data = ReparationSchema.parse(body);
    const supabase = getServiceClient();

    // 1. Récupérer le magasin
    const { data: magasin, error: magError } = await supabase
      .from("magasins")
      .select("*")
      .eq("code", data.magasin_code)
      .eq("is_active", true)
      .single();

    if (magError || !magasin) {
      return new Response(
        JSON.stringify({ error: "Magasin introuvable ou inactif" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Si RDV fourni, vérifier fermeture + dispo
    if (data.rdv_date) {
      if (magasin.jours_fermeture?.includes(data.rdv_date)) {
        return new Response(
          JSON.stringify({ error: "Le magasin est fermé ce jour-là" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (data.rdv_heure) {
        const { count } = await supabase
          .from("reparations")
          .select("id", { count: "exact", head: true })
          .eq("magasin_id", magasin.id)
          .eq("rdv_date", data.rdv_date)
          .eq("rdv_heure", data.rdv_heure)
          .not("statut", "in", '("annulee","no_show")');

        if ((count ?? 0) >= magasin.slots_per_30min) {
          return new Response(
            JSON.stringify({ error: "Ce créneau est complet" }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // 3. Générer le ticket number : VB-{CODE}-{YYMMDD}-{SEQ}
    const ticketDate = data.rdv_date || new Date().toISOString().slice(0, 10);
    const dateStr = ticketDate.slice(2).replace(/-/g, "");
    const { count: dayCount } = await supabase
      .from("reparations")
      .select("id", { count: "exact", head: true })
      .eq("magasin_id", magasin.id)
      .gte("created_at", ticketDate + "T00:00:00")
      .lt("created_at", ticketDate + "T23:59:59");

    const seq = String((dayCount ?? 0) + 1).padStart(2, "0");
    const ticket_number = `VB-${magasin.code}-${dateStr}-${seq}`;

    // 5. INSERT — colonnes marque/reparations/total_estime supprimées en vague 3
    const { data: reparation, error: insertError } = await supabase
      .from("reparations")
      .insert({
        ticket_number,
        magasin_id: magasin.id,
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        modele: data.modele,
        rdv_date: data.rdv_date || null,
        rdv_heure: data.rdv_heure || null,
      })
      .select("id, ticket_number")
      .single();

    if (insertError) {
      throw insertError;
    }

    // 6. Log de création
    await supabase.from("reparation_logs").insert({
      reparation_id: reparation.id,
      ancien_statut: null,
      nouveau_statut: "en_attente",
      commentaire: "Réservation créée depuis le tunnel",
    });

    // 7. Email de confirmation (on passe encore marque/reparations/total pour l'email)
    let dateFr = "À déterminer";
    if (data.rdv_date) {
      const dateObj = new Date(data.rdv_date + "T12:00:00");
      dateFr = dateObj.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    try {
      await sendEmail({
        to: data.email,
        subject: `Réservation confirmée — ${ticket_number}`,
        html: confirmationReservation({
          ticket_number,
          prenom: data.prenom,
          marque: data.marque || "",
          modele: data.modele,
          reparations: data.reparations || [],
          total_estime: data.total_estime || 0,
          rdv_date: dateFr,
          rdv_heure: data.rdv_heure || "À déterminer",
          magasin_nom: magasin.nom,
          magasin_adresse: magasin.adresse,
          magasin_telephone: magasin.telephone,
        }),
      });
    } catch (emailErr) {
      console.error("Email error (non-bloquant):", emailErr);
    }

    return new Response(
      JSON.stringify({
        ticket_number: reparation.ticket_number,
        id: reparation.id,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Données invalides", details: err.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.error("create-reparation error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
