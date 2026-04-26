"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Store, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/lib/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

interface Magasin {
  id: string;
  code: string;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  email_contact: string;
  horaires: Record<string, { open: string; close: string } | null>;
  slots_per_30min: number;
  is_active: boolean;
}

export function MagasinsAdminClient({ magasins: initial }: { magasins: Magasin[] }) {
  const [editMag, setEditMag] = useState<Magasin | null>(null);
  const [horaires, setHoraires] = useState<Record<string, { open: string; close: string } | null>>({});
  const [slots, setSlots] = useState(2);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  function openEdit(mag: Magasin) {
    setEditMag(mag);
    setHoraires(mag.horaires ?? {});
    setSlots(mag.slots_per_30min);
    setIsActive(mag.is_active);
  }

  function updateHoraire(jour: string, field: "open" | "close", value: string) {
    setHoraires((prev) => ({
      ...prev,
      [jour]: prev[jour] ? { ...prev[jour]!, [field]: value } : { open: "09:30", close: "19:00", [field]: value },
    }));
  }

  function toggleJour(jour: string, enabled: boolean) {
    setHoraires((prev) => ({
      ...prev,
      [jour]: enabled ? { open: "09:30", close: "19:00" } : null,
    }));
  }

  async function handleSave() {
    if (!editMag) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("magasins")
        .update({
          horaires,
          slots_per_30min: slots,
          is_active: isActive,
        })
        .eq("id", editMag.id);

      if (error) throw error;
      toast({ title: `${editMag.nom} mis à jour` });
      setEditMag(null);
      router.refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur de sauvegarde" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold sm:text-2xl">Magasins</h1>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden sm:table-cell">Ville</TableHead>
              <TableHead className="hidden md:table-cell">Slots/30min</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initial.map((mag) => (
              <TableRow key={mag.id}>
                <TableCell className="font-mono text-xs">{mag.code}</TableCell>
                <TableCell className="font-medium">{mag.nom}</TableCell>
                <TableCell className="hidden sm:table-cell">{mag.ville}</TableCell>
                <TableCell className="hidden md:table-cell">{mag.slots_per_30min}</TableCell>
                <TableCell>
                  <Badge variant={mag.is_active ? "default" : "secondary"} className={mag.is_active ? "bg-vert" : ""}>
                    {mag.is_active ? "Oui" : "Non"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(mag)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editMag} onOpenChange={() => setEditMag(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              {editMag?.nom} — {editMag?.ville}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <Label>Magasin actif</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {/* Slots */}
            <div className="space-y-1">
              <Label>Créneaux simultanés (par 30 min)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={slots}
                onChange={(e) => setSlots(Number(e.target.value))}
              />
            </div>

            {/* Horaires */}
            <div className="space-y-2">
              <Label>Horaires d&apos;ouverture</Label>
              {JOURS.map((jour) => {
                const h = horaires[jour];
                return (
                  <div key={jour} className="flex items-center gap-2">
                    <Switch
                      checked={h !== null && h !== undefined}
                      onCheckedChange={(on) => toggleJour(jour, on)}
                    />
                    <span className="w-20 text-sm capitalize">{jour}</span>
                    {h ? (
                      <>
                        <Input
                          type="time"
                          value={h.open}
                          onChange={(e) => updateHoraire(jour, "open", e.target.value)}
                          className="w-28 text-xs"
                        />
                        <span className="text-xs">—</span>
                        <Input
                          type="time"
                          value={h.close}
                          onChange={(e) => updateHoraire(jour, "close", e.target.value)}
                          className="w-28 text-xs"
                        />
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Fermé</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMag(null)}>
              Annuler
            </Button>
            <Button
              className="bg-violet hover:bg-violet-dark"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
