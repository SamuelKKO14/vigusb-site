"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STATUTS, type Statut } from "@/lib/repair-constants";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectorProps {
  reparationId: string;
  currentStatut: string;
  userEmail: string;
  onStatusChange?: (newStatut: string) => void;
  variant?: "badge" | "full";
}

export function StatusSelector({
  reparationId,
  currentStatut,
  userEmail,
  onStatusChange,
  variant = "full",
}: StatusSelectorProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatut: string) {
    if (newStatut === currentStatut) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateErr, data: updateData } = await supabase
        .from("reparations")
        .update({ statut: newStatut })
        .eq("id", reparationId)
        .select("id")
        .maybeSingle();

      if (updateErr) {
        console.error("[StatusSelector] update error:", updateErr);
        throw new Error(`UPDATE: ${updateErr.message}${updateErr.code ? ` [${updateErr.code}]` : ""}`);
      }
      if (!updateData) {
        throw new Error("UPDATE: aucune ligne modifiée (RLS bloque ou id introuvable)");
      }

      const { error: logErr } = await supabase.from("reparation_logs").insert({
        reparation_id: reparationId,
        ancien_statut: currentStatut,
        nouveau_statut: newStatut,
        user_id: user?.id ?? null,
        commentaire: `Changement par ${userEmail}`,
      });

      if (logErr) {
        console.error("[StatusSelector] log insert error:", logErr);
        toast({
          variant: "destructive",
          title: `Statut → ${STATUTS[newStatut as Statut] ?? newStatut}`,
          description: `⚠️ Log non enregistré : ${logErr.message}${logErr.code ? ` [${logErr.code}]` : ""}`,
        });
        onStatusChange?.(newStatut);
        return;
      }

      toast({ title: `Statut → ${STATUTS[newStatut as Statut] ?? newStatut}` });
      onStatusChange?.(newStatut);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[StatusSelector] full error:", e);
      toast({
        variant: "destructive",
        title: "Erreur changement de statut",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  if (variant === "badge") {
    return (
      <Select value={currentStatut} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-auto border-0 p-0 h-auto shadow-none focus:ring-0">
          <StatusBadge statut={currentStatut} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUTS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={currentStatut} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUTS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
