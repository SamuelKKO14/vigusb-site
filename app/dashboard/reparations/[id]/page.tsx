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

  // Get photos with signed URLs
  const { data: photosRaw } = await supabase
    .from("reparation_photos")
    .select("*")
    .eq("reparation_id", params.id)
    .order("uploaded_at");

  const photos = await Promise.all(
    (photosRaw ?? []).map(async (p) => {
      const { data } = await supabase.storage
        .from("reparation-photos")
        .createSignedUrl(p.storage_path, 3600);
      return { ...p, url: data?.signedUrl ?? "" };
    })
  );

  return (
    <ReparationDetailClient
      reparation={reparation}
      logs={logs ?? []}
      photos={photos}
      userId={user.id}
    />
  );
}
