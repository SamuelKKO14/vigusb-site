import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { VILLES_SEO } from '@/lib/villes-seo'
import { MAGASINS } from '@/lib/data'

type Props = { params: Promise<{ ville: string }> }

export async function generateStaticParams() {
  return VILLES_SEO.map((v) => ({ ville: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville: villeSlug } = await params
  const ville = VILLES_SEO.find(v => v.slug === villeSlug)
  if (!ville) return { title: 'Page introuvable' }

  const title = `Réparation Téléphone ${ville.nom} — Vigus'B | Toutes marques`
  const description = `Réparation smartphone à ${ville.nom} : iPhone, Samsung, Xiaomi, Google Pixel... Magasin Vigus'B à ${ville.distance}. Devis gratuit, garantie 24 mois, certifié QualiRepar.`
  const url = `https://www.vigusb.fr/reparation-telephone/${ville.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

const MARQUES_REPARATION = [
  { nom: 'Apple iPhone', emoji: '🍎', pannes: ['Écran', 'Batterie', 'Connecteur', 'Caméra', 'Face ID'] },
  { nom: 'Samsung Galaxy', emoji: '📱', pannes: ['Écran', 'Batterie', 'Connecteur', 'Vitre arrière', 'Caméra'] },
  { nom: 'Xiaomi / Redmi', emoji: '📱', pannes: ['Écran', 'Batterie', 'Connecteur', 'Bouton power', 'Caméra'] },
  { nom: 'Google Pixel', emoji: '📱', pannes: ['Écran', 'Batterie', 'Connecteur', 'Caméra', 'Haut-parleur'] },
  { nom: 'Huawei', emoji: '📱', pannes: ['Écran', 'Batterie', 'Connecteur', 'Vitre arrière'] },
  { nom: 'OnePlus', emoji: '📱', pannes: ['Écran', 'Batterie', 'Connecteur', 'Caméra'] },
]

const PANNES_COURANTES = [
  { emoji: '📺', panne: 'Écran cassé / fissuré', delai: '30-60 min', garantie: '24 mois' },
  { emoji: '🔋', panne: 'Batterie qui ne tient plus', delai: '20-40 min', garantie: '24 mois' },
  { emoji: '🔌', panne: 'Connecteur de charge HS', delai: '30-45 min', garantie: '24 mois' },
  { emoji: '📷', panne: 'Caméra floue / cassée', delai: '45-60 min', garantie: '24 mois' },
  { emoji: '🪟', panne: 'Vitre arrière brisée', delai: '60-90 min', garantie: '24 mois' },
  { emoji: '💧', panne: 'Dégât des eaux', delai: 'Diagnostic gratuit', garantie: 'Variable' },
]

const AVIS_PAR_MAGASIN: Record<number, { nom: string; texte: string }[]> = {
  1: [
    { nom: 'Antoine B. — Bouguenais', texte: "Batterie Samsung changée en 30 min. Très professionnel, prix honnête. Magasin propre et accueillant." },
    { nom: 'Lucie V. — Vertou', texte: "Mon Xiaomi avait l'écran fissuré. Réparé en une heure, comme neuf ! Personnel très compétent." },
    { nom: 'Maxime D. — Carquefou', texte: "Connecteur de charge de mon Google Pixel réparé. Devis gratuit, prix transparent. Je recommande !" },
  ],
  2: [
    { nom: 'Julie F. — Betton', texte: "Samsung Galaxy S23 Ultra réparé parfaitement. Qualité de pièce top, garantie 24 mois. Merci !" },
    { nom: 'Paul M. — Chantepie', texte: "Dégât des eaux sur mon Xiaomi. Diagnostic gratuit, téléphone sauvé. Bluffant !" },
    { nom: 'Marion L. — Vézin-le-Coquet', texte: "Vitre arrière de mon Samsung remplacée en 1h. Rendu parfait, prix compétitif." },
  ],
  8: [
    { nom: 'Alexis G. — Bègles', texte: "Réparation Samsung Galaxy A55 rapide et soignée. Garantie 24 mois, c'est rassurant." },
    { nom: 'Nadia B. — Villenave-d\'Ornon', texte: "Mon Huawei P40 Pro avait l'écran mort. Réparé en 45 min. Parfait !" },
    { nom: 'Yoann P. — Talence', texte: "Excellent accueil, réparation rapide de mon OnePlus. Je reviens à coup sûr." },
  ],
  4: [
    { nom: 'Laura M. — Labège', texte: "Batterie Xiaomi Redmi Note changée rapidement. Téléphone comme neuf pour 49€." },
    { nom: 'Kevin S. — Tournefeuille', texte: "Google Pixel 8 Pro réparé très efficacement. Personnel attentionné, résultat parfait." },
    { nom: 'Emma T. — Muret', texte: "Caméra de mon Samsung HS. Réparée en moins d'une heure, prix correct avec garantie." },
  ],
  3: [
    { nom: 'Bastien C. — Saint-Barthélemy', texte: "Réparation vitre arrière de mon iPhone rapide et propre. Prix compétitif vs Apple Store." },
    { nom: 'Inès M. — Les Ponts-de-Cé', texte: "Connecteur HS sur mon Xiaomi. Réglé en 30 min. Service client excellent !" },
    { nom: 'Thibault R. — Trélazé', texte: "Dégât des eaux sur mon Samsung. Diagnostic gratuit, réparation réussie. Bravo !" },
  ],
}

const DEFAULT_AVIS = [
  { nom: 'Pierre L.', texte: "Réparation rapide et efficace. Personnel compétent, prix transparent. Garantie 24 mois appréciable." },
  { nom: 'Sarah K.', texte: "Mon Samsung S24 avait l'écran fissuré. Réparé en 45 min. Résultat impeccable !" },
  { nom: 'Julien M.', texte: "Connecteur de charge réparé le jour même. Devis gratuit, pas de mauvaise surprise." },
]

export default async function ReparationTelephoneVille({ params }: Props) {
  const { ville: villeSlug } = await params
  const ville = VILLES_SEO.find(v => v.slug === villeSlug)
  if (!ville) notFound()

  const magasin = MAGASINS.find(m => m.id === ville.magasin_id)!
  const avis = AVIS_PAR_MAGASIN[ville.magasin_id] ?? DEFAULT_AVIS

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Vigus'B — Réparation Téléphone ${ville.nom}`,
    description: `Réparation smartphone toutes marques à ${ville.nom}. Magasin Vigus'B ${magasin.nom} à ${ville.distance}.`,
    address: { '@type': 'PostalAddress', addressLocality: magasin.nom, addressCountry: 'FR' },
    telephone: magasin.telephone,
    openingHours: 'Mo-Sa 10:00-19:15',
    url: `https://www.vigusb.fr/reparation-telephone/${ville.slug}`,
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
              À {ville.distance} de chez vous · Toutes marques · QualiRepar
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Réparation téléphone à <span style={{ color: '#8DC63F' }}>{ville.nom}</span>
            </h1>
            <p className="text-white/70 text-lg mb-8">
              iPhone, Samsung, Xiaomi, Google Pixel et bien d&apos;autres.
              Votre magasin Vigus'B {magasin.nom} est à {ville.distance} seulement.
            </p>
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
              style={{ background: '#8DC63F', color: '#1A1A1A' }}
            >
              🔧 Réparer mon téléphone
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

          {/* Pannes courantes */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">
              🔧 Pannes réparées à {ville.nom}
            </h2>
            <p className="text-gray-500 mb-6">Réparation rapide, pièces certifiées, garantie 24 mois</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PANNES_COURANTES.map(p => (
                <div key={p.panne} className="bg-[#F8F8F8] border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{p.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">{p.panne}</div>
                    <div className="text-xs text-gray-500">⏱ {p.delai}</div>
                    <div className="text-xs text-[#8DC63F] font-semibold">✅ Garantie {p.garantie}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Marques */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              📱 Marques réparées près de {ville.nom}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MARQUES_REPARATION.map(m => (
                <div key={m.nom} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-[#7B2D8B]/30 transition-all">
                  <div className="text-2xl mb-2">{m.emoji}</div>
                  <div className="font-bold text-gray-800 mb-2">{m.nom}</div>
                  <div className="flex flex-wrap gap-1">
                    {m.pannes.map(p => (
                      <span key={p} className="text-xs bg-[#7B2D8B]/10 text-[#7B2D8B] px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Arguments */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              ✅ Pourquoi choisir Vigus'B ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  emoji: '🏆',
                  titre: 'Certifié QualiRepar',
                  desc: "Profitez d'un bonus réparation de 25€ sur votre écran grâce à notre certification QualiRepar.",
                },
                {
                  emoji: '✅',
                  titre: 'Garantie 24 mois',
                  desc: "Toutes nos réparations sont garanties 24 mois pièces et main d'œuvre. Sans condition.",
                },
                {
                  emoji: '💳',
                  titre: 'Paiement en plusieurs fois',
                  desc: "Payez votre réparation en 3 fois sans frais dès 100€. Profitez maintenant, payez sereinement.",
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
              Votre téléphone en panne ? Devis gratuit en 2 minutes.
            </h2>
            <p className="text-white/80 mb-8">
              Depuis {ville.nom}, rejoignez Vigus'B {magasin.nom} en seulement {ville.distance}.
            </p>
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white font-bold rounded-2xl text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl"
              style={{ color: '#7B2D8B' }}
            >
              🔧 Simuler ma réparation gratuitement
            </Link>
          </section>

        </div>
        <Footer />
      </div>
    </>
  )
}
