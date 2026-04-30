import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FallbackClient } from "./fallback-client";

export default async function FallbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Admin check
  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("role")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  if (!isAdmin) redirect("/dashboard/reparations");

  // Fetch fallback entries
  const { data: entries, count } = await supabase
    .from("reparations_fallback")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  return <FallbackClient entries={entries ?? []} total={count ?? 0} />;
}
