import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReparationsClient } from "./reparations-client";

interface Props {
  searchParams: {
    page?: string;
    statut?: string;
    magasin?: string;
    q?: string;
  };
}

export default async function ReparationsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get staff access
  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("magasin_id, role")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  const myMagasinIds = staffEntries?.map((s) => s.magasin_id) ?? [];

  // Get all magasins (for filter dropdown)
  const { data: magasins } = await supabase
    .from("magasins")
    .select("id, code, nom, ville")
    .eq("is_active", true)
    .order("ville");

  // Build query
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from("reparations")
    .select("*, magasins(code, nom, ville)", { count: "exact" });

  // Filter by magasin access
  if (!isAdmin) {
    query = query.in("magasin_id", myMagasinIds);
  }

  // Filter by magasin selection (admin only)
  if (searchParams.magasin && searchParams.magasin !== "all") {
    query = query.eq("magasin_id", searchParams.magasin);
  }

  // Filter by statut
  if (searchParams.statut && searchParams.statut !== "all") {
    query = query.eq("statut", searchParams.statut);
  }

  // Search
  if (searchParams.q) {
    const q = searchParams.q;
    query = query.or(
      `ticket_number.ilike.%${q}%,nom.ilike.%${q}%,prenom.ilike.%${q}%,email.ilike.%${q}%,telephone.ilike.%${q}%`
    );
  }

  const { data: reparations, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  return (
    <ReparationsClient
      reparations={reparations ?? []}
      magasins={magasins ?? []}
      total={count ?? 0}
      page={page}
      perPage={perPage}
      isAdmin={isAdmin}
      userEmail={user.email ?? ""}
      myMagasinIds={myMagasinIds}
      currentFilters={{
        statut: searchParams.statut,
        magasin: searchParams.magasin,
        q: searchParams.q,
      }}
    />
  );
}
