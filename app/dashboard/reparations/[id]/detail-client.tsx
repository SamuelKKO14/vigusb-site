"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Camera,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, ALL_STATUTS, getStatusLabel } from "@/components/status-badge";
import { TicketDisplay } from "@/components/ticket-display";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PhotoGallery } from "@/components/photo-gallery";
import { useToast } from "@/lib/hooks/use-toast";

interface Props {
  reparation: any;
  logs: any[];
  photos: { id: string; url: string; type: "reception" | "sortie"; storage_path: string; uploaded_at: string }[];
  userId: string;
}

export function ReparationDetailClient({
  reparation,
  logs,
  photos,
  userId,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [statusOpen, setStatusOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [newStatut, setNewStatut] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(reparation.notes_staff ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  const magasin = reparation.magasins;
  const reps: { label: string; prix: number }[] = reparation.reparations ?? [];

  async function handleStatusChange() {
    if (!newStatut) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-statut`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            reparation_id: reparation.id,
            nouveau_statut: newStatut,
            commentaire: commentaire || undefined,
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur mise à jour");

      toast({ title: "Statut mis à jour" });
      setStatusOpen(false);
      setCommentaire("");
      router.refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur lors de la mise à jour" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-statut`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            reparation_id: reparation.id,
            nouveau_statut: "annulee",
            commentaire: "Annulée par le staff",
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur annulation");

      toast({ title: "Réservation annulée" });
      setCancelOpen(false);
      router.refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur lors de l'annulation" });
    } finally {
      setLoading(false);
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    try {
      const supabase = createClient();
      await supabase
        .from("reparations")
        .update({ notes_staff: notes })
        .eq("id", reparation.id);
      toast({ title: "Notes sauvegardées" });
    } catch {
      toast({ variant: "destructive", title: "Erreur" });
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/reparations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <TicketDisplay ticket={reparation.ticket_number} size="lg" />
            <div className="mt-1">
              <StatusBadge statut={reparation.statut} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/dashboard/reparations/${reparation.id}/reception`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Camera className="h-4 w-4" /> Photos
            </Button>
          </Link>
          <Button size="sm" onClick={() => setStatusOpen(true)} className="bg-violet hover:bg-violet-dark gap-1">
            Changer statut
          </Button>
          {reparation.statut !== "annulee" && reparation.statut !== "recuperee" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              Annuler
            </Button>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Client */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-violet" /> Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-lg">{reparation.prenom} {reparation.nom}</p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={`mailto:${reparation.email}`} className="text-violet hover:underline">{reparation.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={`tel:${reparation.telephone}`} className="text-violet hover:underline">{reparation.telephone}</a>
            </p>
          </CardContent>
        </Card>

        {/* Téléphone */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-violet" /> Téléphone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-lg">{reparation.marque} {reparation.modele}</p>
            <ul className="space-y-1">
              {reps.map((r, i) => (
                <li key={i} className="flex justify-between border-b border-dashed pb-1 last:border-0">
                  <span>{r.label}</span>
                  <span className="font-semibold">{r.prix}€</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-1 text-base font-bold text-vert">
              <span>Total estimé</span>
              <span>{reparation.total_estime}€</span>
            </div>
          </CardContent>
        </Card>

        {/* RDV */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet" /> Rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-lg">
              {format(new Date(reparation.rdv_date), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {reparation.rdv_heure?.slice(0, 5)}
            </p>
            <div className="pt-2 border-t">
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-violet" />
                {magasin?.nom}
              </p>
              <p className="text-muted-foreground ml-5">{magasin?.adresse}</p>
              {magasin?.telephone && (
                <p className="text-muted-foreground ml-5">{magasin.telephone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-violet" /> Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoGallery photos={photos} />
          </CardContent>
        </Card>

        {/* Notes staff */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notes staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes internes..."
              rows={4}
            />
            <Button size="sm" onClick={saveNotes} disabled={savingNotes}>
              {savingNotes ? "..." : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        {/* Historique */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet" /> Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Aucun historique</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet" />
                    <div>
                      <p>
                        {log.ancien_statut && (
                          <span className="text-muted-foreground">{getStatusLabel(log.ancien_statut)}</span>
                        )}
                        {log.ancien_statut && " → "}
                        <span className="font-semibold">{getStatusLabel(log.nouveau_statut)}</span>
                      </p>
                      {log.commentaire && (
                        <p className="text-muted-foreground">{log.commentaire}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog changer statut */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newStatut} onValueChange={setNewStatut}>
              <SelectTrigger>
                <SelectValue placeholder="Nouveau statut" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUTS.filter((s) => s !== reparation.statut).map((s) => (
                  <SelectItem key={s} value={s}>
                    {getStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Commentaire (optionnel)"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-violet hover:bg-violet-dark"
              onClick={handleStatusChange}
              disabled={!newStatut || loading}
            >
              {loading ? "..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog annulation */}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Annuler la réservation"
        description={`Tu es sûr de vouloir annuler la réservation ${reparation.ticket_number} ? Un email sera envoyé au client.`}
        confirmLabel="Oui, annuler"
        variant="destructive"
        loading={loading}
        onConfirm={handleCancel}
      />
    </div>
  );
}
