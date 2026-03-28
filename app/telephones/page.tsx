'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { PHONES_DATABASE, getLowestPrice } from '@/lib/phones-data'

const MARQUES_FILTRE = ['Toutes', 'Apple', 'Samsung', 'Xiaomi', 'Google']

export default function TelephonesPage() {
  const [marque, setMarque] = useState('Toutes')
  const [prixMax, setPrixMax] = useState(1000)

  const produitsFiltres = PHONES_DATABASE.filter(p =>
    (marque === 'Toutes' || p.marque === marque) &&
    getLowestPrice(p) <= prixMax
  )

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1A1A1A] mb-2">Nos téléphones reconditionnés</h1>
          <p className="text-gray-500">Garantie 24 mois · Sélection rigoureuse · Jusqu&apos;à -60% vs neuf</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-8 flex flex-wrap gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Marque</label>
            <div className="flex flex-wrap gap-2">
              {MARQUES_FILTRE.map(m => (
                <button key={m} onClick={() => setMarque(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${marque === m ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={marque === m ? { background: '#7B2D8B' } : {}}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Prix max : {prixMax}€</label>
            <input type="range" min={99} max={1000} step={50} value={prixMax} onChange={e => setPrixMax(+e.target.value)}
              className="w-40 accent-[#7B2D8B]" />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">{produitsFiltres.length} téléphone{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {produitsFiltres.map(p => {
            const lowest = getLowestPrice(p)
            const highest = Math.max(...Object.values(p.prix_reconditionne))
            const savings = Math.round(highest * 0.6)
            return (
              <Link
                key={p.slug}
                href={`/telephones/${p.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#7B2D8B]/30 transition-all group"
              >
                <div className="h-44 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={`${p.marque} ${p.modele}`} className="h-36 object-contain" />
                  <span className="absolute top-3 right-3 bg-[#8DC63F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    ✅ 24 mois
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#7B2D8B]/10 text-[#7B2D8B]">
                      Reconditionné
                    </span>
                    <span className="text-xs text-gray-400">{p.annee}</span>
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#7B2D8B] transition-colors mb-1">
                    {p.marque} {p.modele}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{p.specs.stockage.join(' · ')}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#7B2D8B]">dès {lowest}€</span>
                      <div className="text-xs text-gray-400">vs {lowest + savings}€ neuf</div>
                    </div>
                    <span className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all" style={{ background: '#7B2D8B' }}>
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {produitsFiltres.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-4">Aucun téléphone ne correspond à vos critères.</p>
            <button onClick={() => { setMarque('Toutes'); setPrixMax(1000) }} className="text-[#7B2D8B] font-semibold hover:underline">Réinitialiser les filtres</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
