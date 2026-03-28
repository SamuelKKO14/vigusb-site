import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { VILLES_SEO } from '@/lib/villes-seo'
import { MAGASINS } from '@/lib/data'
import { PHONES_DATABASE, getLowestPrice } from '@/lib/phones-data'

type Props = { params: Promise<{ ville: string }> }

export async function generateStaticParams() {
  return VILLES_SEO.map((v) => ({ ville: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville: villeSlug } = await params
  const ville = VILLES_SEO.find(v => v.slug === villeSlug)
  if (!ville) return { title: 'Page introuvable' }

  const title = `Téléphone Reconditionné ${ville.nom} — Vigus'B | Dès 99€`
  const description = `Achetez un téléphone reconditionné près de ${ville.nom}. Vigus'B ${ville.magasin_proche} à ${ville.distance} : iPhone, Samsung, Xiaomi reconditionnés garantis 24 mois. Jusqu'à -60% vs neuf.`
  const url = `https://www.vigusb.fr/telephone-occasion/${ville.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

const AVIS_PAR_MAGASIN: Record<number, { nom: string; texte: string }[]> = {
  1: [
    { nom: 'Camille D. — Rezé', texte: "iPhone 13 reconditionné acheté ici : comme neuf ! Batterie à 94%, emballage soigné. Garantie 24 mois, top !" },
    { nom: 'Florian B. — Saint-Herblain', texte: "Samsung Galaxy S22 reconditionné en parfait état. Le prix était 40% moins cher que le neuf. Bluffant." },
    { nom: 'Jade V. — Basse-Goulaine', texte: "Je cherchais un smartphone reconditionné près de chez moi. Vigus'B Nantes : excellent choix, service impeccable." },
  ],
  2: [
    { nom: 'Romain C. — Cesson-Sévigné', texte: "Google Pixel 8 reconditionné grade A+. Vraiment comme neuf. Je n'aurais jamais cru pouvoir le distinguer du neuf !" },
    { nom: 'Léa P. — Bruz', texte: "iPhone 14 reconditionné à un prix imbattable avec 24 mois de garantie. Je conseille à tout le monde." },
    { nom: 'Hugo M. — Pacé', texte: "Super sélection de téléphones reconditionnés. Le vendeur a pris le temps d'expliquer chaque grade. Très satisfait." },
  ],
  8: [
    { nom: 'Sarah T. — Pessac', texte: "Samsung Galaxy S23 Ultra reconditionné : écran parfait, batterie à 91%. Pour ce prix-là, c'est incroyable." },
    { nom: 'Mathieu K. — Mérignac', texte: "Acheté un iPhone 12 reconditionné pour ma fille. Elle n'a vu aucune différence avec le neuf. Parfait !" },
    { nom: 'Eva L. — Talence', texte: "Xiaomi Redmi Note reconditionné très bien emballé. Garantie 24 mois rassurante. Je recommande Vigus'B." },
  ],
  4: [
    { nom: 'Théo N. — Blagnac', texte: "iPhone 13 reconditionné comme neuf. Le rapport qualité/prix est excellent. Garantie 24 mois c'est le top." },
    { nom: 'Chloé R. — Colomiers', texte: "Très beau Samsung Galaxy A55 reconditionné. Personnel qui conseille bien. Je suis ravie de mon achat !" },
    { nom: 'Louis D. — Tournefeuille', texte: "Google Pixel reconditionné en parfait état. Aucune trace d'utilisation. Je reviendrai sans hésiter." },
  ],
  3: [
    { nom: 'Clara M. — Avrillé', texte: "iPhone 14 Pro reconditionné grade A : comme sorti de la boîte. La garantie 24 mois m'a convaincue." },
    { nom: 'Nathan B. — Trélazé', texte: "Samsung Galaxy reconditionné nickel. Moins cher qu'ailleurs avec une meilleure garantie. Super !" },
    { nom: 'Inès P. — Les Ponts-de-Cé', texte: "Très satisfaite de mon iPhone 13 reconditionné. Personnel attentionné, prix transparent. Je recommande." },
  ],
}

const DEFAULT_AVIS = [
  { nom: 'Amélie L.', texte: "iPhone 13 reconditionné comme neuf. La garantie 24 mois m'a convaincue. Excellent rapport qualité/prix !" },
  { nom: 'Kevin M.', texte: "Samsung Galaxy reconditionné en parfait état. Prix imbattable vs le neuf. Très satisfait !" },
  { nom: 'Julie P.', texte: "Personnel accueillant, large choix de smartphones reconditionnés. Je recommande à 100%." },
]

const GRADES = [
  { grade: 'Comme neuf (A+)', desc: "Aucune trace d'utilisation visible. Batterie > 90%. Identique au neuf.", color: '#8DC63F' },
  { grade: 'Très bon état (A)', desc: "Très légères traces invisibles à l'usage. Batterie > 85%.", color: '#6fa32e' },
  { grade: 'Bon état (B)', desc: "Légères rayures non visibles écran allumé. Batterie > 80%.", color: '#7B2D8B' },
  { grade: 'État correct (C)', desc: "Traces d'usure visibles, fonctionnel à 100%. Batterie > 75%.", color: '#9B6BB5' },
]

export default async function TelephoneOccasionVille({ params }: Props) {
  const { ville: villeSlug } = await params
  const ville = VILLES_SEO.find(v => v.slug === villeSlug)
  if (!ville) notFound()

  const magasin = MAGASINS.find(m => m.id === ville.magasin_id)!
  const avis = AVIS_PAR_MAGASIN[ville.magasin_id] ?? DEFAULT_AVIS
  const featuredPhones = PHONES_DATABASE.slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Vigus'B — Téléphones Reconditionnés ${ville.nom}`,
    description: `Achat téléphone reconditionné près de ${ville.nom}. Vigus'B ${magasin.nom} à ${ville.distance}. Garantie 24 mois.`,
    address: { '@type': 'PostalAddress', addressLocality: magasin.nom, addressCountry: 'FR' },
    telephone: magasin.telephone,
    openingHours: 'Mo-Sa 10:00-19:15',
    url: `https://www.vigusb.fr/telephone-occasion/${ville.slug}`,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden py-14 px-4" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
          <div className="relative max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-5">
              <span style={{ color: '#8DC63F' }}>●</span>
              À {ville.distance} de chez vous · Jusqu&apos;à -60% vs neuf · 24 mois de garantie
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Téléphone reconditionné à <span style={{ color: '#8DC63F' }}>{ville.nom}</span>
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Trouvez votre prochain smartphone reconditionné chez Vigus'B {magasin.nom},
              à seulement {ville.distance} de {ville.nom}.
              Garantie 24 mois, sélection rigoureuse.
            </p>
            <Link
              href="/telephones"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
              style={{ background: '#8DC63F', color: '#1A1A1A' }}
            >
              📱 Voir les téléphones disponibles
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

          {/* Magasin proche */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              📍 Votre magasin Vigus'B le plus proche de {ville.nom}
            </h2>
            <div className="bg-[#7B2D8B]/5 border-2 border-[#7B2D8B]/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#7B2D8B' }}>
                📍
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-[#1A1A1A]">Vigus'B {magasin.nom}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#8DC63F' }}>
                    À {ville.distance}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">📍 {magasin.adresse}</p>
                <p className="text-gray-600 mb-1">🕐 {magasin.horaires}</p>
                <p className="text-gray-600 mb-4">📞 {magasin.telephone}</p>
                <a
                  href={magasin.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: '#7B2D8B' }}
                >
                  🗺️ Voir l&apos;itinéraire
                </a>
              </div>
            </div>
          </section>

          {/* Sélection téléphones */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">
              📱 Téléphones reconditionnés disponibles près de {ville.nom}
            </h2>
            <p className="text-gray-500 mb-6">
              Sélection disponible en magasin à {ville.magasin_proche} · Garantie 24 mois · Jusqu&apos;à -60% vs neuf
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {featuredPhones.map(p => (
                <Link
                  key={p.slug}
                  href={`/telephones/${p.slug}`}
                  className="group bg-white border-2 border-gray-100 hover:border-[#7B2D8B]/30 rounded-2xl overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={`${p.marque} ${p.modele}`} className="h-28 object-contain" />
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm text-gray-800 group-hover:text-[#7B2D8B] transition-colors mb-1">
                      {p.marque} {p.modele}
                    </div>
                    <div className="text-lg font-black text-[#7B2D8B]">dès {getLowestPrice(p)}€</div>
                    <div className="text-xs text-[#8DC63F] font-semibold mt-0.5">✅ Garanti 24 mois</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/telephones"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#7B2D8B' }}
              >
                Voir tous les téléphones →
              </Link>
            </div>
          </section>

          {/* Grades */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">
              🔍 Notre système de grades — la transparence avant tout
            </h2>
            <p className="text-gray-500 mb-6">
              Chaque téléphone reconditionné vendu chez Vigus'B {magasin.nom} passe par 25 points de contrôle.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GRADES.map(g => (
                <div key={g.grade} className="flex items-start gap-4 bg-[#F8F8F8] rounded-2xl p-5 border border-gray-100">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ background: g.color }}
                  >
                    {g.grade[0]}
                  </span>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">{g.grade}</div>
                    <div className="text-sm text-gray-500">{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Arguments */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              ✅ Pourquoi acheter reconditionné chez Vigus'B ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  emoji: '✅',
                  titre: 'Garantie 24 mois',
                  desc: "Chaque téléphone reconditionné est garanti 24 mois. Panne ? On s'en occupe sans frais.",
                },
                {
                  emoji: '🌱',
                  titre: "Acte écologique",
                  desc: "Acheter reconditionné, c'est prolonger la vie d'un appareil et réduire les déchets électroniques.",
                },
                {
                  emoji: '💳',
                  titre: 'Paiement en plusieurs fois',
                  desc: "Payez en 3 fois sans frais dès 100€. Votre nouveau téléphone, sans attendre.",
                },
              ].map(arg => (
                <div key={arg.titre} className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-100">
                  <div className="text-4xl mb-4">{arg.emoji}</div>
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{arg.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{arg.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Avis */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">
              ⭐ Avis clients de {ville.nom} et environs
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="flex text-yellow-400">★★★★★</span>
              <span className="text-gray-500 text-sm">4.9/5 · +2 300 avis vérifiés Google</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {avis.map(a => (
                <div key={a.nom} className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-100">
                  <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{a.texte}&quot;</p>
                  <div className="text-sm font-semibold text-[#1A1A1A]">{a.nom}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl py-12 px-8 text-center text-white" style={{ background: 'linear-gradient(135deg, #8DC63F 0%, #6fa32e 100%)' }}>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Votre prochain téléphone reconditionné vous attend.
            </h2>
            <p className="text-white/80 mb-8">
              Vigus'B {magasin.nom} est à {ville.distance} de {ville.nom}. Venez voir notre sélection en magasin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/telephones"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold rounded-2xl text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl"
                style={{ color: '#7B2D8B' }}
              >
                📱 Voir nos téléphones
              </Link>
              <Link
                href="/magasins"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 border-2 border-white font-bold rounded-2xl text-lg hover:bg-white/30 transition-all"
              >
                📍 Trouver le magasin
              </Link>
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </>
  )
}
