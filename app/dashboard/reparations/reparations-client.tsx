"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge, ALL_STATUTS, getStatusLabel } from "@/components/status-badge";
import { TicketDisplay } from "@/components/ticket-display";
import { useToast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Ding sound via Web Audio API ────────���──────────────────────���──────
// Browsers (Chrome/Safari/Firefox) block AudioContext playback until the
// user has interacted with the page (autoplay policy). We use a singleton
// AudioContext that gets unlocked on the first user gesture (click/touch),
// then reuse it for every subsequent ding triggered by Realtime events.
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

const MARQUES = ["Apple", "Samsung", "Xiaomi", "Google", "Oppo", "Huawei", "Autre"];

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

  // ── Sound toggle persistence ──────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("vb-sound");
    if (stored !== null) setSoundEnabled(stored === "1");
  }, []);

  // Unlock the AudioContext on the first click anywhere on the dashboard
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

  // ── Realtime subscription ─────────────────────────────────────────
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

  // ── Refresh button ────────────────────────────────────────────────
  function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 500);
  }

  // ── Filters ───────────────────────────────────────────────────────
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
            {soundEnabled ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </button>
          <span className="text-sm text-muted-foreground">
            {total} résultat{total > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-gray-100 transition-colors"
            title="Actualiser"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
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
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucune réparation trouvée
                </TableCell>
              </TableRow>
            ) : (
              reparations.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/reparations/${r.id}`)
                  }
                >
                  <TableCell>
                    <TicketDisplay ticket={r.ticket_number} size="sm" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="font-medium">
                      {r.prenom} {r.nom}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.email || r.telephone}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {r.marque} {r.modele}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {r.magasins?.nom}
                  </TableCell>
                  <TableCell>
                    {r.rdv_date ? (
                      <>
                        <div className="text-sm">
                          {format(new Date(r.rdv_date), "dd MMM", {
                            locale: fr,
                          })}
                        </div>
                        {r.rdv_heure && (
                          <div className="text-xs text-muted-foreground">
                            {r.rdv_heure.slice(0, 5)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(r.created_at), "dd MMM", {
                          locale: fr,
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge statut={r.statut} />
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
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Feature 4: New intake dialog */}
      <NewIntakeDialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        magasins={magasins}
        isAdmin={isAdmin}
        myMagasinIds={myMagasinIds}
        userEmail={userEmail}
      />
    </div>
  );
}

// ── Feature 4: Walk-in intake dialog ──────────────────────────────────

interface RepairLine {
  id: string;
  label: string;
  prix: number;
}

function NewIntakeDialog({
  open,
  onClose,
  magasins,
  isAdmin,
  myMagasinIds,
  userEmail,
}: {
  open: boolean;
  onClose: () => void;
  magasins: { id: string; code: string; nom: string; ville: string }[];
  isAdmin: boolean;
  myMagasinIds: string[];
  userEmail: string;
}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [imei, setImei] = useState("");
  const [codeDeverrouillage, setCodeDeverrouillage] = useState("");
  const [repairs, setRepairs] = useState<RepairLine[]>([
    { id: crypto.randomUUID(), label: "", prix: 0 },
  ]);
  const [magasinId, setMagasinId] = useState(
    myMagasinIds.length === 1 ? myMagasinIds[0] : ""
  );
  const [notes, setNotes] = useState("");

  const totalEstime = repairs.reduce((sum, r) => sum + (r.prix || 0), 0);

  // Available magasins for this user
  const availableMagasins = isAdmin
    ? magasins
    : magasins.filter((m) => myMagasinIds.includes(m.id));

  function resetForm() {
    setPrenom("");
    setNom("");
    setTelephone("");
    setEmail("");
    setMarque("");
    setModele("");
    setImei("");
    setCodeDeverrouillage("");
    setRepairs([{ id: crypto.randomUUID(), label: "", prix: 0 }]);
    setMagasinId(myMagasinIds.length === 1 ? myMagasinIds[0] : "");
    setNotes("");
  }

  function addRepairLine() {
    setRepairs([...repairs, { id: crypto.randomUUID(), label: "", prix: 0 }]);
  }

  function updateRepairLine(id: string, field: "label" | "prix", value: string | number) {
    setRepairs(
      repairs.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function removeRepairLine(id: string) {
    if (repairs.length <= 1) return;
    setRepairs(repairs.filter((r) => r.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!prenom.trim() || !nom.trim() || !telephone.trim()) {
      toast({ title: "Champs obligatoires", description: "Prénom, nom et téléphone sont requis", variant: "destructive" });
      return;
    }
    if (!marque || !modele.trim()) {
      toast({ title: "Champs obligatoires", description: "Marque et modèle sont requis", variant: "destructive" });
      return;
    }
    if (!magasinId) {
      toast({ title: "Champs obligatoires", description: "Sélectionnez un magasin", variant: "destructive" });
      return;
    }
    const validRepairs = repairs.filter((r) => r.label.trim());
    if (validRepairs.length === 0) {
      toast({ title: "Champs obligatoires", description: "Ajoutez au moins une réparation", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();

      // Get magasin code
      const mag = magasins.find((m) => m.id === magasinId);
      if (!mag) throw new Error("Magasin introuvable");

      // Generate ticket number
      const today = new Date().toISOString().slice(0, 10);
      const dateStr = today.slice(2).replace(/-/g, "");
      const { count } = await supabase
        .from("reparations")
        .select("id", { count: "exact", head: true })
        .eq("magasin_id", magasinId)
        .gte("created_at", today + "T00:00:00")
        .lt("created_at", today + "T23:59:59");

      const seq = String((count ?? 0) + 1).padStart(2, "0");
      const ticketNumber = `VB-${mag.code}-${dateStr}-${seq}`;

      // Insert reparation
      const { data: reparation, error } = await supabase
        .from("reparations")
        .insert({
          ticket_number: ticketNumber,
          magasin_id: magasinId,
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim() || null,
          telephone: telephone.trim(),
          marque,
          modele: modele.trim(),
          imei: imei.trim() || null,
          code_deverrouillage: codeDeverrouillage.trim() || null,
          reparations: validRepairs.map((r) => ({
            label: r.label,
            prix: r.prix || 0,
          })),
          total_estime: totalEstime,
          statut: "recue",
          notes_staff: notes.trim() || null,
        })
        .select("id, ticket_number")
        .single();

      if (error) throw error;

      // Insert log
      await supabase.from("reparation_logs").insert({
        reparation_id: reparation.id,
        ancien_statut: null,
        nouveau_statut: "recue",
        commentaire: `Prise en charge en magasin par ${userEmail}`,
      });

      toast({
        title: "Prise en charge créée",
        description: `Ticket ${reparation.ticket_number}`,
      });

      resetForm();
      onClose();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer la prise en charge",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle prise en charge</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CLIENT */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Client
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ni-prenom">Prénom *</Label>
                <Input
                  id="ni-prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ni-nom">Nom *</Label>
                <Input
                  id="ni-nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ni-tel">Téléphone *</Label>
                <Input
                  id="ni-tel"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ni-email">Email</Label>
                <Input
                  id="ni-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* TELEPHONE */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Téléphone
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ni-marque">Marque *</Label>
                <Select value={marque} onValueChange={setMarque}>
                  <SelectTrigger id="ni-marque">
                    <SelectValue placeholder="Choisir une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARQUES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ni-modele">Modèle *</Label>
                <Input
                  id="ni-modele"
                  value={modele}
                  onChange={(e) => setModele(e.target.value)}
                  placeholder="ex: iPhone 14 Pro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ni-imei">IMEI</Label>
                <Input
                  id="ni-imei"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="Optionnel"
                />
              </div>
              <div>
                <Label htmlFor="ni-code">Code de déverrouillage</Label>
                <Input
                  id="ni-code"
                  value={codeDeverrouillage}
                  onChange={(e) => setCodeDeverrouillage(e.target.value)}
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </fieldset>

          {/* RÉPARATIONS */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Réparations
            </legend>
            <div className="space-y-2">
              {repairs.map((r) => (
                <div key={r.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Réparation (ex: Écran)"
                      value={r.label}
                      onChange={(e) =>
                        updateRepairLine(r.id, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="Prix €"
                      value={r.prix || ""}
                      onChange={(e) =>
                        updateRepairLine(
                          r.id,
                          "prix",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRepairLine(r.id)}
                    disabled={repairs.length <= 1}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRepairLine}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une réparation
              </Button>
              <span className="font-semibold">
                Total :{" "}
                {totalEstime.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
          </fieldset>

          {/* MAGASIN & NOTES */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Magasin & notes
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ni-magasin">Magasin *</Label>
                {availableMagasins.length === 1 ? (
                  <Input
                    value={`${availableMagasins[0].nom} — ${availableMagasins[0].ville}`}
                    disabled
                  />
                ) : (
                  <Select value={magasinId} onValueChange={setMagasinId}>
                    <SelectTrigger id="ni-magasin">
                      <SelectValue placeholder="Choisir un magasin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMagasins.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nom} ({m.ville})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label>Statut initial</Label>
                <Input value="Reçue (téléphone en magasin)" disabled />
              </div>
            </div>
            <div>
              <Label htmlFor="ni-notes">Notes internes</Label>
              <Textarea
                id="ni-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observations, état du téléphone, etc."
                rows={3}
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-vert hover:bg-vert/90 text-white"
          >
            {submitting ? "Création en cours..." : "Créer la prise en charge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
