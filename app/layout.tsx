import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Vigus'B - Téléphones reconditionnés & Réparation",
  description: "14 magasins spécialisés en téléphonie d'occasion, reconditionnée, accessoires et réparation de smartphones. Garantie 24 mois. Certifié QualiRepar.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
