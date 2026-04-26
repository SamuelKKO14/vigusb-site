import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StaffClient } from "./staff-client";

export default async function StaffPage() {
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

  // Get all staff with magasins
  const { data: allStaff } = await supabase
    .from("staff_magasins")
    .select("user_id, role, magasins(id, code, nom, ville)")
    .order("role");

  // Group by user
  const staffMap = new Map<string, { user_id: string; role: string; magasins: any[] }>();
  for (const entry of allStaff ?? []) {
    const existing = staffMap.get(entry.user_id);
    if (existing) {
      if (entry.magasins) existing.magasins.push(entry.magasins);
      if (entry.role === "admin") existing.role = "admin";
    } else {
      staffMap.set(entry.user_id, {
        user_id: entry.user_id,
        role: entry.role,
        magasins: entry.magasins ? [entry.magasins] : [],
      });
    }
  }

  const { data: magasins } = await supabase
    .from("magasins")
    .select("id, code, nom, ville")
    .eq("is_active", true)
    .order("ville");

  return (
    <StaffClient
      staff={Array.from(staffMap.values())}
      magasins={magasins ?? []}
    />
  );
}
