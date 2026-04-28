"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { X, Upload, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/use-toast";
import { TESTS_TELEPHONE, PIECES_A_CHANGER } from "@/lib/repair-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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

// ── Types ─────────────────────────────────────────────────────────────

interface Magasin {
  id: string;
  code: string;
  nom: string;
  ville: string;
}

interface ReparationData {
  id?: string;
  ticket_number?: string;
  magasin_id?: string;
  pris_en_charge_par?: string;
  prenom?: string;
  nom?: string;
  code_postal?: string;
  telephone?: string;
  email?: string;
  modele?: string;
  test_telephone?: string[];
  tiroir_sim?: boolean | null;
  pieces_a_changer?: string[];
  photos_etat?: string[];
  upsell_batterie?: boolean | null;
  upsell_protection?: boolean | null;
  sav?: boolean;
  tarif?: number;
  notes_staff?: string;
  statut?: string;
}

interface RepairFormProps {
  mode: "create" | "edit";
  initialData?: ReparationData;
  magasins: Magasin[];
  currentUserMagasinId: string | null;
  isAdmin: boolean;
  userEmail: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
}

// ── Component ─────────────────────────────────────────────────────────

export function RepairForm({
  mode,
  initialData,
  magasins,
  currentUserMagasinId,
  isAdmin,
  userEmail,
  open,
  onClose,
  onSuccess,
}: RepairFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Section 1 — Réparateur
  const [prisEnChargePar, setPrisEnChargePar] = useState(initialData?.pris_en_charge_par ?? "");
  const [prenomSuggestions, setPrenomSuggestions] = useState<string[]>([]);

  // Section 2 — Client
  const [prenom, setPrenom] = useState(initialData?.prenom ?? "");
  const [nom, setNom] = useState(initialData?.nom ?? "");
  const [codePostal, setCodePostal] = useState(initialData?.code_postal ?? "");
  const [telephone, setTelephone] = useState(initialData?.telephone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");

  // Section 3 — Appareil
  const [modele, setModele] = useState(initialData?.modele ?? "");
  const [testTelephone, setTestTelephone] = useState<string[]>(initialData?.test_telephone ?? []);
  const [tiroirSim, setTiroirSim] = useState<boolean | null>(initialData?.tiroir_sim ?? null);
  const [piecesAChanger, setPiecesAChanger] = useState<string[]>(initialData?.pieces_a_changer ?? []);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(initialData?.photos_etat ?? []);
  const [newFiles, setNewFiles] = useState<FilePreview[]>([]);

  // Section 4 — Vente & Tarif
  const [upsellBatterie, setUpsellBatterie] = useState<boolean | null>(initialData?.upsell_batterie ?? null);
  const [upsellProtection, setUpsellProtection] = useState<boolean | null>(initialData?.upsell_protection ?? null);
  const [sav, setSav] = useState(initialData?.sav ?? false);
  const [tarif, setTarif] = useState(initialData?.tarif ?? 0);

  // Magasin
  const [magasinId, setMagasinId] = useState(
    initialData?.magasin_id ?? currentUserMagasinId ?? ""
  );
  const [notes, setNotes] = useState(initialData?.notes_staff ?? "");

  const availableMagasins = isAdmin
    ? magasins
    : magasins.filter((m) => currentUserMagasinId === m.id);

  const totalPhotos = existingPhotos.length + newFiles.length;
  const photosRequired = !sav;
  const piecesRequired = !sav;

  // Fetch distinct pris_en_charge_par for datalist
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("reparations")
      .select("pris_en_charge_par")
      .neq("pris_en_charge_par", "")
      .then(({ data }) => {
        if (data) {
          const unique = Array.from(new Set(data.map((d) => d.pris_en_charge_par))).sort();
          setPrenomSuggestions(unique);
        }
      });
  }, []);

  // Reset form when opening in create mode
  useEffect(() => {
    if (open && mode === "create") {
      setPrisEnChargePar("");
      setPrenom("");
      setNom("");
      setCodePostal("");
      setTelephone("");
      setEmail("");
      setModele("");
      setTestTelephone([]);
      setTiroirSim(null);
      setPiecesAChanger([]);
      setExistingPhotos([]);
      setNewFiles([]);
      setUpsellBatterie(null);
      setUpsellProtection(null);
      setSav(false);
      setTarif(0);
      setMagasinId(currentUserMagasinId ?? "");
      setNotes("");
    }
  }, [open, mode, currentUserMagasinId]);

  // Update form when initialData changes (edit mode)
  useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setPrisEnChargePar(initialData.pris_en_charge_par ?? "");
      setPrenom(initialData.prenom ?? "");
      setNom(initialData.nom ?? "");
      setCodePostal(initialData.code_postal ?? "");
      setTelephone(initialData.telephone ?? "");
      setEmail(initialData.email ?? "");
      setModele(initialData.modele ?? "");
      setTestTelephone(initialData.test_telephone ?? []);
      setTiroirSim(initialData.tiroir_sim ?? null);
      setPiecesAChanger(initialData.pieces_a_changer ?? []);
      setExistingPhotos(initialData.photos_etat ?? []);
      setNewFiles([]);
      setUpsellBatterie(initialData.upsell_batterie ?? null);
      setUpsellProtection(initialData.upsell_protection ?? null);
      setSav(initialData.sav ?? false);
      setTarif(initialData.tarif ?? 0);
      setMagasinId(initialData.magasin_id ?? "");
      setNotes(initialData.notes_staff ?? "");
    }
  }, [open, mode, initialData]);

  // ── Photo handling ──────────────────────────────────────────────────

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const valid = Array.from(fileList).filter((f) => {
        if (f.size > 5 * 1024 * 1024) {
          toast({ variant: "destructive", title: `Fichier trop lourd: ${f.name}` });
          return false;
        }
        return true;
      });
      setNewFiles((prev) => {
        const remaining = 3 - (existingPhotos.length + prev.length);
        const toAdd = valid.slice(0, Math.max(0, remaining));
        return [
          ...prev,
          ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ];
      });
    },
    [existingPhotos.length, toast]
  );

  function removeNewFile(index: number) {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function removeExistingPhoto(index: number) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Checkbox toggle helpers ─────────────────────────────────────────

  function toggleTest(item: string) {
    setTestTelephone((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  }

  function togglePiece(item: string) {
    setPiecesAChanger((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!prisEnChargePar.trim()) {
      toast({ variant: "destructive", title: "Indiquez qui prend en charge" });
      return;
    }
    if (!prenom.trim() || !nom.trim() || !telephone.trim() || !email.trim()) {
      toast({ variant: "destructive", title: "Tous les champs client sont obligatoires" });
      return;
    }
    if (codePostal && !/^\d{5}$/.test(codePostal)) {
      toast({ variant: "destructive", title: "Code postal invalide (5 chiffres)" });
      return;
    }
    if (!modele.trim()) {
      toast({ variant: "destructive", title: "Modèle obligatoire" });
      return;
    }
    if (testTelephone.length === 0) {
      toast({ variant: "destructive", title: "Cochez au moins un test téléphone" });
      return;
    }
    if (tiroirSim === null) {
      toast({ variant: "destructive", title: "Indiquez si le tiroir SIM est présent" });
      return;
    }
    if (piecesRequired && piecesAChanger.length === 0) {
      toast({ variant: "destructive", title: "Cochez au moins une pièce à changer" });
      return;
    }
    if (photosRequired && totalPhotos + newFiles.length - existingPhotos.length < 3 && mode === "create" && newFiles.length < 3) {
      toast({ variant: "destructive", title: `3 photos obligatoires (${newFiles.length}/3)` });
      return;
    }
    if (!magasinId) {
      toast({ variant: "destructive", title: "Sélectionnez un magasin" });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    try {
      let ticketNumber = initialData?.ticket_number;
      let reparationId = initialData?.id;

      if (mode === "create") {
        // Generate ticket number
        const mag = magasins.find((m) => m.id === magasinId);
        if (!mag) throw new Error("Magasin introuvable");

        const today = new Date().toISOString().slice(0, 10);
        const dateStr = today.slice(2).replace(/-/g, "");
        const { count } = await supabase
          .from("reparations")
          .select("id", { count: "exact", head: true })
          .eq("magasin_id", magasinId)
          .gte("created_at", today + "T00:00:00")
          .lt("created_at", today + "T23:59:59");

        const seq = String((count ?? 0) + 1).padStart(2, "0");
        ticketNumber = `VB-${mag.code}-${dateStr}-${seq}`;
      }

      // Upload new photos
      const uploadedPaths: string[] = [];
      for (let i = 0; i < newFiles.length; i++) {
        const { file } = newFiles[i];
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const photoIndex = existingPhotos.length + i + 1;
        const path = `${magasinId}/${ticketNumber}/${photoIndex}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("reparations-photos")
          .upload(path, compressed, { contentType: "image/jpeg", upsert: true });

        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
      }

      const allPhotoPaths = [...existingPhotos, ...uploadedPaths];

      const record = {
        ticket_number: ticketNumber!,
        magasin_id: magasinId,
        pris_en_charge_par: prisEnChargePar.trim(),
        prenom: prenom.trim(),
        nom: nom.trim(),
        code_postal: codePostal.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        modele: modele.trim(),
        test_telephone: testTelephone,
        tiroir_sim: tiroirSim,
        pieces_a_changer: sav ? [] : piecesAChanger,
        photos_etat: allPhotoPaths,
        upsell_batterie: upsellBatterie,
        upsell_protection: upsellProtection,
        sav,
        tarif: sav ? 0 : tarif,
        notes_staff: notes.trim() || null,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("reparations")
          .insert({ ...record, statut: "recue" })
          .select("id, ticket_number")
          .single();

        if (error) throw error;
        reparationId = data.id;

        await supabase.from("reparation_logs").insert({
          reparation_id: data.id,
          ancien_statut: null,
          nouveau_statut: "recue",
          commentaire: `Prise en charge par ${prisEnChargePar.trim()} (${userEmail})`,
        });

        toast({ title: "Prise en charge créée", description: `Ticket ${data.ticket_number}` });
      } else {
        const { error } = await supabase
          .from("reparations")
          .update(record)
          .eq("id", initialData!.id);

        if (error) throw error;

        toast({ title: "Fiche mise à jour" });
      }

      onClose();
      onSuccess();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de sauvegarder",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouvelle prise en charge" : `Modifier ${initialData?.ticket_number ?? ""}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── SECTION 1: Réparateur ─────────────────────────────── */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Réparateur
            </legend>
            <div>
              <Label htmlFor="rf-charge">Qui prend en charge ? *</Label>
              <Input
                id="rf-charge"
                list="rf-prenoms"
                value={prisEnChargePar}
                onChange={(e) => setPrisEnChargePar(e.target.value)}
                placeholder="Prénom du réparateur"
                required
              />
              <datalist id="rf-prenoms">
                {prenomSuggestions.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </fieldset>

          {/* ── SECTION 2: Client ─────────────────────────────────── */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Informations client
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="rf-prenom">Prénom *</Label>
                <Input id="rf-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="rf-nom">Nom *</Label>
                <Input id="rf-nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="rf-cp">Code postal *</Label>
                <Input
                  id="rf-cp"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  pattern="^\d{5}$"
                  placeholder="44000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rf-tel">Téléphone *</Label>
                <Input id="rf-tel" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="rf-email">Email *</Label>
                <Input id="rf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
          </fieldset>

          {/* ── SECTION 3: Appareil ───────────────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Informations appareil
            </legend>

            <div>
              <Label htmlFor="rf-modele">Modèle *</Label>
              <Input
                id="rf-modele"
                value={modele}
                onChange={(e) => setModele(e.target.value)}
                placeholder="ex: iPhone 14 Pro, Samsung Galaxy S23 Ultra"
                required
              />
            </div>

            {/* Test téléphone */}
            <div>
              <Label className="mb-2 block">Test du téléphone * <span className="text-xs text-muted-foreground">({testTelephone.length} sélectionné{testTelephone.length > 1 ? "s" : ""})</span></Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto border rounded-lg p-3">
                {TESTS_TELEPHONE.map((test) => (
                  <label key={test} className="flex items-start gap-2 text-sm cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                    <input
                      type="checkbox"
                      checked={testTelephone.includes(test)}
                      onChange={() => toggleTest(test)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet focus:ring-violet"
                    />
                    <span className="leading-tight">{test}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tiroir SIM */}
            <div>
              <Label className="mb-2 block">Tiroir SIM présent ? *</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="tiroir-sim"
                    checked={tiroirSim === true}
                    onChange={() => setTiroirSim(true)}
                    className="h-4 w-4 text-violet focus:ring-violet"
                  />
                  Oui
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="tiroir-sim"
                    checked={tiroirSim === false}
                    onChange={() => setTiroirSim(false)}
                    className="h-4 w-4 text-violet focus:ring-violet"
                  />
                  Non
                </label>
              </div>
            </div>

            {/* Pièces à changer */}
            <div className={sav ? "opacity-50 pointer-events-none" : ""}>
              <Label className="mb-2 block">Pièces à changer {!sav && "*"} <span className="text-xs text-muted-foreground">({piecesAChanger.length} sélectionnée{piecesAChanger.length > 1 ? "s" : ""})</span></Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 border rounded-lg p-3">
                {PIECES_A_CHANGER.map((piece) => (
                  <label key={piece} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:bg-gray-50 rounded px-1">
                    <input
                      type="checkbox"
                      checked={piecesAChanger.includes(piece)}
                      onChange={() => togglePiece(piece)}
                      className="h-4 w-4 rounded border-gray-300 text-violet focus:ring-violet"
                    />
                    {piece}
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className={sav ? "opacity-50 pointer-events-none" : ""}>
              <Label className="mb-2 block">
                Photos état du téléphone {!sav && "*"}
                <span className="text-xs text-muted-foreground ml-2">
                  {totalPhotos}/3{totalPhotos < 3 && !sav ? ` — ${3 - totalPhotos} manquante${3 - totalPhotos > 1 ? "s" : ""}` : ""}
                </span>
              </Label>

              {/* Existing photos */}
              {existingPhotos.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {existingPhotos.map((path, i) => (
                    <div key={path} className="relative w-20 h-20 rounded-lg border overflow-hidden bg-gray-100">
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Photo {i + 1}</div>
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(i)}
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New photo previews */}
              {newFiles.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {newFiles.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg border overflow-hidden">
                      <img src={f.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {totalPhotos < 3 && (
                <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer hover:border-violet/50 transition-colors">
                  <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-sm font-medium">Ajouter une photo</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, HEIC — max 5 Mo</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                </label>
              )}
            </div>
          </fieldset>

          {/* ── SECTION 4: Vente & Tarif ──────────────────────────── */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Vente complémentaire & tarif
            </legend>

            {/* Upsell batterie */}
            <div>
              <Label className="mb-2 block text-sm">On vous change la batterie ? Vous bénéficiez de 20% de remise sur celle-ci !</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="upsell-bat" checked={upsellBatterie === true} onChange={() => setUpsellBatterie(true)} className="h-4 w-4 text-violet focus:ring-violet" />
                  Oui
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="upsell-bat" checked={upsellBatterie === false} onChange={() => setUpsellBatterie(false)} className="h-4 w-4 text-violet focus:ring-violet" />
                  Non
                </label>
              </div>
            </div>

            {/* Upsell protection */}
            <div>
              <Label className="mb-2 block text-sm">On vous met une protection d&apos;écran ? <span className="text-xs text-muted-foreground">(Si &quot;non&quot; on insiste pour le bien du client)</span></Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="upsell-prot" checked={upsellProtection === true} onChange={() => setUpsellProtection(true)} className="h-4 w-4 text-violet focus:ring-violet" />
                  Oui
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="upsell-prot" checked={upsellProtection === false} onChange={() => setUpsellProtection(false)} className="h-4 w-4 text-violet focus:ring-violet" />
                  Non
                </label>
              </div>
            </div>

            {/* SAV */}
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={sav}
                  onChange={(e) => {
                    setSav(e.target.checked);
                    if (e.target.checked) setTarif(0);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-violet focus:ring-violet"
                />
                <span className="font-semibold">SAV (réparation sous garantie)</span>
              </label>
            </div>

            {/* Tarif */}
            <div className={sav ? "opacity-50 pointer-events-none" : ""}>
              <Label htmlFor="rf-tarif">Tarif (€) {!sav && "*"}</Label>
              <Input
                id="rf-tarif"
                type="number"
                step="0.01"
                min="0"
                value={sav ? 0 : tarif}
                onChange={(e) => setTarif(parseFloat(e.target.value) || 0)}
                disabled={sav}
              />
            </div>
          </fieldset>

          {/* ── Magasin & Notes ────────────────────────────────────── */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-violet uppercase tracking-wide">
              Magasin & notes
            </legend>
            <div>
              <Label htmlFor="rf-magasin">Magasin *</Label>
              {availableMagasins.length === 1 ? (
                <Input value={`${availableMagasins[0].nom} — ${availableMagasins[0].ville}`} disabled />
              ) : (
                <Select value={magasinId} onValueChange={setMagasinId}>
                  <SelectTrigger id="rf-magasin">
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
              <Label htmlFor="rf-notes">Notes internes</Label>
              <Textarea
                id="rf-notes"
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
            {submitting
              ? "Enregistrement..."
              : mode === "create"
                ? "Créer la prise en charge"
                : "Enregistrer les modifications"
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
