// 22 items du checklist "Test du téléphone"
export const TESTS_TELEPHONE = [
  "Écran cassé",
  "Écran HS (donc test impossible)",
  "Batterie HS (donc test impossible)",
  "Téléphone bloqué (donc test impossible)",
  "Lentille appareil photo cassée",
  "Vitre arrière cassée",
  "Connecteur de charge (ne prend pas la charge)",
  "Bouton power HS",
  "Bouton volume HS",
  "Bouton Home HS",
  "Appareil photo avant HS",
  "Appareil photo arrière HS",
  "Haut-parleur principal HS",
  "Écouteur interne HS",
  "Micro HS",
  "Empreinte digitale HS",
  "Face ID HS",
  "Réseaux HS",
  "Vibreur HS",
  "Téléphone a pris l'eau (Oxydation)",
  "TEST COMPLET OK",
] as const;

// 15 items du checklist "Pièces à changer"
export const PIECES_A_CHANGER = [
  "LCD",
  "Batterie",
  "Lentille APN",
  "Vitre arrière",
  "Connecteur de charge",
  "Appareil photo avant",
  "Appareil photo arrière",
  "Écouteur interne",
  "Haut-parleur",
  "Bouton power",
  "Bouton volume",
  "Bouton home",
  "Micro",
  "Empreinte digitale",
  "Vibreur",
] as const;

// Statuts workflow
export const STATUTS = {
  recue: "Reçue",
  diagnostic: "En diagnostic",
  en_reparation: "En réparation",
  prete: "Prête",
  recuperee: "Récupérée",
  annulee: "Annulée",
} as const;

export type Statut = keyof typeof STATUTS;
