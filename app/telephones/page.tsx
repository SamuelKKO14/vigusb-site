'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { PRODUITS_DEMO } from '@/lib/data'

const MARQUES_FILTRE = ['Toutes', 'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Google', 'OnePlus']
const ETATS = ['Tous', 'reconditionne', 'occasion']

export default function TelephonesPage() {
  const [marque, setMarque] = useState('Toutes')
  const [etat, setEtat] = useState('Tous')
  const [prixMax, setPrixMax] = useState(1000)

  const produitsFiltres = PRODUITS_DEMO.filter(p =>
    (marque === 'Toutes' || p.marque === marque) &&
    (etat === 'Tous' || p.etat === etat) &&
    p.prix <= prixMax &&
    p.disponible
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
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-8 flex flex-wrap gap-4">
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
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">État</label>
            <div className="flex gap-2">
              {ETATS.map(e => (
                <button key={e} onClick={() => setEtat(e)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${etat === e ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={etat === e ? { background: '#7B2D8B' } : {}}>
                  {e === 'reconditionne' ? 'Reconditionné' : e === 'occasion' ? 'Occasion' : 'Tous'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Prix max : {prixMax}€</label>
            <input type="range" min={100} max={1000} step={50} value={prixMax} onChange={e => setPrixMax(+e.target.value)}
              className="w-40 accent-[#7B2D8B]" />
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">{produitsFiltres.length} téléphone{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {produitsFiltres.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-40 flex items-center justify-center text-6xl bg-gradient-to-br from-[#7B2D8B]/5 to-[#8DC63F]/5">
                📱
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.etat === 'reconditionne' ? 'bg-[#8DC63F]/10 text-[#6fa32e]' : 'bg-blue-50 text-blue-600'}`}>
                    {p.etat === 'reconditionne' ? 'Reconditionné' : 'Occasion'}
                  </span>
                  <span className="text-xs text-gray-400">✅ 24 mois</span>
                </div>
                <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#7B2D8B] transition-colors">{p.marque} {p.modele}</h3>
                <p className="text-xs text-gray-400 mb-3">{p.stockage} · {p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#7B2D8B]">{p.prix}€</span>
                  <Link href="/magasins" className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all" style={{ background: '#7B2D8B' }}>
                    Disponible →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {produitsFiltres.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-4">Aucun téléphone ne correspond à vos critères.</p>
            <button onClick={() => { setMarque('Toutes'); setEtat('Tous'); setPrixMax(1000) }} className="text-[#7B2D8B] font-semibold hover:underline">Réinitialiser les filtres</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
