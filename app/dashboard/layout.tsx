import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "./dashboard-shell";

export const metadata = {
  title: "Dashboard — Vigus'B Réparations",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get staff info + magasins
  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("magasin_id, role, magasins(id, code, nom, ville)")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  const magasins =
    staffEntries?.map((s) => s.magasins).filter(Boolean).flat() ?? [];

  // Fetch pending fallback count for admin badge
  let fallbackCount = 0;
  if (isAdmin) {
    const { count } = await supabase
      .from("reparations_fallback")
      .select("id", { count: "exact", head: true })
      .eq("recovered", false);
    fallbackCount = count ?? 0;
  }

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? "" }}
      isAdmin={isAdmin}
      magasins={magasins as any}
      fallbackCount={fallbackCount}
    >
      {children}
    </DashboardShell>
  );
}
