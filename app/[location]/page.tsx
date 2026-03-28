import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PageSEOLocale from '@/components/PageSEOLocale'
import SearchBarSEO from '@/components/SearchBarSEO'
import { VILLES_SEO, MAGASINS_DATA } from '@/lib/villes-seo'

type Props = { params: Promise<{ location: string }> }

export async function generateStaticParams() {
  return VILLES_SEO.map((v) => ({ location: `vigusb-${v.slug}` }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params
  if (!location.startsWith('vigusb-')) return { title: 'Page introuvable' }

  const slug = location.replace('vigusb-', '')
  const ville = VILLES_SEO.find(v => v.slug === slug)
  if (!ville) return { title: 'Page introuvable' }

  const magasin = MAGASINS_DATA[ville.magasin_id]
  const title = `Réparation téléphone ${ville.nom} — Vigus'B ${magasin.nom} | Devis gratuit`
  const description = `Vigus'B répare vos téléphones et tablettes à ${ville.nom} (${ville.cp}). Magasin ${magasin.nom} à ${ville.distance}. iPhone, Samsung, Xiaomi — garantie 24 mois, certifié QualiRepar.`
  const url = `https://www.vigusb.fr/vigusb-${ville.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

export default async function VigusbVillePage({ params }: Props) {
  const { location } = await params

  if (!location.startsWith('vigusb-')) notFound()

  const slug = location.replace('vigusb-', '')
  const ville = VILLES_SEO.find(v => v.slug === slug)
  if (!ville) notFound()

  const magasin = MAGASINS_DATA[ville.magasin_id]

  return (
    <PageSEOLocale
      ville={ville}
      magasin={magasin}
      pageType="telephone"
      afterHeroSlot={<SearchBarSEO magasinId={ville.magasin_id} />}
    />
  )
}
