"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface Magasin {
  id: string;
  code: string;
  nom: string;
  ville: string;
}

interface Props {
  isAdmin: boolean;
  myMagasinIds: string[];
  magasins: Magasin[];
}

type Periode = "today" | "7d" | "30d" | "90d" | "all";

const PERIODES: Record<Periode, string> = {
  today: "Aujourd'hui",
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
  all: "Total",
};

function getStartDate(p: Periode): string | null {
  if (p === "all") return null;
  const d = new Date();
  if (p === "today") d.setHours(0, 0, 0, 0);
  else if (p === "7d") d.setDate(d.getDate() - 7);
  else if (p === "30d") d.setDate(d.getDate() - 30);
  else if (p === "90d") d.setDate(d.getDate() - 90);
  return d.toISOString();
}

const VIOLET = "#7B2D8B";
const VERT = "#8DB542";

export function StatsClient({ isAdmin, myMagasinIds, magasins }: Props) {
  const [periode, setPeriode] = useState<Periode>("30d");
  const [magasinFilter, setMagasinFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Chart data
  const [reparateurData, setReparateurData] = useState<any[]>([]);
  const [modelesData, setModelesData] = useState<any[]>([]);
  const [piecesData, setPiecesData] = useState<any[]>([]);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);
  const [magasinData, setMagasinData] = useState<any[]>([]);
  const [delaiData, setDelaiData] = useState<any[]>([]);

  const accessibleMagasins = isAdmin
    ? magasins
    : magasins.filter((m) => myMagasinIds.includes(m.id));

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const startDate = getStartDate(periode);

    let query = supabase.from("reparations").select("*");
    if (startDate) query = query.gte("created_at", startDate);
    if (magasinFilter !== "all") {
      query = query.eq("magasin_id", magasinFilter);
    } else if (!isAdmin) {
      query = query.in("magasin_id", myMagasinIds);
    }

    const { data: reparations } = await query;
    const items = reparations ?? [];

    // Card 1 — Par réparateur
    const byRep: Record<string, number> = {};
    items.forEach((r) => {
      const name = r.pris_en_charge_par || "(non renseigné)";
      byRep[name] = (byRep[name] || 0) + 1;
    });
    setReparateurData(
      Object.entries(byRep)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    );

    // Card 2 — Top modèles
    const byModele: Record<string, number> = {};
    items.forEach((r) => {
      if (r.modele) byModele[r.modele] = (byModele[r.modele] || 0) + 1;
    });
    setModelesData(
      Object.entries(byModele)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    );

    // Card 3 — Pièces changées
    const byPiece: Record<string, number> = {};
    items.forEach((r) => {
      (r.pieces_a_changer ?? []).forEach((p: string) => {
        byPiece[p] = (byPiece[p] || 0) + 1;
      });
    });
    setPiecesData(
      Object.entries(byPiece)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    );

    // Card 4 — Évolution par jour
    const byDay: Record<string, number> = {};
    items.forEach((r) => {
      const jour = r.created_at?.slice(0, 10) ?? "";
      if (jour) byDay[jour] = (byDay[jour] || 0) + 1;
    });
    setEvolutionData(
      Object.entries(byDay)
        .map(([jour, value]) => ({ jour, value }))
        .sort((a, b) => a.jour.localeCompare(b.jour))
    );

    // Card 5 — Par magasin (admin)
    if (isAdmin) {
      const byMag: Record<string, number> = {};
      items.forEach((r) => {
        const mag = magasins.find((m) => m.id === r.magasin_id);
        const name = mag?.ville ?? "Inconnu";
        byMag[name] = (byMag[name] || 0) + 1;
      });
      setMagasinData(
        Object.entries(byMag)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      );
    }

    // Card 6 — Délai moyen
    const { data: allLogs } = await supabase
      .from("reparation_logs")
      .select("reparation_id, nouveau_statut, created_at")
      .eq("nouveau_statut", "recuperee");

    const recupLogs = allLogs ?? [];
    const delaiByMag: Record<string, { total: number; count: number }> = {};
    items
      .filter((r) => r.statut === "recuperee")
      .forEach((r) => {
        const log = recupLogs.find((l) => l.reparation_id === r.id);
        if (!log) return;
        const heures =
          (new Date(log.created_at).getTime() - new Date(r.created_at).getTime()) /
          (1000 * 60 * 60);
        const mag = magasins.find((m) => m.id === r.magasin_id);
        const name = mag?.ville ?? "Inconnu";
        if (!delaiByMag[name]) delaiByMag[name] = { total: 0, count: 0 };
        delaiByMag[name].total += heures;
        delaiByMag[name].count += 1;
      });
    setDelaiData(
      Object.entries(delaiByMag)
        .map(([name, { total, count }]) => ({
          name,
          value: Math.round(total / count),
        }))
        .sort((a, b) => a.value - b.value)
    );

    setLoading(false);
  }, [periode, magasinFilter, isAdmin, myMagasinIds, magasins]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold sm:text-2xl">Statistiques</h1>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sticky top-0 sm:top-0 z-10 bg-gray-50 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Select value={periode} onValueChange={(v) => setPeriode(v as Periode)}>
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIODES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={magasinFilter} onValueChange={setMagasinFilter}>
          <SelectTrigger className="w-full sm:w-[220px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isAdmin ? `Tous les magasins (${magasins.length})` : "Tous mes magasins"}
            </SelectItem>
            {accessibleMagasins.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.nom} ({m.ville})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading && <span className="text-sm text-muted-foreground">Chargement...</span>}
      </div>

      {/* Charts — stacked on mobile, grid on desktop */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Card 1 — Par réparateur */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Prises en charge par réparateur</CardTitle>
          </CardHeader>
          <CardContent>
            {reparateurData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reparateurData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill={VIOLET} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 2 — Top modèles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top modèles réparés</CardTitle>
          </CardHeader>
          <CardContent>
            {modelesData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={modelesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill={VIOLET} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 3 — Pièces changées */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top pièces changées</CardTitle>
          </CardHeader>
          <CardContent>
            {piecesData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={piecesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill={VERT} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 4 — Évolution par jour */}
        <Card className="sm:col-span-2 xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Évolution / jour</CardTitle>
          </CardHeader>
          <CardContent>
            {evolutionData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="jour"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelFormatter={(v) => v} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={VIOLET}
                    strokeWidth={2}
                    dot={{ fill: VIOLET, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 5 — Par magasin (admin) */}
        {isAdmin && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Par magasin</CardTitle>
            </CardHeader>
            <CardContent>
              {magasinData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={magasinData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill={VIOLET} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Card 6 — Délai moyen */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Délai moyen (heures)</CardTitle>
          </CardHeader>
          <CardContent>
            {delaiData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={delaiData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="h" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip formatter={(v) => `${v}h`} />
                  <Bar dataKey="value" fill={VERT} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
      <BarChart3 className="h-8 w-8 mb-2 opacity-30" />
      <p className="text-sm">Pas encore de données</p>
    </div>
  );
}
