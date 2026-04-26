"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Magasin {
  id: string;
  code: string;
  nom: string;
  ville: string;
}

interface MagasinSelectProps {
  magasins: Magasin[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showAll?: boolean;
}

export function MagasinSelect({
  magasins,
  value,
  onValueChange,
  placeholder = "Tous les magasins",
  showAll = false,
}: MagasinSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[220px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value="all">Tous les magasins</SelectItem>}
        {magasins.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.nom} ({m.ville})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
