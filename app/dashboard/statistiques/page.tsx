import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsClient } from "./stats-client";

export default async function StatistiquesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get staff access
  const { data: staffAccess } = await supabase
    .from("staff_magasins")
    .select("magasin_id, role")
    .eq("user_id", user.id);

  const isAdmin = staffAccess?.some((s) => s.role === "admin") ?? false;
  const myMagasinIds = staffAccess?.map((s) => s.magasin_id) ?? [];

  // Get magasins
  const { data: magasins } = await supabase
    .from("magasins")
    .select("id, code, nom, ville")
    .eq("is_active", true)
    .order("ville");

  return (
    <StatsClient
      isAdmin={isAdmin}
      myMagasinIds={myMagasinIds}
      magasins={magasins ?? []}
    />
  );
}
