import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getServiceClient } from "../_shared/supabase.ts";

const JOURS_SEMAINE = [
  "dimanche", "lundi", "mardi", "mercredi",
  "jeudi", "vendredi", "samedi",
];

function generateSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  let current = oh * 60 + om;
  const end = ch * 60 + cm;

  while (current < end) {
    const h = String(Math.floor(current / 60)).padStart(2, "0");
    const m = String(current % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += 30;
  }
  return slots;
}

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const magasinCode = url.searchParams.get("magasin");
    const date = url.searchParams.get("date");

    if (!magasinCode || !date) {
      return new Response(
        JSON.stringify({ error: "Params requis : magasin, date" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Valider format date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(
        JSON.stringify({ error: "Format date invalide (YYYY-MM-DD)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = getServiceClient();

    // 1. Récupérer le magasin
    const { data: magasin, error } = await supabase
      .from("magasins")
      .select("*")
      .eq("code", magasinCode)
      .eq("is_active", true)
      .single();

    if (error || !magasin) {
      return new Response(
        JSON.stringify({ error: "Magasin introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Vérifier jour de fermeture
    if (magasin.jours_fermeture?.includes(date)) {
      return new Response(
        JSON.stringify({
          magasin: { nom: magasin.nom, ville: magasin.ville },
          ferme: true,
          slots: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Obtenir le jour de la semaine
    const dateObj = new Date(date + "T12:00:00");
    const jour = JOURS_SEMAINE[dateObj.getDay()];
    const horairesJour = magasin.horaires?.[jour];

    if (!horairesJour) {
      return new Response(
        JSON.stringify({
          magasin: { nom: magasin.nom, ville: magasin.ville },
          ferme: true,
          slots: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Générer les slots
    const allSlots = generateSlots(horairesJour.open, horairesJour.close);

    // 5. Compter les réservations existantes pour chaque slot
    const { data: existing } = await supabase
      .from("reparations")
      .select("rdv_heure")
      .eq("magasin_id", magasin.id)
      .eq("rdv_date", date)
      .not("statut", "in", '("annulee","no_show")');

    const countBySlot: Record<string, number> = {};
    for (const r of existing ?? []) {
      const h = r.rdv_heure.slice(0, 5); // "09:30:00" → "09:30"
      countBySlot[h] = (countBySlot[h] ?? 0) + 1;
    }

    const slots = allSlots.map((heure) => ({
      heure,
      dispo: (countBySlot[heure] ?? 0) < magasin.slots_per_30min,
      restants: magasin.slots_per_30min - (countBySlot[heure] ?? 0),
    }));

    return new Response(
      JSON.stringify({
        magasin: { nom: magasin.nom, ville: magasin.ville },
        ferme: false,
        horaires: horairesJour,
        slots,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("availability error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
