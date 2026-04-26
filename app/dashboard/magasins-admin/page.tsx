import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MagasinsAdminClient } from "./magasins-admin-client";

export default async function MagasinsAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify admin
  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("role")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  if (!isAdmin) redirect("/dashboard/reparations");

  const { data: magasins } = await supabase
    .from("magasins")
    .select("*")
    .order("ville");

  return <MagasinsAdminClient magasins={magasins ?? []} />;
}
