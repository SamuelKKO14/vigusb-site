import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: "Réparation téléphone à distance — Vigus'B | Envoi postal sécurisé",
  description: "Faites réparer votre téléphone à distance avec Vigus'B. Envoyez votre appareil par colis sécurisé, réparation sous 48h, retour en 72h. iPhone, Samsung, Xiaomi — garantie 24 mois, certifié QualiRepar.",
  alternates: { canonical: 'https://www.vigusb.fr/reparation-distance' },
}

const ETAPES = [
  {
    num: 1,
    icon: '📋',
    titre: 'Simulez votre réparation',
    texte: "Lancez la simulation en ligne, sélectionnez votre modèle et les pannes. Obtenez un devis instantané avec le Bonus QualiRepar appliqué automatiquement.",
  },
  {
    num: 2,
    icon: '📦',
    titre: 'Envoyez votre appareil',
    texte: "Emballez soigneusement votre téléphone et envoyez-le à notre centre de réparation. Nous vous fournissons l'adresse et les instructions d'emballage.",
  },
  {
    num: 3,
    icon: '🔧',
    titre: 'Réparation sous 48h',
    texte: "Nos techniciens certifiés QualiRepar diagnostiquent et réparent votre appareil en 48h ouvrées. Suivi en temps réel avec votre numéro de ticket.",
  },
  {
    num: 4,
    icon: '🚀',
    titre: 'Retour en 72h',
    texte: "Votre téléphone réparé et testé est renvoyé avec suivi de colis. Délai total : 5 à 7 jours ouvrés. Garantie 24 mois sur toutes les réparations.",
  },
]

const INFOS = [
  { icon: '🛡️', titre: 'Garantie 24 mois', texte: 'Toutes les réparations sont couvertes 24 mois pièces et main-d\'œuvre.' },
  { icon: '🎁', titre: 'Bonus QualiRepar', texte: 'Jusqu\'à 25€ d\'aide de l\'État automatiquement déduits de votre facture.' },
  { icon: '📍', titre: 'Suivi en temps réel', texte: 'Accédez à votre espace client pour suivre l\'avancement de votre réparation.' },
  { icon: '⚡', titre: 'Experts certifiés', texte: 'Techniciens formés et habilités sur iPhone, Samsung, Xiaomi et plus.' },
]

const MARQUES = [
  { nom: 'Apple iPhone', emoji: '🍎' },
  { nom: 'Samsung Galaxy', emoji: '📱' },
  { nom: 'Xiaomi / Redmi', emoji: '📲' },
  { nom: 'Google Pixel', emoji: '🔵' },
  { nom: 'Huawei', emoji: '📡' },
  { nom: 'OnePlus', emoji: '🔴' },
]

export default function ReparationDistancePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-bold bg-white/15 border border-white/25">
            📦 SERVICE POSTAL SÉCURISÉ
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Réparation à distance
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Pas de magasin près de chez vous ? Envoyez votre téléphone, nous le réparons et vous le renvoyons en parfait état.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/simulation?mode=distance"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#8DC63F', color: 'white' }}
            >
              🔧 Simuler ma réparation
            </Link>
            <div className="text-sm text-white/60">Devis gratuit en 3 minutes</div>
          </div>
        </div>
      </section>

      {/* 4 Info cards */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INFOS.map(info => (
              <div key={info.titre} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-3">{info.icon}</div>
                <h3 className="font-black text-base mb-2" style={{ color: '#7B2D8B' }}>{info.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{info.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2" style={{ color: '#7B2D8B' }}>Comment ça marche ?</h2>
            <p className="text-gray-500">Un processus simple et sécurisé en 4 étapes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ETAPES.map((etape, i) => (
              <div key={etape.num} className="relative bg-white rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 font-black text-white"
                    style={{ background: i % 2 === 0 ? '#7B2D8B' : '#8DC63F' }}
                  >
                    {etape.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{etape.icon}</span>
                      <h3 className="font-black text-base" style={{ color: '#1A1A1A' }}>{etape.titre}</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{etape.texte}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marques compatibles */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: '#7B2D8B' }}>Marques compatibles</h2>
          <p className="text-gray-500 mb-8 text-sm">Toutes les grandes marques acceptées</p>
          <div className="flex flex-wrap justify-center gap-3">
            {MARQUES.map(m => (
              <div
                key={m.nom}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-200 font-semibold text-sm text-gray-700"
              >
                <span>{m.emoji}</span>
                <span>{m.nom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Prêt à faire réparer votre téléphone ?</h2>
          <p className="text-white/75 mb-8 text-lg">
            Simulez votre réparation en 3 minutes et bénéficiez du Bonus QualiRepar jusqu&apos;à 25€.
          </p>
          <Link
            href="/simulation?mode=distance"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#8DC63F', color: 'white' }}
          >
            🔧 Commencer la simulation
          </Link>
          <p className="mt-4 text-white/50 text-sm">Gratuit, sans engagement, devis instantané</p>
        </div>
      </section>
    </div>
  )
}
