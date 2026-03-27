import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MAGASINS } from '@/lib/data'

const TEMOIGNAGES = [
  { nom: 'Marie L.', ville: 'Nantes', note: 5, texte: 'Écran changé en 45 minutes chrono ! Personnel super sympa et prix imbattable. Je recommande à 100%.' },
  { nom: 'Thomas R.', ville: 'Rennes', note: 5, texte: "Mon iPhone tombé dans l'eau, ils l'ont sauvé ! Incroyable. Garantie 24 mois en plus, parfait." },
  { nom: 'Sophie M.', ville: 'Angers', note: 5, texte: 'Acheté un iPhone 13 reconditionné, comme neuf ! Le rapport qualité/prix est exceptionnel.' },
  { nom: 'Antoine B.', ville: 'Bordeaux', note: 5, texte: 'Batterie Samsung changée en 30 min pendant ma pause déjeuner. Très professionnel !' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 50%, #3d1347 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#8DC63F] blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="text-[#8DC63F]">●</span> 14 magasins · Garantie 24 mois · Certifié QualiRepar
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Votre téléphone<br />
            <span style={{ color: '#8DC63F' }}>mérite le meilleur</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Réparation express, téléphones reconditionnés de qualité, accessoires premium. Près de chez vous, dans 14 villes de France.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulation" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#7B2D8B] font-bold rounded-2xl text-lg hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
              🔧 Simuler une réparation
            </Link>
            <Link href="/telephones" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-2xl text-lg hover:bg-white/10 transition-all border-2 border-white/40 backdrop-blur-sm">
              📱 Voir nos téléphones
            </Link>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 px-4 bg-[#F8F8F8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { chiffre: '14', label: 'Magasins en France', emoji: '📍' },
              { chiffre: '+5000', label: 'Références disponibles', emoji: '📱' },
              { chiffre: '24 mois', label: 'De garantie', emoji: '✅' },
              { chiffre: 'QualiRepar', label: 'Certifié', emoji: '🏆' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-2xl md:text-3xl font-black text-[#7B2D8B]">{item.chiffre}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">Nos services</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Tout ce dont vous avez besoin pour votre smartphone, au même endroit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🔧', titre: 'Réparation rapide', desc: "Écran, batterie, charge, caméra… Réparation en moins d'une heure dans la plupart des cas." },
              { emoji: '📱', titre: 'Téléphones reconditionnés', desc: "Sélection rigoureuse, garantie 24 mois, jusqu'à -60% par rapport au neuf." },
              { emoji: '🛍️', titre: 'Accessoires', desc: 'Coques, films de protection, câbles, chargeurs… tout pour protéger votre téléphone.' },
              { emoji: '✅', titre: 'Garantie 24 mois', desc: 'Toutes nos réparations et tous nos téléphones reconditionnés sont garantis 24 mois.' },
              { emoji: '💳', titre: 'Paiement en plusieurs fois', desc: 'Étalez vos paiements sans frais. Profitez maintenant, payez tranquillement.' },
              { emoji: '🛡️', titre: 'Pose film protection', desc: 'Application professionnelle de film de protection pour préserver votre écran.' },
            ].map((s) => (
              <div key={s.titre} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow hover:border-[#7B2D8B]/20 group">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 group-hover:text-[#7B2D8B] transition-colors">{s.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos magasins */}
      <section className="py-16 px-4 bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">📍 Nos 14 magasins</h2>
            <p className="text-gray-500">Retrouvez-nous dans toute la France de l&apos;Ouest</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {MAGASINS.map((m) => (
              <Link key={m.id} href="/magasins" className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-[#7B2D8B] hover:shadow-sm transition-all group">
                <div className="text-xs font-semibold text-gray-700 group-hover:text-[#7B2D8B] transition-colors">{m.nom}</div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/magasins" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ background: '#7B2D8B' }}>
              Voir tous nos magasins →
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4">Ce que disent nos clients</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-yellow-400 text-xl">★★★★★</div>
              <span className="text-gray-500 text-sm">4.9/5 · +2 300 avis</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-100">
                <div className="flex text-yellow-400 text-sm mb-3">{'★'.repeat(t.note)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.texte}&quot;</p>
                <div>
                  <div className="font-semibold text-sm text-[#1A1A1A]">{t.nom}</div>
                  <div className="text-xs text-gray-400">Magasin de {t.ville}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #8DC63F 0%, #6fa32e 100%)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Prêt à réparer votre téléphone ?</h2>
          <p className="text-white/80 mb-8 text-lg">Simulation gratuite en 2 minutes. Devis immédiat.</p>
          <Link href="/simulation" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#7B2D8B] font-bold rounded-2xl text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl">
            🔧 Simuler ma réparation maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
