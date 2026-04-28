import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ReparationDetailClient } from "./detail-client";

export default async function ReparationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get reparation with magasin
  const { data: reparation } = await supabase
    .from("reparations")
    .select("*, magasins(*)")
    .eq("id", params.id)
    .single();

  if (!reparation) notFound();

  // Get logs
  const { data: logs } = await supabase
    .from("reparation_logs")
    .select("*")
    .eq("reparation_id", params.id)
    .order("created_at", { ascending: false });

  // Get signed URLs for photos_etat
  const photoUrls: { path: string; url: string }[] = [];
  for (const path of reparation.photos_etat ?? []) {
    const { data } = await supabase.storage
      .from("reparations-photos")
      .createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      photoUrls.push({ path, url: data.signedUrl });
    }
  }

  // Also get legacy reparation_photos
  const { data: legacyPhotos } = await supabase
    .from("reparation_photos")
    .select("*")
    .eq("reparation_id", params.id)
    .order("uploaded_at");

  const legacyPhotoUrls = await Promise.all(
    (legacyPhotos ?? []).map(async (p) => {
      const { data } = await supabase.storage
        .from("reparation-photos")
        .createSignedUrl(p.storage_path, 3600);
      return { ...p, url: data?.signedUrl ?? "" };
    })
  );

  // Get staff info for edit
  const { data: staffAccess } = await supabase
    .from("staff_magasins")
    .select("magasin_id, role")
    .eq("user_id", user.id);

  const isAdmin = staffAccess?.some((s) => s.role === "admin") ?? false;
  const myMagasinIds = staffAccess?.map((s) => s.magasin_id) ?? [];

  // Get all magasins for edit form
  const { data: allMagasins } = await supabase
    .from("magasins")
    .select("id, code, nom, ville")
    .eq("is_active", true)
    .order("ville");

  return (
    <ReparationDetailClient
      reparation={reparation}
      logs={logs ?? []}
      photoUrls={photoUrls}
      legacyPhotos={legacyPhotoUrls}
      userId={user.id}
      userEmail={user.email ?? ""}
      isAdmin={isAdmin}
      magasins={allMagasins ?? []}
      myMagasinIds={myMagasinIds}
    />
  );
}
