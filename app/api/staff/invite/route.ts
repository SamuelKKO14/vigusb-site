import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // Verify caller is admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: staffEntries } = await supabase
    .from("staff_magasins")
    .select("role")
    .eq("user_id", user.id);

  const isAdmin = staffEntries?.some((s) => s.role === "admin") ?? false;
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { email, password, role, magasin_id } = await req.json();

  if (!email || !password || !magasin_id) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const admin = getAdminClient();

  // Create user via admin API
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return NextResponse.json(
      { error: createError.message },
      { status: 400 }
    );
  }

  // Insert into staff_magasins
  const { error: staffError } = await admin
    .from("staff_magasins")
    .insert({
      user_id: newUser.user.id,
      magasin_id,
      role: role ?? "manager",
    });

  if (staffError) {
    return NextResponse.json(
      { error: staffError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, user_id: newUser.user.id });
}
