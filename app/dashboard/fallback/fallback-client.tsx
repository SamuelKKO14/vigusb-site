"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RefreshCw, RotateCcw, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

interface FallbackEntry {
  id: string;
  payload: Record<string, any>;
  source: string;
  created_at: string;
  recovered: boolean;
  recovered_at: string | null;
  error_message: string | null;
}

interface Props {
  entries: FallbackEntry[];
  total: number;
}

export function FallbackClient({ entries: initialEntries, total }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [recovering, setRecovering] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const pending = entries.filter((e) => !e.recovered);
  const recovered = entries.filter((e) => e.recovered);

  async function handleRecover(entry: FallbackEntry) {
    setRecovering(entry.id);
    const supabase = createClient();

    try {
      // Re-submit to create-reparation edge function
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(
        `${supabaseUrl}/functions/v1/create-reparation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
          },
          body: JSON.stringify(entry.payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Edge function error: ${text}`);
      }

      // Mark as recovered
      const { error } = await supabase
        .from("reparations_fallback")
        .update({
          recovered: true,
          recovered_at: new Date().toISOString(),
          recovered_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", entry.id);

      if (error) throw error;

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, recovered: true, recovered_at: new Date().toISOString() }
            : e
        )
      );

      toast({
        title: "Entrée récupérée",
        description: `Réparation pour ${entry.payload.prenom} ${entry.payload.nom} créée avec succès.`,
      });
    } catch (err: any) {
      toast({
        title: "Erreur de récupération",
        description: err.message || "Impossible de récupérer cette entrée.",
        variant: "destructive",
      });
    } finally {
      setRecovering(null);
    }
  }

  async function handleRecoverAll() {
    for (const entry of pending) {
      await handleRecover(entry);
    }
  }

  function formatPayload(payload: Record<string, any>) {
    const parts = [];
    if (payload.prenom && payload.nom)
      parts.push(`${payload.prenom} ${payload.nom}`);
    if (payload.marque && payload.modele)
      parts.push(`${payload.marque} ${payload.modele}`);
    if (payload.magasin_code) parts.push(payload.magasin_code);
    return parts.join(" — ") || "Données incomplètes";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fallback réparations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length} en attente · {recovered.length} récupérées · {total}{" "}
            total
          </p>
        </div>
        <div className="flex gap-2">
          {pending.length > 0 && (
            <Button onClick={handleRecoverAll} variant="default">
              <RotateCcw className="mr-2 h-4 w-4" />
              Tout récupérer ({pending.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!entries.length ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">Aucune entrée fallback</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tout fonctionne normalement.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Résumé</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Erreur</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className={entry.recovered ? "opacity-50" : ""}
                >
                  <TableCell>
                    {entry.recovered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="h-3 w-3" /> Récupérée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertTriangle className="h-3 w-3" /> En attente
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(entry.created_at), "dd MMM yyyy HH:mm", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="text-sm max-w-[300px] truncate">
                    {formatPayload(entry.payload)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.source}
                  </TableCell>
                  <TableCell className="text-xs text-red-600 max-w-[200px] truncate">
                    {entry.error_message || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {!entry.recovered && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecover(entry)}
                        disabled={recovering === entry.id}
                      >
                        {recovering === entry.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
