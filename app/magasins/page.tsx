import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { MAGASINS } from '@/lib/data'

export default function MagasinsPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1A1A1A] mb-4">📍 Nos 14 magasins</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Retrouvez le magasin Vigus&apos;B le plus proche de chez vous. Ouverts du lundi au samedi.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {MAGASINS.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow hover:border-[#7B2D8B]/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-black text-lg text-[#1A1A1A]">{m.nom}</h2>
                  <p className="text-sm text-gray-500 mt-1">📍 {m.adresse}</p>
                </div>
                <span className="text-2xl">🏪</span>
              </div>
              <div className="space-y-2 text-sm text-gray-500 mb-5">
                <div className="flex items-center gap-2">🕐 {m.horaires}</div>
                <div className="flex items-center gap-2">📞 {m.telephone}</div>
              </div>
              <div className="flex gap-2">
                <a href={m.maps} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 text-center text-sm font-semibold rounded-xl border-2 border-[#7B2D8B] text-[#7B2D8B] hover:bg-[#7B2D8B] hover:text-white transition-all">
                  Itinéraire
                </a>
                <Link href="/simulation"
                  className="flex-1 py-2 text-center text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90"
                  style={{ background: '#7B2D8B' }}>
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
