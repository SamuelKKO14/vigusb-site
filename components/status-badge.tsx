import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-gray-100 text-gray-700 border-gray-200" },
  recue: { label: "Reçue", className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_cours: { label: "En cours", className: "bg-orange-100 text-orange-700 border-orange-200" },
  terminee: { label: "Terminée", className: "bg-green-100 text-green-700 border-green-200" },
  recuperee: { label: "Récupérée", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  annulee: { label: "Annulée", className: "bg-red-100 text-red-700 border-red-200" },
  no_show: { label: "No-show", className: "bg-gray-900 text-white border-gray-900" },
};

export function StatusBadge({ statut }: { statut: string }) {
  const config = STATUS_CONFIG[statut] ?? { label: statut, className: "" };
  return <Badge className={cn("font-semibold", config.className)}>{config.label}</Badge>;
}

export function getStatusLabel(statut: string): string {
  return STATUS_CONFIG[statut]?.label ?? statut;
}

export const ALL_STATUTS = Object.keys(STATUS_CONFIG);
