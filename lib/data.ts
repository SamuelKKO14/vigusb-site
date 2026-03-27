export const MAGASINS = [
  { id: 1, nom: "Nantes", adresse: "Centre-ville Nantes", horaires: "Lun-Sam 10h-19h15", telephone: "02 40 XX XX XX", maps: "https://maps.google.com/?q=Nantes+centre" },
  { id: 2, nom: "Rennes", adresse: "Centre-ville Rennes", horaires: "Lun-Sam 10h-19h15", telephone: "02 99 XX XX XX", maps: "https://maps.google.com/?q=Rennes+centre" },
  { id: 3, nom: "Angers", adresse: "Centre-ville Angers", horaires: "Lun-Sam 10h-19h15", telephone: "02 41 XX XX XX", maps: "https://maps.google.com/?q=Angers+centre" },
  { id: 4, nom: "Toulouse", adresse: "Centre-ville Toulouse", horaires: "Lun-Sam 10h-19h15", telephone: "05 61 XX XX XX", maps: "https://maps.google.com/?q=Toulouse+centre" },
  { id: 5, nom: "Tours - Gare", adresse: "Quartier Gare Tours", horaires: "Lun-Sam 10h-19h15", telephone: "02 47 XX XX XX", maps: "https://maps.google.com/?q=Tours+gare" },
  { id: 6, nom: "Le Mans", adresse: "Centre-ville Le Mans", horaires: "Lun-Sam 10h-19h15", telephone: "02 43 XX XX XX", maps: "https://maps.google.com/?q=Le+Mans+centre" },
  { id: 7, nom: "Le Mans - Jacobins", adresse: "CC Jacobins Le Mans", horaires: "Lun-Sam 10h-19h15", telephone: "02 43 XX XX XX", maps: "https://maps.google.com/?q=CC+Jacobins+Le+Mans" },
  { id: 8, nom: "Bordeaux", adresse: "Centre-ville Bordeaux", horaires: "Lun-Sam 10h-19h15", telephone: "05 56 XX XX XX", maps: "https://maps.google.com/?q=Bordeaux+centre" },
  { id: 9, nom: "Saint-Nazaire", adresse: "CC Auchan Océanis", horaires: "Lun-Sam 10h-19h15", telephone: "02 40 XX XX XX", maps: "https://maps.google.com/?q=Auchan+Oceanis+Saint-Nazaire" },
  { id: 10, nom: "Nantes - Paridis", adresse: "CC Leclerc Paridis Nantes", horaires: "Lun-Sam 10h-19h15", telephone: "02 40 XX XX XX", maps: "https://maps.google.com/?q=Leclerc+Paridis+Nantes" },
  { id: 11, nom: "Trignac", adresse: "CC Auchan Trignac", horaires: "Lun-Sam 10h-19h15", telephone: "02 40 XX XX XX", maps: "https://maps.google.com/?q=Auchan+Trignac" },
  { id: 12, nom: "Rennes - Colombia", adresse: "CC Colombia Rennes", horaires: "Lun-Sam 10h-19h15", telephone: "02 99 XX XX XX", maps: "https://maps.google.com/?q=CC+Colombia+Rennes" },
  { id: 13, nom: "Guérande", adresse: "CC Leclerc Guérande", horaires: "Lun-Sam 10h-19h15", telephone: "02 40 XX XX XX", maps: "https://maps.google.com/?q=Leclerc+Guerande" },
  { id: 14, nom: "Saint Grégoire", adresse: "CC Leclerc Saint Grégoire", horaires: "Lun-Sam 10h-19h15", telephone: "02 99 XX XX XX", maps: "https://maps.google.com/?q=Leclerc+Saint+Gregoire" },
]

export const MARQUES = [
  { id: 'apple', nom: 'Apple', emoji: '🍎', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 'samsung', nom: 'Samsung', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { id: 'xiaomi', nom: 'Xiaomi', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg' },
  { id: 'huawei', nom: 'Huawei', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Huawei_Standard_logo.svg' },
  { id: 'google', nom: 'Google Pixel', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { id: 'oneplus', nom: 'OnePlus', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/OnePlus_logo.svg' },
  { id: 'oppo', nom: 'Oppo', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/OPPO_LOGO_2019.svg' },
  { id: 'sony', nom: 'Sony', emoji: '📱', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { id: 'vivo', nom: 'Vivo', emoji: '📱', logoUrl: '' },
  { id: 'realme', nom: 'Realme', emoji: '📱', logoUrl: '' },
  { id: 'honor', nom: 'Honor', emoji: '📱', logoUrl: '' },
  { id: 'nintendo', nom: 'Nintendo', emoji: '🎮', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg' },
  { id: 'xbox', nom: 'Xbox', emoji: '🎮', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg' },
]

export const MODELES: Record<string, string[]> = {
  apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11 Pro', 'iPhone 11', 'iPhone XS', 'iPhone XR', 'iPhone X', 'iPhone SE'],
  samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22', 'Galaxy S21', 'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A35', 'Galaxy A34', 'Galaxy A25', 'Galaxy A15', 'Galaxy Note 20 Ultra'],
  xiaomi: ['Xiaomi 14', 'Xiaomi 13', 'Xiaomi 12', 'Redmi Note 13', 'Redmi Note 12', 'Redmi Note 11', 'Redmi Note 10', 'Poco X6', 'Poco X5', 'Poco F5'],
  huawei: ['P60 Pro', 'P50 Pro', 'P40 Pro', 'Mate 60 Pro', 'Nova 12', 'Nova 11'],
  google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6'],
  oneplus: ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus Nord 3', 'OnePlus Nord CE 3'],
  oppo: ['Find X7', 'Reno 11', 'Reno 10', 'A98', 'A78'],
  sony: ['Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V'],
  vivo: ['V29', 'V27', 'X90'],
  realme: ['GT 5', 'GT Neo 5', '11 Pro+'],
  honor: ['Magic 6 Pro', '90 Pro', '70'],
  nintendo: ['Switch OLED', 'Switch', 'Switch Lite'],
  xbox: ['Series X manette', 'Series S manette'],
}

export const PANNES = [
  { id: 'ecran', label: 'Écran cassé / fissuré', emoji: '📺', prixBase: 79 },
  { id: 'batterie', label: 'Batterie à remplacer', emoji: '🔋', prixBase: 49 },
  { id: 'charge', label: 'Connecteur de charge', emoji: '🔌', prixBase: 59 },
  { id: 'vitre_arriere', label: 'Vitre arrière cassée', emoji: '🪟', prixBase: 69 },
  { id: 'camera_avant', label: 'Caméra avant', emoji: '📷', prixBase: 59 },
  { id: 'camera_arriere', label: 'Caméra arrière', emoji: '📸', prixBase: 69 },
  { id: 'bouton', label: 'Bouton power/volume', emoji: '🔘', prixBase: 49 },
  { id: 'son', label: 'Problème son / micro', emoji: '🔊', prixBase: 49 },
  { id: 'eau', label: 'Dégât des eaux', emoji: '💧', prixBase: 89 },
  { id: 'autre', label: 'Autre problème', emoji: '🔧', prixBase: 0 },
]

export const PRODUITS_DEMO = [
  { id: '1', marque: 'Apple', modele: 'iPhone 14', stockage: '128 Go', etat: 'reconditionne', prix: 549, description: 'Excellent état, batterie > 90%', disponible: true, magasin_id: null },
  { id: '2', marque: 'Apple', modele: 'iPhone 13', stockage: '128 Go', etat: 'reconditionne', prix: 449, description: 'Très bon état, reconditionné grade A', disponible: true, magasin_id: null },
  { id: '3', marque: 'Apple', modele: 'iPhone 12', stockage: '64 Go', etat: 'occasion', prix: 299, description: 'Bon état général, légères traces', disponible: true, magasin_id: null },
  { id: '4', marque: 'Samsung', modele: 'Galaxy S23', stockage: '256 Go', etat: 'reconditionne', prix: 599, description: 'Comme neuf, reconditionné grade A+', disponible: true, magasin_id: null },
  { id: '5', marque: 'Samsung', modele: 'Galaxy S22', stockage: '128 Go', etat: 'reconditionne', prix: 449, description: 'Très bon état', disponible: true, magasin_id: null },
  { id: '6', marque: 'Samsung', modele: 'Galaxy A54', stockage: '128 Go', etat: 'occasion', prix: 249, description: 'Bon état, quelques micro-rayures', disponible: true, magasin_id: null },
  { id: '7', marque: 'Xiaomi', modele: 'Redmi Note 12', stockage: '128 Go', etat: 'reconditionne', prix: 199, description: 'Très bon état', disponible: true, magasin_id: null },
  { id: '8', marque: 'Apple', modele: 'iPhone 11', stockage: '64 Go', etat: 'occasion', prix: 219, description: 'Bon état général', disponible: true, magasin_id: null },
  { id: '9', marque: 'Samsung', modele: 'Galaxy S21', stockage: '128 Go', etat: 'occasion', prix: 299, description: 'Bon état, batterie > 85%', disponible: true, magasin_id: null },
  { id: '10', marque: 'Apple', modele: 'iPhone XR', stockage: '64 Go', etat: 'occasion', prix: 179, description: 'Bon état, écran parfait', disponible: true, magasin_id: null },
  { id: '11', marque: 'Google', modele: 'Pixel 7', stockage: '128 Go', etat: 'reconditionne', prix: 399, description: 'Comme neuf', disponible: true, magasin_id: null },
  { id: '12', marque: 'OnePlus', modele: 'OnePlus Nord 3', stockage: '256 Go', etat: 'reconditionne', prix: 329, description: 'Très bon état', disponible: true, magasin_id: null },
  { id: '13', marque: 'Apple', modele: 'iPhone SE', stockage: '64 Go', etat: 'occasion', prix: 149, description: 'Bon état', disponible: true, magasin_id: null },
  { id: '14', marque: 'Samsung', modele: 'Galaxy A35', stockage: '128 Go', etat: 'reconditionne', prix: 279, description: 'Très bon état', disponible: true, magasin_id: null },
  { id: '15', marque: 'Xiaomi', modele: 'Poco X5', stockage: '128 Go', etat: 'occasion', prix: 189, description: 'Bon état', disponible: true, magasin_id: null },
  { id: '16', marque: 'Apple', modele: 'iPhone 14 Pro', stockage: '256 Go', etat: 'reconditionne', prix: 799, description: 'Grade A+, comme neuf', disponible: true, magasin_id: null },
  { id: '17', marque: 'Samsung', modele: 'Galaxy S24', stockage: '128 Go', etat: 'reconditionne', prix: 699, description: 'Grade A, très bon état', disponible: true, magasin_id: null },
  { id: '18', marque: 'Huawei', modele: 'P40 Pro', stockage: '256 Go', etat: 'occasion', prix: 249, description: 'Bon état général', disponible: true, magasin_id: null },
  { id: '19', marque: 'Apple', modele: 'iPhone 15', stockage: '128 Go', etat: 'reconditionne', prix: 799, description: 'Quasi neuf, batterie > 95%', disponible: true, magasin_id: null },
  { id: '20', marque: 'Samsung', modele: 'Galaxy Note 20 Ultra', stockage: '256 Go', etat: 'occasion', prix: 349, description: 'Très bon état avec S-Pen', disponible: true, magasin_id: null },
]

export function generateTicketId(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const l1 = letters[Math.floor(Math.random() * letters.length)]
  const l2 = letters[Math.floor(Math.random() * letters.length)]
  const n1 = Math.floor(Math.random() * 10)
  const n2 = Math.floor(Math.random() * 10)
  return `#${l1}${l2}${n1}${n2}`
}
