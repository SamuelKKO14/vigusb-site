export type MagasinData = {
  nom: string
  adresse: string
  tel: string
  parking: string
}

export const MAGASINS_DATA: Record<number, MagasinData> = {
  1:  { nom: "Nantes",            adresse: "Centre-ville Nantes",        tel: "02 40 XX XX XX", parking: "Parking Bouffay" },
  2:  { nom: "Rennes",            adresse: "Centre-ville Rennes",        tel: "02 99 XX XX XX", parking: "Parking Saint-Anne" },
  3:  { nom: "Angers",            adresse: "Centre-ville Angers",        tel: "02 41 XX XX XX", parking: "Parking La Rochefoucauld" },
  4:  { nom: "Toulouse",          adresse: "Centre-ville Toulouse",      tel: "05 61 XX XX XX", parking: "Parking Esquirol" },
  5:  { nom: "Tours",             adresse: "Quartier Gare Tours",        tel: "02 47 XX XX XX", parking: "Parking Gare" },
  6:  { nom: "Le Mans",           adresse: "Centre-ville Le Mans",       tel: "02 43 XX XX XX", parking: "Parking République" },
  7:  { nom: "Le Mans Jacobins",  adresse: "CC Jacobins Le Mans",        tel: "02 43 XX XX XX", parking: "Parking Jacobins" },
  8:  { nom: "Bordeaux",          adresse: "Centre-ville Bordeaux",      tel: "05 56 XX XX XX", parking: "Parking Gambetta" },
  9:  { nom: "Saint-Nazaire",     adresse: "CC Auchan Océanis",          tel: "02 40 XX XX XX", parking: "Parking Auchan" },
  10: { nom: "Nantes Paridis",    adresse: "CC Leclerc Paridis Nantes",  tel: "02 40 XX XX XX", parking: "Parking Leclerc" },
  11: { nom: "Trignac",           adresse: "CC Auchan Trignac",          tel: "02 40 XX XX XX", parking: "Parking Auchan" },
  12: { nom: "Rennes Colombia",   adresse: "CC Colombia Rennes",         tel: "02 99 XX XX XX", parking: "Parking Colombia" },
  13: { nom: "Guérande",          adresse: "CC Leclerc Guérande",        tel: "02 40 XX XX XX", parking: "Parking Leclerc" },
  14: { nom: "Saint Grégoire",    adresse: "CC Leclerc Saint Grégoire",  tel: "02 99 XX XX XX", parking: "Parking Leclerc" },
}

export type VilleSEO = {
  slug: string
  nom: string
  cp: string
  magasin_id: number
  parking: string
  distance: string
}

export const VILLES_SEO: VilleSEO[] = [
  // ── NANTES (magasin 1) ──────────────────────────────────────────────────────
  { slug: "reze",              nom: "Rezé",              cp: "44400", magasin_id: 1, parking: "Parking Bouffay",        distance: "8 min" },
  { slug: "saint-herblain",   nom: "Saint-Herblain",    cp: "44800", magasin_id: 1, parking: "Parking Leclerc",        distance: "10 min" },
  { slug: "orvault",          nom: "Orvault",           cp: "44700", magasin_id: 1, parking: "Parking centre",         distance: "12 min" },
  { slug: "vertou",           nom: "Vertou",            cp: "44120", magasin_id: 1, parking: "Parking mairie",         distance: "15 min" },
  { slug: "carquefou",        nom: "Carquefou",         cp: "44470", magasin_id: 1, parking: "Parking place centrale", distance: "18 min" },
  { slug: "bouguenais",       nom: "Bouguenais",        cp: "44340", magasin_id: 1, parking: "Parking mairie",         distance: "14 min" },

  // ── RENNES (magasin 2) ──────────────────────────────────────────────────────
  { slug: "cesson-sevigne",   nom: "Cesson-Sévigné",   cp: "35510", magasin_id: 2, parking: "Parking Via Silva",      distance: "10 min" },
  { slug: "bruz",             nom: "Bruz",              cp: "35170", magasin_id: 2, parking: "Parking centre",         distance: "15 min" },
  { slug: "pace",             nom: "Pacé",              cp: "35740", magasin_id: 2, parking: "Parking mairie",         distance: "14 min" },
  { slug: "betton",           nom: "Betton",            cp: "35830", magasin_id: 2, parking: "Parking place",          distance: "16 min" },
  { slug: "chantepie",        nom: "Chantepie",         cp: "35135", magasin_id: 2, parking: "Parking centre",         distance: "11 min" },

  // ── BORDEAUX (magasin 8) ────────────────────────────────────────────────────
  { slug: "merignac",         nom: "Mérignac",          cp: "33700", magasin_id: 8, parking: "Parking Mérignac centre", distance: "12 min" },
  { slug: "pessac",           nom: "Pessac",            cp: "33600", magasin_id: 8, parking: "Parking Clémenceau",      distance: "14 min" },
  { slug: "talence",          nom: "Talence",           cp: "33400", magasin_id: 8, parking: "Parking Gambetta",        distance: "10 min" },
  { slug: "begles",           nom: "Bègles",            cp: "33130", magasin_id: 8, parking: "Parking centre",          distance: "12 min" },

  // ── TOULOUSE (magasin 4) ────────────────────────────────────────────────────
  { slug: "blagnac",          nom: "Blagnac",           cp: "31700", magasin_id: 4, parking: "Parking aéroport",       distance: "15 min" },
  { slug: "colomiers",        nom: "Colomiers",         cp: "31770", magasin_id: 4, parking: "Parking Leclerc",        distance: "18 min" },
  { slug: "labege",           nom: "Labège",            cp: "31670", magasin_id: 4, parking: "Parking Innopole",       distance: "14 min" },
  { slug: "tournefeuille",    nom: "Tournefeuille",     cp: "31170", magasin_id: 4, parking: "Parking mairie",         distance: "16 min" },

  // ── ANGERS (magasin 3) ──────────────────────────────────────────────────────
  { slug: "trelaze",          nom: "Trélazé",           cp: "49800", magasin_id: 3, parking: "Parking centre",         distance: "12 min" },
  { slug: "avrille",          nom: "Avrillé",           cp: "49240", magasin_id: 3, parking: "Parking mairie",         distance: "11 min" },
  { slug: "les-ponts-de-ce",  nom: "Les Ponts-de-Cé",  cp: "49130", magasin_id: 3, parking: "Parking Loire",          distance: "14 min" },
]
