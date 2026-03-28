export type VilleSEO = {
  slug: string
  nom: string
  magasin_proche: string
  distance: string
  magasin_id: number
}

export const VILLES_SEO: VilleSEO[] = [
  // AUTOUR DE NANTES (magasin id: 1)
  { slug: "reze", nom: "Rezé", magasin_proche: "Nantes", distance: "8 min", magasin_id: 1 },
  { slug: "saint-herblain", nom: "Saint-Herblain", magasin_proche: "Nantes", distance: "10 min", magasin_id: 1 },
  { slug: "orvault", nom: "Orvault", magasin_proche: "Nantes", distance: "12 min", magasin_id: 1 },
  { slug: "vertou", nom: "Vertou", magasin_proche: "Nantes", distance: "15 min", magasin_id: 1 },
  { slug: "carquefou", nom: "Carquefou", magasin_proche: "Nantes", distance: "18 min", magasin_id: 1 },
  { slug: "bouguenais", nom: "Bouguenais", magasin_proche: "Nantes", distance: "14 min", magasin_id: 1 },
  { slug: "sainte-luce-sur-loire", nom: "Sainte-Luce-sur-Loire", magasin_proche: "Nantes", distance: "16 min", magasin_id: 1 },
  { slug: "basse-goulaine", nom: "Basse-Goulaine", magasin_proche: "Nantes", distance: "20 min", magasin_id: 1 },

  // AUTOUR DE RENNES (magasin id: 2)
  { slug: "cesson-sevigne", nom: "Cesson-Sévigné", magasin_proche: "Rennes", distance: "10 min", magasin_id: 2 },
  { slug: "bruz", nom: "Bruz", magasin_proche: "Rennes", distance: "15 min", magasin_id: 2 },
  { slug: "vezin-le-coquet", nom: "Vézin-le-Coquet", magasin_proche: "Rennes", distance: "12 min", magasin_id: 2 },
  { slug: "pace", nom: "Pacé", magasin_proche: "Rennes", distance: "14 min", magasin_id: 2 },
  { slug: "betton", nom: "Betton", magasin_proche: "Rennes", distance: "16 min", magasin_id: 2 },
  { slug: "chantepie", nom: "Chantepie", magasin_proche: "Rennes", distance: "11 min", magasin_id: 2 },

  // AUTOUR DE BORDEAUX (magasin id: 8)
  { slug: "merignac", nom: "Mérignac", magasin_proche: "Bordeaux", distance: "12 min", magasin_id: 8 },
  { slug: "pessac", nom: "Pessac", magasin_proche: "Bordeaux", distance: "14 min", magasin_id: 8 },
  { slug: "talence", nom: "Talence", magasin_proche: "Bordeaux", distance: "10 min", magasin_id: 8 },
  { slug: "villenave-dornon", nom: "Villenave-d'Ornon", magasin_proche: "Bordeaux", distance: "15 min", magasin_id: 8 },
  { slug: "begles", nom: "Bègles", magasin_proche: "Bordeaux", distance: "12 min", magasin_id: 8 },

  // AUTOUR DE TOULOUSE (magasin id: 4)
  { slug: "blagnac", nom: "Blagnac", magasin_proche: "Toulouse", distance: "15 min", magasin_id: 4 },
  { slug: "colomiers", nom: "Colomiers", magasin_proche: "Toulouse", distance: "18 min", magasin_id: 4 },
  { slug: "labege", nom: "Labège", magasin_proche: "Toulouse", distance: "14 min", magasin_id: 4 },
  { slug: "muret", nom: "Muret", magasin_proche: "Toulouse", distance: "25 min", magasin_id: 4 },
  { slug: "tournefeuille", nom: "Tournefeuille", magasin_proche: "Toulouse", distance: "16 min", magasin_id: 4 },

  // AUTOUR D'ANGERS (magasin id: 3)
  { slug: "saint-barthelemy-dangers", nom: "Saint-Barthélemy-d'Anjou", magasin_proche: "Angers", distance: "10 min", magasin_id: 3 },
  { slug: "trelaze", nom: "Trélazé", magasin_proche: "Angers", distance: "12 min", magasin_id: 3 },
  { slug: "les-ponts-de-ce", nom: "Les Ponts-de-Cé", magasin_proche: "Angers", distance: "14 min", magasin_id: 3 },
  { slug: "avrille", nom: "Avrillé", magasin_proche: "Angers", distance: "11 min", magasin_id: 3 },
]
