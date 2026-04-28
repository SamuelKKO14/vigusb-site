"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/compress-image";
import { Upload, X, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketDisplay } from "@/components/ticket-display";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  reparation: {
    id: string;
    ticket_number: string;
    prenom: string;
    nom: string;
    marque: string;
    modele: string;
    statut: string;
  };
  userId: string;
}

interface FilePreview {
  file: File;
  preview: string;
}

const MAX_FILES = 4;
const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif"];

export function ReceptionClient({ reparation, userId }: Props) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const valid = Array.from(newFiles).filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) {
          toast({ variant: "destructive", title: `Format non supporté : ${f.name}` });
          return false;
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
          toast({ variant: "destructive", title: `Fichier trop lourd : ${f.name} (max ${MAX_SIZE_MB}MB)` });
          return false;
        }
        return true;
      });

      setFiles((prev) => {
        const remaining = MAX_FILES - prev.length;
        const toAdd = valid.slice(0, remaining);
        return [
          ...prev,
          ...toAdd.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ];
      });
    },
    [toast]
  );

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  async function handleUploadAndConfirm() {
    if (files.length === 0) {
      toast({ variant: "destructive", title: "Ajoute au moins une photo" });
      return;
    }

    setUploading(true);
    const supabase = createClient();

    try {
      for (const { file } of files) {
        // Compress
        const compressed = await compressImage(file);

        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${reparation.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("reparation-photos")
          .upload(path, compressed, { contentType: compressed.type });

        if (uploadError) throw uploadError;

        await supabase.from("reparation_photos").insert({
          reparation_id: reparation.id,
          storage_path: path,
          type: "reception",
          uploaded_by: userId,
        });
      }

      // Change statut to 'recue' via Edge Function
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
            nouveau_statut: "recue",
            commentaire: `${files.length} photo(s) de réception uploadée(s)`,
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur changement statut");

      toast({ title: "Réception confirmée !" });
      router.push(`/dashboard/reparations/${reparation.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erreur pendant l'upload" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/reparations/${reparation.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">Réception</h1>
          <p className="text-sm text-muted-foreground">
            Upload des photos du téléphone
          </p>
        </div>
      </div>

      {/* Info client */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <TicketDisplay ticket={reparation.ticket_number} />
            <p className="mt-2 font-semibold text-lg">
              {reparation.prenom} {reparation.nom}
            </p>
            <p className="text-sm text-muted-foreground">
              {reparation.marque} {reparation.modele}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload zone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Photos de réception ({files.length}/{MAX_FILES})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Drop zone */}
          <label
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
              dragActive
                ? "border-violet bg-violet/5"
                : "border-gray-300 hover:border-violet/50",
              files.length >= MAX_FILES && "opacity-50 pointer-events-none"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Glisse tes photos ici ou clique
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, HEIC — max {MAX_SIZE_MB}MB
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
              disabled={files.length >= MAX_FILES}
            />
          </label>

          {/* Previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={f.preview}
                    alt={`Photo ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Confirm button */}
          <Button
            className="w-full bg-vert hover:bg-vert-dark text-white gap-2"
            size="lg"
            onClick={handleUploadAndConfirm}
            disabled={uploading || files.length === 0}
          >
            {uploading ? (
              "Upload en cours..."
            ) : (
              <>
                <Check className="h-4 w-4" /> Confirmer réception
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
