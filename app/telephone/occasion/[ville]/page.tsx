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
  const title = `Téléphone Reconditionné ${ville.nom} — Vigus'B | Dès 99€, garantie 24 mois`
  const description = `Achetez un téléphone reconditionné près de ${ville.nom}. iPhone, Samsung, Xiaomi garantis 24 mois jusqu'à -60% vs neuf. Magasin Vigus'B à ${ville.distance} de ${ville.nom}.`
  const url = `https://www.vigusb.fr/telephone/occasion/${ville.slug}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } }
}

export default async function Page({ params }: Props) {
  const { ville: slug } = await params
  const ville = VILLES_SEO.find(v => v.slug === slug)
  if (!ville) notFound()
  const magasin = MAGASINS_DATA[ville.magasin_id]
  return <PageSEOLocale ville={ville} magasin={magasin} pageType="occasion" />
}
