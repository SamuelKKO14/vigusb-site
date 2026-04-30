"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RefreshCw, RotateCcw, Check, AlertTriangle, ShieldCheck } from "lucide-react";
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
        description: `Réparation pour ${entry.payload.prenom} ${entry.payload.nom} créée.`,
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Fallback réparations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pending.length} en attente · {recovered.length} récupérées · {total} total
          </p>
        </div>
        <div className="flex gap-2">
          {pending.length > 0 && (
            <Button onClick={handleRecoverAll} className="h-10 flex-1 sm:flex-none">
              <RotateCcw className="mr-2 h-4 w-4" />
              Tout récupérer ({pending.length})
            </Button>
          )}
          <Button
            variant="outline"
            className="h-10 w-10 p-0 shrink-0"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!entries.length ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-vert mb-4" />
          <p className="text-lg font-medium">Aucune entrée fallback</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tout fonctionne normalement.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-lg border bg-white">
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
                          className="h-9"
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

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-xl border bg-white p-4 ${entry.recovered ? "opacity-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  {entry.recovered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="h-3 w-3" /> Récupérée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                      <AlertTriangle className="h-3 w-3" /> En attente
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.created_at), "dd MMM HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">{formatPayload(entry.payload)}</p>
                {entry.error_message && (
                  <p className="text-xs text-red-600 mb-2 line-clamp-2">{entry.error_message}</p>
                )}
                {!entry.recovered && (
                  <Button
                    variant="outline"
                    className="w-full h-10 mt-2"
                    onClick={() => handleRecover(entry)}
                    disabled={recovering === entry.id}
                  >
                    {recovering === entry.id ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Récupérer
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
