"use client";

import { useRouter } from "next/navigation";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { MagasinSelect } from "@/components/magasin-select";
import { cn } from "@/lib/utils";

// Color map per magasin (cycle)
const COLORS = [
  "border-l-violet",
  "border-l-vert",
  "border-l-blue-500",
  "border-l-orange-500",
  "border-l-pink-500",
  "border-l-cyan-500",
  "border-l-amber-500",
  "border-l-emerald-500",
  "border-l-indigo-500",
  "border-l-rose-500",
  "border-l-teal-500",
  "border-l-lime-500",
  "border-l-fuchsia-500",
  "border-l-sky-500",
];

interface Props {
  reparations: any[];
  magasins: { id: string; code: string; nom: string; ville: string }[];
  isAdmin: boolean;
  weekStart: string;
  currentMagasin?: string;
}

export function CalendrierClient({
  reparations,
  magasins,
  isAdmin,
  weekStart: weekStartStr,
  currentMagasin,
}: Props) {
  const router = useRouter();
  const ws = new Date(weekStartStr);

  const magasinColorMap: Record<string, string> = {};
  magasins.forEach((m, i) => {
    magasinColorMap[m.id] = COLORS[i % COLORS.length];
  });

  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));

  function navigate(direction: "prev" | "next") {
    const newDate =
      direction === "prev" ? subWeeks(ws, 1) : addWeeks(ws, 1);
    const params = new URLSearchParams();
    params.set("date", format(newDate, "yyyy-MM-dd"));
    if (currentMagasin) params.set("magasin", currentMagasin);
    router.push(`/dashboard/calendrier?${params}`);
  }

  function filterMagasin(value: string) {
    const params = new URLSearchParams();
    params.set("date", format(ws, "yyyy-MM-dd"));
    if (value !== "all") params.set("magasin", value);
    router.push(`/dashboard/calendrier?${params}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Calendrier</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[180px] text-center">
            {format(ws, "d MMM", { locale: fr })} —{" "}
            {format(addDays(ws, 6), "d MMM yyyy", { locale: fr })}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isAdmin && (
        <MagasinSelect
          magasins={magasins}
          value={currentMagasin ?? "all"}
          onValueChange={filterMagasin}
          showAll
        />
      )}

      {/* Week grid */}
      <div className="grid gap-3 md:grid-cols-7">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayReps = reparations.filter((r) => r.rdv_date === dateStr);
          const isToday = format(new Date(), "yyyy-MM-dd") === dateStr;

          return (
            <Card
              key={dateStr}
              className={cn("min-h-[120px]", isToday && "ring-2 ring-violet")}
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                  {format(day, "EEE", { locale: fr })}
                </CardTitle>
                <p
                  className={cn(
                    "text-lg font-bold",
                    isToday && "text-violet"
                  )}
                >
                  {format(day, "d")}
                </p>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1">
                {dayReps.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Aucun RDV
                  </p>
                ) : (
                  dayReps.map((r) => (
                    <button
                      key={r.id}
                      onClick={() =>
                        router.push(`/dashboard/reparations/${r.id}`)
                      }
                      className={cn(
                        "w-full text-left rounded p-1.5 text-xs border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors",
                        magasinColorMap[r.magasin_id] ?? "border-l-gray-400"
                      )}
                    >
                      <span className="font-semibold">
                        {r.rdv_heure?.slice(0, 5)}
                      </span>{" "}
                      <span>
                        {r.prenom} {r.nom?.charAt(0)}.
                      </span>
                      <br />
                      <span className="text-muted-foreground">
                        {r.marque} {r.modele}
                      </span>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
