import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ReceptionClient } from "./reception-client";

export default async function ReceptionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: reparation } = await supabase
    .from("reparations")
    .select("id, ticket_number, prenom, nom, marque, modele, statut")
    .eq("id", params.id)
    .single();

  if (!reparation) notFound();

  return <ReceptionClient reparation={reparation} userId={user.id} />;
}
