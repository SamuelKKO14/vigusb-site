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

  const title = `Réparation iPhone ${ville.nom} — Vigus'B | Devis gratuit`
  const description = `Vous habitez ${ville.nom} ? Le magasin Vigus'B le plus proche est à ${ville.distance} seulement. Réparation iPhone garantie 24 mois, certifié QualiRepar. Devis gratuit.`
  const url = `https://www.vigusb.fr/reparation-iphone/${ville.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

const PRIX_IPHONE: { modele: string; ecran: number; batterie: number; connecteur: number; camera: number }[] = [
  { modele: 'iPhone 15 Pro Max', ecran: 289, batterie: 89, connecteur: 79, camera: 119 },
  { modele: 'iPhone 15 / 15 Pro', ecran: 259, batterie: 89, connecteur: 79, camera: 109 },
  { modele: 'iPhone 14 / 14 Pro', ecran: 229, batterie: 79, connecteur: 69, camera: 99 },
  { modele: 'iPhone 13 / 13 Pro', ecran: 169, batterie: 59, connecteur: 49, camera: 79 },
  { modele: 'iPhone 12 / 12 Pro', ecran: 129, batterie: 49, connecteur: 39, camera: 69 },
  { modele: 'iPhone 11 / XR / X', ecran: 99, batterie: 39, connecteur: 29, camera: 59 },
]

const AVIS_PAR_MAGASIN: Record<number, { nom: string; texte: string }[]> = {
  1: [
    { nom: 'Lucas D. — Rezé', texte: "Venu depuis Rezé pour réparer mon iPhone 14. Réparation en 45 min, résultat parfait. Très pro !" },
    { nom: 'Emma B. — Saint-Herblain', texte: "Batterie de mon iPhone 13 changée pour 59€. Téléphone comme neuf. Je reviendrai sans hésiter." },
    { nom: 'Nicolas F. — Orvault', texte: "Écran fissuré réparé en moins d'une heure. Le technicien était super sympa et le prix imbattable." },
  ],
  2: [
    { nom: 'Sophie M. — Cesson-Sévigné', texte: "Venu de Cesson pour réparer mon iPhone 15. Service impeccable, garantie 24 mois incluse." },
    { nom: 'Antoine L. — Bruz', texte: "Trajet depuis Bruz qui vaut vraiment le déplacement. Réparation rapide et professionnelle." },
    { nom: 'Clara R. — Pacé', texte: "Mon iPhone XR avait un connecteur HS. Réglé en 30 min pour un tarif honnête. Top !" },
  ],
  8: [
    { nom: 'Marc T. — Mérignac', texte: "Depuis Mérignac, c'est rapide d'accès. Écran iPhone réparé, qualité irréprochable." },
    { nom: 'Julie K. — Pessac', texte: "Personnel accueillant, délai tenu à la minute. Batterie changée, iPhone comme neuf !" },
    { nom: 'Romain V. — Talence', texte: "Très bonne expérience. Devis gratuit sur place, réparation le jour même. Recommandé !" },
  ],
  4: [
    { nom: 'Pierre N. — Blagnac', texte: "Venu de Blagnac pour la réparation écran de mon iPhone 14 Pro. Travail soigné, garantie 24 mois." },
    { nom: 'Anaïs D. — Colomiers', texte: "Super équipe ! Mon iPhone était tombé dans l'eau, ils l'ont sauvé. Incroyable." },
    { nom: 'Thomas B. — Tournefeuille', texte: "Prix transparents, technicien compétent. Batterie iPhone 13 changée rapidement." },
  ],
  3: [
    { nom: 'Léa M. — Avrillé', texte: "Réparation écran iPhone rapide depuis Avrillé. Qualité de pièces excellente, je recommande." },
    { nom: 'Hugo C. — Trélazé', texte: "Très satisfait. Mon iPhone 12 avait l'écran fissuré, réparé en 40 min pour 129€." },
    { nom: 'Camille P. — Les Ponts-de-Cé', texte: "Service professionnel, équipe sympathique. Connecteur de charge réparé le jour même." },
  ],
}

const DEFAULT_AVIS = [
  { nom: 'Marie L.', texte: "Réparation iPhone en 45 min. Personnel super sympa et prix imbattable. Je recommande à 100%." },
  { nom: 'Thomas R.', texte: "Mon iPhone tombé dans l'eau, ils l'ont sauvé ! Garantie 24 mois en plus. Parfait." },
  { nom: 'Sophie M.', texte: "Batterie changée rapidement, iPhone comme neuf. Le rapport qualité/prix est exceptionnel." },
]

export default async function ReparationIphoneVille({ params }: Props) {
  const { ville: villeSlug } = await params
  const ville = VILLES_SEO.find(v => v.slug === villeSlug)
  if (!ville) notFound()

  const magasin = MAGASINS.find(m => m.id === ville.magasin_id)!
  const avis = AVIS_PAR_MAGASIN[ville.magasin_id] ?? DEFAULT_AVIS

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Vigus'B — Réparation iPhone ${ville.nom}`,
    description: `Réparation iPhone à ${ville.nom} — magasin Vigus'B ${magasin.nom} à ${ville.distance}`,
    address: { '@type': 'PostalAddress', addressLocality: magasin.nom, addressCountry: 'FR' },
    telephone: magasin.telephone,
    openingHours: 'Mo-Sa 10:00-19:15',
    url: `https://www.vigusb.fr/reparation-iphone/${ville.slug}`,
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
              À {ville.distance} de chez vous · Certifié QualiRepar
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              Réparation iPhone à <span style={{ color: '#8DC63F' }}>{ville.nom}</span>
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Votre magasin Vigus'B le plus proche est à {ville.distance} — {magasin.nom}.
              Devis gratuit, réparation en moins d&apos;une heure.
            </p>
            <Link
              href="/simulation?marque=Apple"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
              style={{ background: '#8DC63F', color: '#1A1A1A' }}
            >
              🔧 Réparer mon iPhone
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
                  🗺️ Voir l'itinéraire
                </a>
              </div>
            </div>
          </section>

          {/* Tableau de prix */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">
              💰 Nos réparations iPhone — tarifs {ville.nom}
            </h2>
            <p className="text-gray-500 mb-6">Pièces certifiées · Garantie 24 mois · Devis gratuit sur place</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#7B2D8B' }} className="text-white">
                    <th className="text-left px-5 py-4 font-bold">Modèle iPhone</th>
                    <th className="text-center px-4 py-4 font-bold">📺 Écran</th>
                    <th className="text-center px-4 py-4 font-bold">🔋 Batterie</th>
                    <th className="text-center px-4 py-4 font-bold">🔌 Connecteur</th>
                    <th className="text-center px-4 py-4 font-bold">📷 Caméra</th>
                  </tr>
                </thead>
                <tbody>
                  {PRIX_IPHONE.map((row, i) => (
                    <tr key={row.modele} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}>
                      <td className="px-5 py-3.5 font-semibold text-gray-800">{row.modele}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#7B2D8B]">{row.ecran}€</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#7B2D8B]">{row.batterie}€</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#7B2D8B]">{row.connecteur}€</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#7B2D8B]">{row.camera}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">* Tarifs indicatifs, devis gratuit et définitif en magasin. Prix garantis 24 mois.</p>
          </section>

          {/* Arguments */}
          <section>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              ✅ Pourquoi choisir Vigus'B pour votre iPhone ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  emoji: '🏆',
                  titre: 'Certifié QualiRepar',
                  desc: "Vigus'B est un réparateur agréé QualiRepar. Vous bénéficiez d'un bonus réparation de 25€ sur votre écran iPhone.",
                },
                {
                  emoji: '✅',
                  titre: 'Garantie 24 mois',
                  desc: "Toutes nos réparations iPhone sont garanties 24 mois pièces et main d'œuvre. Sans condition.",
                },
                {
                  emoji: '💳',
                  titre: 'Paiement en 3×',
                  desc: "Écran cassé ? Étalez votre réparation en 3 fois sans frais dès 100€. Profitez maintenant, payez tranquillement.",
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
              Votre iPhone cassé ? On le répare en moins d&apos;une heure.
            </h2>
            <p className="text-white/80 mb-8">
              Depuis {ville.nom}, rejoignez Vigus'B {magasin.nom} en {ville.distance}.
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
