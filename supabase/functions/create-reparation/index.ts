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
  marque: z.string().min(1),
  modele: z.string().min(1),
  reparations: z.array(
    z.object({
      label: z.string(),
      prix: z.number().nonnegative(),
    })
  ).min(1),
  total_estime: z.number().nonnegative(),
  magasin_code: z.string().min(2).max(10),
  rdv_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rdv_heure: z.string().regex(/^\d{2}:\d{2}$/),
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

    // 2. Vérifier que la date n'est pas un jour de fermeture
    if (magasin.jours_fermeture?.includes(data.rdv_date)) {
      return new Response(
        JSON.stringify({ error: "Le magasin est fermé ce jour-là" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Vérifier dispo du slot
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

    // 4. Générer le ticket number : VB-{CODE}-{YYMMDD}-{SEQ}
    const dateStr = data.rdv_date.slice(2).replace(/-/g, ""); // "260427"
    const { count: dayCount } = await supabase
      .from("reparations")
      .select("id", { count: "exact", head: true })
      .eq("magasin_id", magasin.id)
      .eq("rdv_date", data.rdv_date);

    const seq = String((dayCount ?? 0) + 1).padStart(2, "0");
    const ticket_number = `VB-${magasin.code}-${dateStr}-${seq}`;

    // 5. INSERT
    const { data: reparation, error: insertError } = await supabase
      .from("reparations")
      .insert({
        ticket_number,
        magasin_id: magasin.id,
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        marque: data.marque,
        modele: data.modele,
        reparations: data.reparations,
        total_estime: data.total_estime,
        rdv_date: data.rdv_date,
        rdv_heure: data.rdv_heure,
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

    // 7. Email de confirmation
    const joursSemaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const dateObj = new Date(data.rdv_date + "T12:00:00");
    const jourFr = joursSemaine[dateObj.getDay()];
    const dateFr = dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      await sendEmail({
        to: data.email,
        subject: `Réservation confirmée — ${ticket_number}`,
        html: confirmationReservation({
          ticket_number,
          prenom: data.prenom,
          marque: data.marque,
          modele: data.modele,
          reparations: data.reparations,
          total_estime: data.total_estime,
          rdv_date: dateFr,
          rdv_heure: data.rdv_heure,
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
