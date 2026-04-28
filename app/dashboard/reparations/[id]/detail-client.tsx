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
  Clock,
  Pencil,
  Trash2,
  MapPinned,
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
import { Textarea } from "@/components/ui/textarea";
import { TicketDisplay } from "@/components/ticket-display";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { StatusSelector } from "../components/status-selector";
import { RepairForm } from "../components/repair-form";
import { getStatusLabel } from "@/components/status-badge";
import { useToast } from "@/lib/hooks/use-toast";
import { TESTS_TELEPHONE, PIECES_A_CHANGER } from "@/lib/repair-constants";

interface Props {
  reparation: any;
  logs: any[];
  photoUrls: { path: string; url: string }[];
  legacyPhotos: { id: string; url: string; type: string; storage_path: string; uploaded_at: string }[];
  userId: string;
  userEmail: string;
  isAdmin: boolean;
  magasins: { id: string; code: string; nom: string; ville: string }[];
  myMagasinIds: string[];
}

export function ReparationDetailClient({
  reparation,
  logs,
  photoUrls,
  legacyPhotos,
  userId,
  userEmail,
  isAdmin,
  magasins,
  myMagasinIds,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState(reparation.notes_staff ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  const magasin = reparation.magasins;
  const allPhotos = [
    ...photoUrls.map((p) => ({ url: p.url, label: "Prise en charge" })),
    ...legacyPhotos.map((p) => ({ url: p.url, label: p.type === "reception" ? "Réception" : "Sortie" })),
  ];

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

  async function handleDelete() {
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.from("reparation_logs").delete().eq("reparation_id", reparation.id);
      await supabase.from("reparations").delete().eq("id", reparation.id);
      toast({ title: "Fiche supprimée" });
      router.push("/dashboard/reparations");
      router.refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur suppression" });
    } finally {
      setDeleting(false);
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
            <div className="mt-2">
              <StatusSelector
                reparationId={reparation.id}
                currentStatut={reparation.statut}
                userEmail={userEmail}
                variant="full"
                onStatusChange={() => router.refresh()}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => setEditOpen(true)}
            className="bg-violet hover:bg-violet-dark gap-1"
          >
            <Pencil className="h-4 w-4" /> Modifier
          </Button>
          {isAdmin && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
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
            {reparation.code_postal && (
              <p className="flex items-center gap-2">
                <MapPinned className="h-3.5 w-3.5 text-muted-foreground" />
                {reparation.code_postal}
              </p>
            )}
            {reparation.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <a href={`mailto:${reparation.email}`} className="text-violet hover:underline">{reparation.email}</a>
              </p>
            )}
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={`tel:${reparation.telephone}`} className="text-violet hover:underline">{reparation.telephone}</a>
            </p>
            {reparation.pris_en_charge_par && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                Pris en charge par <span className="font-semibold text-foreground">{reparation.pris_en_charge_par}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Appareil */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-violet" /> Appareil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-lg">{reparation.modele}</p>
            <p className="text-muted-foreground">
              Tiroir SIM : {reparation.tiroir_sim === true ? "Oui" : reparation.tiroir_sim === false ? "Non" : "—"}
            </p>
            {reparation.test_telephone?.length > 0 && (
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase mt-2">Tests</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {reparation.test_telephone.map((t: string) => (
                    <span key={t} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {reparation.pieces_a_changer?.length > 0 && (
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase mt-2">Pièces à changer</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {reparation.pieces_a_changer.map((p: string) => (
                    <span key={p} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-2 text-base font-bold border-t mt-2">
              <span>{reparation.sav ? "SAV (garantie)" : "Tarif"}</span>
              <span className="text-vert">
                {reparation.sav ? "0 €" : `${reparation.tarif ?? 0} €`}
              </span>
            </div>
            {(reparation.upsell_batterie !== null || reparation.upsell_protection !== null) && (
              <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                {reparation.upsell_batterie !== null && (
                  <p>Upsell batterie : {reparation.upsell_batterie ? "✓ Oui" : "✗ Non"}</p>
                )}
                {reparation.upsell_protection !== null && (
                  <p>Protection écran : {reparation.upsell_protection ? "✓ Oui" : "✗ Non"}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RDV / Magasin */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet" /> {reparation.rdv_date ? "Rendez-vous" : "Magasin"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {reparation.rdv_date && (
              <>
                <p className="font-semibold text-lg">
                  {format(new Date(reparation.rdv_date), "EEEE d MMMM yyyy", { locale: fr })}
                </p>
                {reparation.rdv_heure && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {reparation.rdv_heure?.slice(0, 5)}
                  </p>
                )}
              </>
            )}
            <div className={reparation.rdv_date ? "pt-2 border-t" : ""}>
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="h-3.5 w-3.5 text-violet" />
                {magasin?.nom}
              </p>
              <p className="text-muted-foreground ml-5">{magasin?.adresse}</p>
              {magasin?.telephone && (
                <p className="text-muted-foreground ml-5">{magasin.telephone}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Créé le {format(new Date(reparation.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
            </p>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              📷 Photos ({allPhotos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allPhotos.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Aucune photo</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {allPhotos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxUrl(photo.url)}
                    className="aspect-square rounded-lg overflow-hidden border hover:ring-2 hover:ring-violet transition-all"
                  >
                    <img src={photo.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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

      {/* Lightbox photo */}
      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-3xl p-2">
          {lightboxUrl && (
            <img src={lightboxUrl} alt="Photo" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit form */}
      <RepairForm
        mode="edit"
        initialData={reparation}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        magasins={magasins}
        currentUserMagasinId={myMagasinIds[0] ?? null}
        isAdmin={isAdmin}
        userEmail={userEmail}
        onSuccess={() => router.refresh()}
      />

      {/* Delete confirmation */}
      {isAdmin && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Supprimer la fiche"
          description={`Supprimer définitivement la fiche ${reparation.ticket_number} ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          variant="destructive"
          loading={deleting}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
