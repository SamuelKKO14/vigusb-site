'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Phone } from '@/lib/phones-data'

const ETAT_LABELS: Record<string, { label: string; badge: string; color: string }> = {
  'Comme neuf': { label: 'Comme neuf', badge: 'A+', color: '#8DC63F' },
  'Très bon état': { label: 'Très bon état', badge: 'A', color: '#6fa32e' },
  'Bon état': { label: 'Bon état', badge: 'B', color: '#7B2D8B' },
  'État correct': { label: 'État correct', badge: 'C', color: '#9B6BB5' },
}

const ETAT_DESC: Record<string, string> = {
  'Comme neuf': "Aucune rayure visible. Batterie > 90%. Comme sorti de la boîte.",
  'Très bon état': "Très légères traces d'utilisation. Batterie > 85%. Parfait au quotidien.",
  'Bon état': "Légères rayures possibles, non visibles allumé. Batterie > 80%.",
  'État correct': "Traces d'usure visibles. Fonctionnel à 100%. Batterie > 75%.",
}

export default function ProductHero({ phone }: { phone: Phone }) {
  const router = useRouter()
  const etats = Object.keys(phone.prix_reconditionne)
  const stockages = phone.specs.stockage

  const [selectedEtat, setSelectedEtat] = useState(etats[0])
  const [selectedStockage, setSelectedStockage] = useState(stockages[0])

  const price = phone.prix_reconditionne[selectedEtat]
  const lowestPrice = Math.min(...Object.values(phone.prix_reconditionne))
  const savings = Math.round(price * 0.6) // ~60% savings vs neuf

  function handleSimuler() {
    const params = new URLSearchParams({ marque: phone.marque, modele: phone.modele })
    router.push(`/simulation?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* ── Image ── */}
      <div className="relative">
        <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={phone.image}
            alt={`${phone.marque} ${phone.modele}`}
            className="w-full h-full object-contain p-8"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-[#8DC63F] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ✅ Garanti 24 mois
          </span>
          {phone.specs.resistance && (
            <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full shadow border border-gray-100">
              {phone.specs.resistance}
            </span>
          )}
        </div>
      </div>

      {/* ── Info panel ── */}
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#7B2D8B] bg-[#7B2D8B]/10 px-2.5 py-1 rounded-full">
              Reconditionné
            </span>
            <span className="text-xs text-gray-400">{phone.annee}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] mb-1">
            {phone.marque} {phone.modele}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">⭐ 4.8/5 · 247 avis</span>
            <span>·</span>
            <span className="text-[#8DC63F] font-medium">En stock</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6 p-4 bg-[#7B2D8B]/5 rounded-2xl">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-4xl font-black text-[#7B2D8B]">{price}€</span>
            <span className="text-lg text-gray-400 line-through">{price + savings}€</span>
            <span className="text-sm font-bold text-[#8DC63F] bg-[#8DC63F]/10 px-2 py-0.5 rounded-lg">
              -{Math.round((savings / (price + savings)) * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-500">Économisez {savings}€ vs neuf · Dès {lowestPrice}€ en état correct</p>
        </div>

        {/* État selector */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-700">État</span>
            <span className="text-xs text-gray-400 italic">{ETAT_DESC[selectedEtat]}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {etats.map(e => {
              const meta = ETAT_LABELS[e]
              const active = selectedEtat === e
              return (
                <button
                  key={e}
                  onClick={() => setSelectedEtat(e)}
                  className="flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: active ? '#7B2D8B' : '#E5E7EB',
                    background: active ? '#7B2D8B08' : 'transparent',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ background: active ? '#7B2D8B' : meta.color + '66' }}
                  >
                    {meta.badge}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">{meta.label}</div>
                    <div className="text-xs text-[#7B2D8B] font-bold">{phone.prix_reconditionne[e]}€</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Stockage selector */}
        {stockages.length > 1 && (
          <div className="mb-6">
            <span className="text-sm font-bold text-gray-700 block mb-3">Stockage</span>
            <div className="flex flex-wrap gap-2">
              {stockages.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStockage(s)}
                  className="px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all"
                  style={{
                    borderColor: selectedStockage === s ? '#7B2D8B' : '#E5E7EB',
                    color: selectedStockage === s ? '#7B2D8B' : '#6B7280',
                    background: selectedStockage === s ? '#7B2D8B08' : 'transparent',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleSimuler}
            className="flex-1 py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}
          >
            🛍️ Réserver en magasin
          </button>
          <button
            onClick={handleSimuler}
            className="px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 hover:bg-gray-50"
            style={{ borderColor: '#7B2D8B', color: '#7B2D8B' }}
          >
            🔧 Prix réparation
          </button>
        </div>

        {/* Trust icons */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '✅', label: 'Garantie 24 mois' },
            { icon: '🔬', label: '25 points de contrôle' },
            { icon: '🚀', label: 'Dispo en magasin' },
          ].map(item => (
            <div key={item.label} className="bg-[#F8F8F8] rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs text-gray-600 font-medium leading-snug">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
