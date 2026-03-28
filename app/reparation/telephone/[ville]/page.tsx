import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PageSEOLocale from '@/components/PageSEOLocale'
import { VILLES_SEO, MAGASINS_DATA } from '@/lib/villes-seo'

type Props = { params: Promise<{ ville: string }> }

export async function generateStaticParams() {
  return VILLES_SEO.map((v) => ({ ville: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville: slug } = await params
  const ville = VILLES_SEO.find(v => v.slug === slug)
  if (!ville) return { title: 'Page introuvable' }
  const title = `Réparation Téléphone ${ville.nom} (${ville.cp}) — Vigus'B | Devis gratuit`
  const description = `Réparation téléphone à ${ville.nom} ? Vigus'B répare votre iPhone, Samsung, Xiaomi, Google Pixel au meilleur prix. Garantie 24 mois, certifié QualiRepar. Magasin à ${ville.distance} de ${ville.nom}.`
  const url = `https://www.vigusb.fr/reparation/telephone/${ville.slug}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } }
}

export default async function Page({ params }: Props) {
  const { ville: slug } = await params
  const ville = VILLES_SEO.find(v => v.slug === slug)
  if (!ville) notFound()
  const magasin = MAGASINS_DATA[ville.magasin_id]
  return <PageSEOLocale ville={ville} magasin={magasin} pageType="telephone" />
}
