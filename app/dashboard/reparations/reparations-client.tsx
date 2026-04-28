"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Bell,
  BellOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, ALL_STATUTS, getStatusLabel } from "@/components/status-badge";
import { TicketDisplay } from "@/components/ticket-display";
import { StatusSelector } from "./components/status-selector";
import { RepairForm } from "./components/repair-form";
import { useToast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

// ── Ding sound via Web Audio API ────────────────────────────────────
let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return _audioCtx;
}

async function unlockAudio() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { /* noop */ }
  }
}

async function playDing() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { return; }
    if ((ctx.state as string) !== "running") return;
  }
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    /* silent fail */
  }
}

interface Props {
  reparations: any[];
  magasins: { id: string; code: string; nom: string; ville: string }[];
  total: number;
  page: number;
  perPage: number;
  isAdmin: boolean;
  userEmail: string;
  myMagasinIds: string[];
  currentFilters: {
    statut?: string;
    magasin?: string;
    q?: string;
  };
}

export function ReparationsClient({
  reparations,
  magasins,
  total,
  page,
  perPage,
  isAdmin,
  userEmail,
  myMagasinIds,
  currentFilters,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState(currentFilters.q ?? "");
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const totalPages = Math.ceil(total / perPage);

  // Sound toggle persistence
  useEffect(() => {
    const stored = localStorage.getItem("vb-sound");
    if (stored !== null) setSoundEnabled(stored === "1");
  }, []);

  useEffect(() => {
    function handleFirstClick() {
      unlockAudio();
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
    }
    window.addEventListener("click", handleFirstClick);
    window.addEventListener("touchstart", handleFirstClick);
    return () => {
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
    };
  }, []);

  async function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("vb-sound", next ? "1" : "0");
    if (next) {
      await unlockAudio();
      playDing();
    }
  }

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("reparations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reparations" },
        (payload) => {
          router.refresh();
          if (payload.eventType === "INSERT") {
            if (soundEnabled) playDing();
            toast({
              title: "Nouvelle réservation",
              description: (payload.new as any).ticket_number,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled, router, toast]);

  function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 500);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (currentFilters.q) params.set("q", currentFilters.q);
    if (currentFilters.statut) params.set("statut", currentFilters.statut);
    if (currentFilters.magasin) params.set("magasin", currentFilters.magasin);

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/dashboard/reparations?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("q", search);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams();
    if (currentFilters.q) params.set("q", currentFilters.q);
    if (currentFilters.statut) params.set("statut", currentFilters.statut);
    if (currentFilters.magasin) params.set("magasin", currentFilters.magasin);
    params.set("page", String(p));
    router.push(`/dashboard/reparations?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Réparations</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-gray-100 transition-colors"
            title={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </button>
          <span className="text-sm text-muted-foreground">
            {total} résultat{total > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-gray-100 transition-colors"
            title="Actualiser"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Button
            size="sm"
            className="bg-vert hover:bg-vert/90 text-white"
            onClick={() => setShowNewDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Nouvelle prise en charge</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ticket, nom, email ou téléphone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Chercher
          </Button>
        </form>

        <Select
          value={currentFilters.statut ?? "all"}
          onValueChange={(v) => updateFilter("statut", v)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {ALL_STATUTS.map((s) => (
              <SelectItem key={s} value={s}>
                {getStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isAdmin && (
          <Select
            value={currentFilters.magasin ?? "all"}
            onValueChange={(v) => updateFilter("magasin", v)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Magasin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les magasins</SelectItem>
              {magasins.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.nom} ({m.ville})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead className="hidden sm:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Modèle</TableHead>
              <TableHead className="hidden lg:table-cell">Magasin</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reparations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune réparation trouvée
                </TableCell>
              </TableRow>
            ) : (
              reparations.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/reparations/${r.id}`)}
                >
                  <TableCell>
                    <TicketDisplay ticket={r.ticket_number} size="sm" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="font-medium">{r.prenom} {r.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.email || r.telephone}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {r.modele}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {r.magasins?.nom}
                  </TableCell>
                  <TableCell>
                    {r.rdv_date ? (
                      <>
                        <div className="text-sm">
                          {format(new Date(r.rdv_date), "dd MMM", { locale: fr })}
                        </div>
                        {r.rdv_heure && (
                          <div className="text-xs text-muted-foreground">
                            {r.rdv_heure.slice(0, 5)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(r.created_at), "dd MMM", { locale: fr })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <StatusSelector
                      reparationId={r.id}
                      currentStatut={r.statut}
                      userEmail={userEmail}
                      variant="badge"
                      onStatusChange={() => router.refresh()}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* New intake form */}
      <RepairForm
        mode="create"
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        magasins={magasins}
        currentUserMagasinId={myMagasinIds[0] ?? null}
        isAdmin={isAdmin}
        userEmail={userEmail}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
