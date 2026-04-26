"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  type: "reception" | "sortie";
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Aucune photo</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo)}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={photo.url}
              alt={`Photo ${photo.type}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <span
              className={cn(
                "absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white",
                photo.type === "reception" ? "bg-blue-600" : "bg-green-600"
              )}
            >
              {photo.type === "reception" ? "Réception" : "Sortie"}
            </span>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl p-2">
          {selected && (
            <img
              src={selected.url}
              alt={`Photo ${selected.type}`}
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
