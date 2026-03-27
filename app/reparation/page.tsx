import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const TARIFS = [
  {
    marque: 'Apple 🍎',
    modeles: [
      { modele: 'iPhone 15 Pro Max', ecran: 'Sur devis', batterie: '89€', charge: '59€' },
      { modele: 'iPhone 15 / 15 Pro', ecran: '249€', batterie: '79€', charge: '59€' },
      { modele: 'iPhone 14 Pro Max', ecran: '299€', batterie: '79€', charge: '59€' },
      { modele: 'iPhone 14 / 14 Pro', ecran: '229€', batterie: '79€', charge: '59€' },
      { modele: 'iPhone 13', ecran: '189€', batterie: '69€', charge: '59€' },
      { modele: 'iPhone 12', ecran: '159€', batterie: '69€', charge: '49€' },
      { modele: 'iPhone 11', ecran: '129€', batterie: '59€', charge: '49€' },
    ],
  },
  {
    marque: 'Samsung 📱',
    modeles: [
      { modele: 'Galaxy S24 Ultra', ecran: 'Sur devis', batterie: '79€', charge: '59€' },
      { modele: 'Galaxy S23 Ultra', ecran: '279€', batterie: '79€', charge: '59€' },
      { modele: 'Galaxy S23', ecran: '199€', batterie: '69€', charge: '59€' },
      { modele: 'Galaxy S22', ecran: '179€', batterie: '69€', charge: '59€' },
      { modele: 'Galaxy A54', ecran: '129€', batterie: '59€', charge: '49€' },
      { modele: 'Galaxy A34', ecran: '109€', batterie: '59€', charge: '49€' },
    ],
  },
  {
    marque: 'Xiaomi 📱',
    modeles: [
      { modele: 'Xiaomi 14', ecran: '199€', batterie: '69€', charge: '59€' },
      { modele: 'Redmi Note 13', ecran: '119€', batterie: '59€', charge: '49€' },
      { modele: 'Redmi Note 12', ecran: '109€', batterie: '49€', charge: '49€' },
    ],
  },
]

export default function ReparationPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />

      {/* Hero */}
      <div className="py-12 px-4 text-center" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
        <h1 className="text-4xl font-black text-white mb-4">Tarifs de réparation</h1>
        <p className="text-white/80 max-w-xl mx-auto mb-6">Prix indicatifs, devis gratuit en magasin. Garantie 24 mois sur toutes nos réparations.</p>
        <Link href="/simulation" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#7B2D8B] font-bold rounded-2xl hover:bg-gray-50 transition-all">
          🔧 Simuler ma réparation
        </Link>
      </div>

      {/* Certifications */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {['✅ Certifié QualiRepar', '✅ Garantie 24 mois', "✅ Pièces d'origine ou équivalent", '✅ Réparation en 30-90 min'].map(c => (
            <span key={c} className="text-sm font-medium text-gray-600">{c}</span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {TARIFS.map(section => (
          <div key={section.marque} className="mb-10">
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-4">{section.marque}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ background: '#F8F8F8' }}>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600">Modèle</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">📺 Écran</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">🔋 Batterie</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-600">🔌 Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.modeles.map((m, i) => (
                      <tr key={m.modele} className={`border-b border-gray-50 hover:bg-[#7B2D8B]/5 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                        <td className="px-6 py-4 font-medium text-[#1A1A1A]">{m.modele}</td>
                        <td className="px-6 py-4 text-center text-[#7B2D8B] font-semibold">{m.ecran}</td>
                        <td className="px-6 py-4 text-center text-[#7B2D8B] font-semibold">{m.batterie}</td>
                        <td className="px-6 py-4 text-center text-[#7B2D8B] font-semibold">{m.charge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-8 p-6 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm mb-4">Vous ne trouvez pas votre modèle ? Venez en magasin pour un devis gratuit.</p>
          <Link href="/simulation" className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-2xl hover:opacity-90 transition-all" style={{ background: '#7B2D8B' }}>
            🔧 Simuler ma réparation
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
