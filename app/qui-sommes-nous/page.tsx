import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function QuiSommesNousPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
        <h1 className="text-4xl font-black text-white mb-4">Qui sommes-nous ?</h1>
        <p className="text-white/80 max-w-xl mx-auto">Le réseau de référence de la téléphonie d&apos;occasion et de la réparation en France de l&apos;Ouest.</p>
      </div>

      {/* Histoire */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-[#1A1A1A] mb-6">Notre histoire</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Vigus&apos;B est né d&apos;une conviction simple : votre smartphone mérite une seconde vie. Fondé par des passionnés de technologie et de commerce de proximité, notre réseau a grandi pour devenir le leader de la téléphonie reconditionnée dans l&apos;Ouest de la France.</p>
              <p>Avec <strong className="text-[#7B2D8B]">14 magasins</strong> implantés dans les principales villes — Nantes, Rennes, Angers, Bordeaux, Toulouse et bien d&apos;autres — nous sommes présents là où vous en avez besoin.</p>
              <p>Notre mission : rendre la tech accessible, durable et locale. Chaque téléphone reconditionné, c&apos;est un appareil qui ne finit pas à la décharge. Chaque réparation, c&apos;est moins d&apos;e-déchets.</p>
            </div>
          </div>
          <div className="bg-[#F8F8F8] rounded-3xl p-10 text-center">
            <div className="text-7xl mb-4">📱</div>
            <div className="text-5xl font-black text-[#7B2D8B]">14</div>
            <div className="text-gray-500 font-medium">magasins en France</div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 px-4 bg-[#F8F8F8]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-[#1A1A1A] mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '♻️', titre: 'Éco-responsabilité', desc: "Donner une seconde vie aux appareils électroniques pour réduire les déchets numériques. Chaque reconditionné, c'est une victoire pour la planète." },
              { emoji: '🤝', titre: 'Proximité', desc: "14 magasins de proximité pour vous accueillir, vous conseiller et vous dépanner rapidement. Des vrais humains, pas un formulaire web." },
              { emoji: '💎', titre: 'Qualité', desc: "Certifiés QualiRepar, garantie 24 mois, pièces sélectionnées avec soin. Nous ne faisons pas de compromis sur la qualité." },
            ].map(v => (
              <div key={v.titre} className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <div className="text-5xl mb-4">{v.emoji}</div>
                <h3 className="font-black text-xl text-[#1A1A1A] mb-3">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-12">Vigus&apos;B en chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: '14', label: 'Magasins' },
              { n: '+50 000', label: 'Clients satisfaits' },
              { n: '+5 000', label: 'Réparations/an' },
              { n: '24 mois', label: 'Garantie' },
            ].map(c => (
              <div key={c.label} className="bg-[#F8F8F8] rounded-2xl p-6">
                <div className="text-3xl font-black text-[#7B2D8B]">{c.n}</div>
                <div className="text-sm text-gray-500 mt-1">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center" style={{ background: 'linear-gradient(135deg, #8DC63F 0%, #6fa32e 100%)' }}>
        <h2 className="text-2xl font-black text-white mb-4">Venez nous rencontrer !</h2>
        <Link href="/magasins" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#7B2D8B] font-bold rounded-2xl hover:bg-gray-50 transition-all">
          📍 Voir nos magasins
        </Link>
      </section>

      <Footer />
    </div>
  )
}
