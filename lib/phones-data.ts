export type PhoneSpecs = {
  ecran: string
  processeur: string
  ram: string
  stockage: string[]
  batterie: string
  camera_principale: string
  camera_frontale: string
  os: string
  connectivite: string
  dimensions: string
  poids: string
  resistance?: string
}

export type Phone = {
  slug: string
  marque: string
  modele: string
  annee: number
  image: string
  specs: PhoneSpecs
  prix_reparation: {
    ecran: number
    batterie: number
    connecteur: number
    camera: number
    vitre_arriere: number
  }
  prix_reconditionne: Record<string, number>
}

export const PHONES_DATABASE: Phone[] = [
  // ── APPLE ─────────────────────────────────────────────────────────────────
  {
    slug: 'apple-iphone-15-pro-max',
    marque: 'Apple', modele: 'iPhone 15 Pro Max', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
    specs: {
      ecran: '6.7" Super Retina XDR OLED, 120Hz ProMotion',
      processeur: 'Apple A17 Pro (3nm)',
      ram: '8 Go',
      stockage: ['256 Go', '512 Go', '1 To'],
      batterie: '4441 mAh, charge rapide 27W',
      camera_principale: '48MP f/1.8 + 12MP Ultra Wide + 12MP 5x Téléobjectif',
      camera_frontale: '12MP TrueDepth',
      os: 'iOS 17 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C',
      dimensions: '159.9 x 76.7 x 8.3 mm', poids: '221g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 289, batterie: 89, connecteur: 79, camera: 119, vitre_arriere: 149 },
    prix_reconditionne: { 'Comme neuf': 999, 'Très bon état': 849, 'Bon état': 749, 'État correct': 649 },
  },
  {
    slug: 'apple-iphone-15-pro',
    marque: 'Apple', modele: 'iPhone 15 Pro', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg',
    specs: {
      ecran: '6.1" Super Retina XDR OLED, 120Hz ProMotion',
      processeur: 'Apple A17 Pro (3nm)', ram: '8 Go',
      stockage: ['128 Go', '256 Go', '512 Go', '1 To'],
      batterie: '3274 mAh, charge rapide 27W',
      camera_principale: '48MP f/1.8 + 12MP Ultra Wide + 12MP 3x Téléobjectif',
      camera_frontale: '12MP TrueDepth', os: 'iOS 17 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C',
      dimensions: '146.6 x 70.6 x 8.3 mm', poids: '187g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 259, batterie: 89, connecteur: 79, camera: 109, vitre_arriere: 139 },
    prix_reconditionne: { 'Comme neuf': 899, 'Très bon état': 749, 'Bon état': 649, 'État correct': 549 },
  },
  {
    slug: 'apple-iphone-15',
    marque: 'Apple', modele: 'iPhone 15', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg',
    specs: {
      ecran: '6.1" Super Retina XDR OLED, 60Hz',
      processeur: 'Apple A16 Bionic (4nm)', ram: '6 Go',
      stockage: ['128 Go', '256 Go', '512 Go'],
      batterie: '3349 mAh',
      camera_principale: '48MP f/1.6 + 12MP Ultra Wide',
      camera_frontale: '12MP TrueDepth', os: 'iOS 17 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6, Bluetooth 5.3, NFC, USB-C',
      dimensions: '147.6 x 71.6 x 7.8 mm', poids: '171g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 229, batterie: 79, connecteur: 69, camera: 99, vitre_arriere: 119 },
    prix_reconditionne: { 'Comme neuf': 699, 'Très bon état': 599, 'Bon état': 519, 'État correct': 429 },
  },
  {
    slug: 'apple-iphone-14-pro-max',
    marque: 'Apple', modele: 'iPhone 14 Pro Max', annee: 2022,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg',
    specs: {
      ecran: '6.7" Super Retina XDR OLED, 120Hz ProMotion',
      processeur: 'Apple A16 Bionic (4nm)', ram: '6 Go',
      stockage: ['128 Go', '256 Go', '512 Go', '1 To'],
      batterie: '4323 mAh',
      camera_principale: '48MP f/1.78 + 12MP Ultra Wide + 12MP 3x Téléobjectif',
      camera_frontale: '12MP TrueDepth', os: 'iOS 16 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6, Bluetooth 5.3, NFC, Lightning',
      dimensions: '160.7 x 77.6 x 7.9 mm', poids: '240g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 249, batterie: 79, connecteur: 69, camera: 109, vitre_arriere: 129 },
    prix_reconditionne: { 'Comme neuf': 799, 'Très bon état': 679, 'Bon état': 579, 'État correct': 479 },
  },
  {
    slug: 'apple-iphone-14',
    marque: 'Apple', modele: 'iPhone 14', annee: 2022,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg',
    specs: {
      ecran: '6.1" Super Retina XDR OLED, 60Hz',
      processeur: 'Apple A15 Bionic (5nm)', ram: '6 Go',
      stockage: ['128 Go', '256 Go', '512 Go'],
      batterie: '3279 mAh',
      camera_principale: '12MP f/1.5 + 12MP Ultra Wide',
      camera_frontale: '12MP TrueDepth', os: 'iOS 16 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6, Bluetooth 5.3, NFC, Lightning',
      dimensions: '146.7 x 71.5 x 7.8 mm', poids: '172g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 199, batterie: 69, connecteur: 59, camera: 89, vitre_arriere: 99 },
    prix_reconditionne: { 'Comme neuf': 549, 'Très bon état': 459, 'Bon état': 389, 'État correct': 319 },
  },
  {
    slug: 'apple-iphone-13',
    marque: 'Apple', modele: 'iPhone 13', annee: 2021,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-1.jpg',
    specs: {
      ecran: '6.1" Super Retina XDR OLED, 60Hz',
      processeur: 'Apple A15 Bionic (5nm)', ram: '4 Go',
      stockage: ['128 Go', '256 Go', '512 Go'],
      batterie: '3227 mAh',
      camera_principale: '12MP f/1.6 + 12MP Ultra Wide',
      camera_frontale: '12MP TrueDepth', os: 'iOS 15 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6, Bluetooth 5.0, NFC, Lightning',
      dimensions: '146.7 x 71.5 x 7.65 mm', poids: '174g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 169, batterie: 59, connecteur: 49, camera: 79, vitre_arriere: 89 },
    prix_reconditionne: { 'Comme neuf': 399, 'Très bon état': 329, 'Bon état': 279, 'État correct': 229 },
  },
  {
    slug: 'apple-iphone-12',
    marque: 'Apple', modele: 'iPhone 12', annee: 2020,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-1.jpg',
    specs: {
      ecran: '6.1" Super Retina XDR OLED, 60Hz',
      processeur: 'Apple A14 Bionic (5nm)', ram: '4 Go',
      stockage: ['64 Go', '128 Go', '256 Go'],
      batterie: '2815 mAh',
      camera_principale: '12MP f/1.6 + 12MP Ultra Wide',
      camera_frontale: '12MP TrueDepth', os: 'iOS 14 (évolutif iOS 18)',
      connectivite: '5G, WiFi 6, Bluetooth 5.0, NFC, Lightning',
      dimensions: '146.7 x 71.5 x 7.4 mm', poids: '164g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 129, batterie: 49, connecteur: 39, camera: 69, vitre_arriere: 79 },
    prix_reconditionne: { 'Comme neuf': 299, 'Très bon état': 249, 'Bon état': 209, 'État correct': 169 },
  },
  {
    slug: 'apple-iphone-11',
    marque: 'Apple', modele: 'iPhone 11', annee: 2019,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-11-2019-1.jpg',
    specs: {
      ecran: '6.1" Liquid Retina IPS LCD, 60Hz',
      processeur: 'Apple A13 Bionic (7nm)', ram: '4 Go',
      stockage: ['64 Go', '128 Go', '256 Go'],
      batterie: '3110 mAh',
      camera_principale: '12MP f/1.8 + 12MP Ultra Wide',
      camera_frontale: '12MP TrueDepth', os: 'iOS 13 (évolutif iOS 17)',
      connectivite: '4G LTE, WiFi 6, Bluetooth 5.0, NFC, Lightning',
      dimensions: '150.9 x 75.7 x 8.3 mm', poids: '194g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 99, batterie: 39, connecteur: 29, camera: 59, vitre_arriere: 59 },
    prix_reconditionne: { 'Comme neuf': 199, 'Très bon état': 159, 'Bon état': 129, 'État correct': 99 },
  },

  // ── SAMSUNG ────────────────────────────────────────────────────────────────
  {
    slug: 'samsung-galaxy-s24-ultra',
    marque: 'Samsung', modele: 'Galaxy S24 Ultra', annee: 2024,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-1.jpg',
    specs: {
      ecran: '6.8" Dynamic AMOLED 2X, 120Hz',
      processeur: 'Snapdragon 8 Gen 3 (4nm)', ram: '12 Go',
      stockage: ['256 Go', '512 Go', '1 To'],
      batterie: '5000 mAh, charge 45W',
      camera_principale: '200MP f/1.7 + 12MP Ultra Wide + 10MP 3x + 50MP 5x',
      camera_frontale: '12MP', os: 'Android 14 (One UI 6.1)',
      connectivite: '5G, WiFi 7, Bluetooth 5.3, NFC, USB-C',
      dimensions: '162.3 x 79 x 8.6 mm', poids: '232g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 319, batterie: 89, connecteur: 79, camera: 129, vitre_arriere: 149 },
    prix_reconditionne: { 'Comme neuf': 999, 'Très bon état': 849, 'Bon état': 729, 'État correct': 619 },
  },
  {
    slug: 'samsung-galaxy-s24',
    marque: 'Samsung', modele: 'Galaxy S24', annee: 2024,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-1.jpg',
    specs: {
      ecran: '6.2" Dynamic AMOLED 2X, 120Hz',
      processeur: 'Snapdragon 8 Gen 3 (4nm)', ram: '8 Go',
      stockage: ['128 Go', '256 Go'],
      batterie: '4000 mAh, charge 25W',
      camera_principale: '50MP f/1.8 + 12MP Ultra Wide + 10MP 3x',
      camera_frontale: '12MP', os: 'Android 14 (One UI 6.1)',
      connectivite: '5G, WiFi 7, Bluetooth 5.3, NFC, USB-C',
      dimensions: '147 x 70.6 x 7.6 mm', poids: '167g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 249, batterie: 79, connecteur: 69, camera: 99, vitre_arriere: 119 },
    prix_reconditionne: { 'Comme neuf': 699, 'Très bon état': 589, 'Bon état': 499, 'État correct': 409 },
  },
  {
    slug: 'samsung-galaxy-s23-ultra',
    marque: 'Samsung', modele: 'Galaxy S23 Ultra', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg',
    specs: {
      ecran: '6.8" Dynamic AMOLED 2X, 120Hz',
      processeur: 'Snapdragon 8 Gen 2 (4nm)', ram: '8 Go / 12 Go',
      stockage: ['256 Go', '512 Go', '1 To'],
      batterie: '5000 mAh, charge 45W',
      camera_principale: '200MP f/1.7 + 12MP Ultra Wide + 10MP 3x + 10MP 10x',
      camera_frontale: '12MP', os: 'Android 13 (One UI 5.1)',
      connectivite: '5G, WiFi 6E, Bluetooth 5.3, NFC, USB-C',
      dimensions: '163.4 x 78.1 x 8.9 mm', poids: '234g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 289, batterie: 89, connecteur: 79, camera: 119, vitre_arriere: 139 },
    prix_reconditionne: { 'Comme neuf': 799, 'Très bon état': 679, 'Bon état': 579, 'État correct': 479 },
  },
  {
    slug: 'samsung-galaxy-a55',
    marque: 'Samsung', modele: 'Galaxy A55', annee: 2024,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg',
    specs: {
      ecran: '6.6" Super AMOLED, 120Hz',
      processeur: 'Exynos 1480 (4nm)', ram: '8 Go',
      stockage: ['128 Go', '256 Go'],
      batterie: '5000 mAh, charge 25W',
      camera_principale: '50MP f/1.8 + 12MP Ultra Wide + 5MP Macro',
      camera_frontale: '32MP', os: 'Android 14 (One UI 6.1)',
      connectivite: '5G, WiFi 6, Bluetooth 5.3, NFC, USB-C',
      dimensions: '161.1 x 77.4 x 8.2 mm', poids: '213g', resistance: 'IP67',
    },
    prix_reparation: { ecran: 149, batterie: 59, connecteur: 49, camera: 79, vitre_arriere: 89 },
    prix_reconditionne: { 'Comme neuf': 349, 'Très bon état': 289, 'Bon état': 239, 'État correct': 189 },
  },

  // ── XIAOMI ─────────────────────────────────────────────────────────────────
  {
    slug: 'xiaomi-14-pro',
    marque: 'Xiaomi', modele: 'Xiaomi 14 Pro', annee: 2024,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-pro-1.jpg',
    specs: {
      ecran: '6.73" LTPO AMOLED, 120Hz',
      processeur: 'Snapdragon 8 Gen 3 (4nm)', ram: '12 Go / 16 Go',
      stockage: ['256 Go', '512 Go', '1 To'],
      batterie: '4880 mAh, charge 120W',
      camera_principale: '50MP f/1.42 Leica + 50MP Ultra Wide + 50MP 5x',
      camera_frontale: '32MP', os: 'Android 14 (MIUI 14)',
      connectivite: '5G, WiFi 7, Bluetooth 5.4, NFC, USB-C',
      dimensions: '161.4 x 75.3 x 8.5 mm', poids: '223g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 229, batterie: 79, connecteur: 69, camera: 109, vitre_arriere: 119 },
    prix_reconditionne: { 'Comme neuf': 799, 'Très bon état': 669, 'Bon état': 569, 'État correct': 469 },
  },
  {
    slug: 'xiaomi-redmi-note-13-pro',
    marque: 'Xiaomi', modele: 'Redmi Note 13 Pro', annee: 2024,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg',
    specs: {
      ecran: '6.67" AMOLED, 120Hz',
      processeur: 'Snapdragon 7s Gen 2 (4nm)', ram: '8 Go / 12 Go',
      stockage: ['128 Go', '256 Go', '512 Go'],
      batterie: '5100 mAh, charge 67W',
      camera_principale: '200MP f/1.65 + 8MP Ultra Wide + 2MP Macro',
      camera_frontale: '16MP', os: 'Android 13 (MIUI 14)',
      connectivite: '5G, WiFi 6, Bluetooth 5.2, NFC, USB-C',
      dimensions: '161.2 x 74.2 x 7.98 mm', poids: '187g', resistance: 'IP54',
    },
    prix_reparation: { ecran: 99, batterie: 49, connecteur: 39, camera: 69, vitre_arriere: 79 },
    prix_reconditionne: { 'Comme neuf': 249, 'Très bon état': 199, 'Bon état': 169, 'État correct': 139 },
  },

  // ── GOOGLE ─────────────────────────────────────────────────────────────────
  {
    slug: 'google-pixel-8-pro',
    marque: 'Google', modele: 'Pixel 8 Pro', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg',
    specs: {
      ecran: '6.7" LTPO OLED, 1-120Hz',
      processeur: 'Google Tensor G3 (4nm)', ram: '12 Go',
      stockage: ['128 Go', '256 Go', '1 To'],
      batterie: '5050 mAh, charge 30W',
      camera_principale: '50MP f/1.68 + 48MP Ultra Wide + 48MP 5x',
      camera_frontale: '10.5MP', os: 'Android 14',
      connectivite: '5G, WiFi 7, Bluetooth 5.3, NFC, USB-C',
      dimensions: '162.6 x 76.5 x 8.8 mm', poids: '213g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 249, batterie: 79, connecteur: 69, camera: 109, vitre_arriere: 119 },
    prix_reconditionne: { 'Comme neuf': 699, 'Très bon état': 589, 'Bon état': 499, 'État correct': 409 },
  },
  {
    slug: 'google-pixel-8',
    marque: 'Google', modele: 'Pixel 8', annee: 2023,
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg',
    specs: {
      ecran: '6.2" OLED, 60-120Hz',
      processeur: 'Google Tensor G3 (4nm)', ram: '8 Go',
      stockage: ['128 Go', '256 Go'],
      batterie: '4575 mAh, charge 27W',
      camera_principale: '50MP f/1.68 + 12MP Ultra Wide',
      camera_frontale: '10.5MP', os: 'Android 14',
      connectivite: '5G, WiFi 7, Bluetooth 5.3, NFC, USB-C',
      dimensions: '150.5 x 70.8 x 8.9 mm', poids: '187g', resistance: 'IP68',
    },
    prix_reparation: { ecran: 199, batterie: 69, connecteur: 59, camera: 89, vitre_arriere: 99 },
    prix_reconditionne: { 'Comme neuf': 499, 'Très bon état': 419, 'Bon état': 349, 'État correct': 289 },
  },
]

// Lookup slug by "marque|||modele" (lowercase)
export const PHONE_SLUG_LOOKUP = new Map<string, string>(
  PHONES_DATABASE.map(p => [
    `${p.marque.toLowerCase()}|||${p.modele.toLowerCase()}`,
    p.slug,
  ])
)

export function getPhoneSlug(marque: string, modele: string): string | undefined {
  return PHONE_SLUG_LOOKUP.get(`${marque.toLowerCase()}|||${modele.toLowerCase()}`)
}

export function getLowestPrice(phone: Phone): number {
  return Math.min(...Object.values(phone.prix_reconditionne))
}

export function getLowestRepairPrice(phone: Phone): number {
  return Math.min(...Object.values(phone.prix_reparation))
}
