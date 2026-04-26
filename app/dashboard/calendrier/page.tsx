import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendrierClient } from "./calendrier-client";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: { date?: string; magasin?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("magasin_id, role")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  const myMagasinIds = staffEntries?.map((s) => s.magasin_id) ?? [];

  const { data: magasins } = await supabase
    .from("magasins")
    .select("id, code, nom, ville")
    .eq("is_active", true)
    .order("ville");

  // Week range
  const baseDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });

  let query = supabase
    .from("reparations")
    .select("id, ticket_number, prenom, nom, marque, modele, rdv_date, rdv_heure, statut, magasin_id, magasins(code, nom, ville)")
    .gte("rdv_date", format(weekStart, "yyyy-MM-dd"))
    .lte("rdv_date", format(weekEnd, "yyyy-MM-dd"))
    .not("statut", "in", '("annulee","no_show")')
    .order("rdv_heure");

  if (!isAdmin) {
    query = query.in("magasin_id", myMagasinIds);
  }
  if (searchParams.magasin && searchParams.magasin !== "all") {
    query = query.eq("magasin_id", searchParams.magasin);
  }

  const { data: reparations } = await query;

  return (
    <CalendrierClient
      reparations={reparations ?? []}
      magasins={magasins ?? []}
      isAdmin={isAdmin}
      weekStart={weekStart.toISOString()}
      currentMagasin={searchParams.magasin}
    />
  );
}
