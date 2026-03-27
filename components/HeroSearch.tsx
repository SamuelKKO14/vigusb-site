'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TELEPHONES, MAGASINS, MARQUES, type Telephone } from '@/lib/data'

// Map marqueId → logoUrl
const LOGO_MAP: Record<string, string> = Object.fromEntries(
  MARQUES.map(m => [m.id, m.logoUrl])
)

function MagasinModal({
  phone,
  onSelect,
  onClose,
}: {
  phone: Telephone
  onSelect: (id: number) => void
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Pour quel magasin ?</h2>
            <p className="text-sm text-gray-400 mt-0.5">{phone.marque} {phone.modele}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Magasins grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MAGASINS.map(m => (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 text-center transition-all hover:shadow-sm active:scale-95"
                style={{ '--hover-border': '#7B2D8B' } as React.CSSProperties}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#7B2D8B'
                  el.style.background = '#7B2D8B08'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#F3F4F6'
                  el.style.background = 'transparent'
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm"
                  style={{ background: '#7B2D8B' }}
                >
                  📍
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#7B2D8B] leading-snug transition-colors">
                  {m.nom}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Telephone[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<Telephone | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter in real time
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); setShowDropdown(false); return }
    const filtered = TELEPHONES.filter(t =>
      `${t.marque} ${t.modele}`.toLowerCase().includes(q) ||
      t.marque.toLowerCase().includes(q) ||
      t.modele.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(filtered)
    setShowDropdown(filtered.length > 0)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectPhone = useCallback((phone: Telephone) => {
    setSelectedPhone(phone)
    setShowDropdown(false)
    setQuery(`${phone.marque} ${phone.modele}`)
    setShowModal(true)
  }, [])

  const selectMagasin = useCallback((magasinId: number) => {
    if (!selectedPhone) return
    const params = new URLSearchParams({
      marque: selectedPhone.marque,
      modele: selectedPhone.modele,
      magasin: String(magasinId),
    })
    router.push(`/simulation?${params.toString()}`)
    setShowModal(false)
  }, [selectedPhone, router])

  return (
    <>
      {/* ── Hero section ── */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 50%, #3d1347 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-8 right-8 w-72 h-72 rounded-full bg-[#8DC63F] blur-3xl" />
          <div className="absolute bottom-8 left-8 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6 backdrop-blur-sm">
            <span style={{ color: '#8DC63F' }}>●</span>
            14 magasins · Garantie 24 mois · Certifié QualiRepar
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
            Trouvez la réparation<br />
            <span style={{ color: '#8DC63F' }}>pour votre téléphone</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-8">
            Simulation gratuite en 3 minutes
          </p>

          {/* Search bar */}
          <div ref={containerRef} className="relative max-w-xl mx-auto">
            <div
              className="flex items-center bg-white rounded-2xl overflow-visible shadow-xl transition-all"
              style={{ boxShadow: focused ? '0 0 0 3px #8DC63F66, 0 8px 32px rgba(0,0,0,0.15)' : '0 8px 32px rgba(0,0,0,0.15)' }}
            >
              {/* Loupe */}
              <div className="pl-4 pr-2 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="#7B2D8B" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => { setFocused(true); if (results.length > 0) setShowDropdown(true) }}
                onBlur={() => setFocused(false)}
                placeholder="Ex: iPhone 15, Samsung Galaxy S24..."
                className="flex-1 py-4 pr-2 text-gray-800 placeholder-gray-400 text-sm sm:text-base outline-none bg-transparent"
              />

              {query && (
                <button
                  onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); inputRef.current?.focus() }}
                  className="px-3 text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg"
                >
                  ✕
                </button>
              )}

              <button
                onClick={() => { if (results.length > 0) selectPhone(results[0]); else if (!query) router.push('/simulation') }}
                className="flex-shrink-0 mx-2 my-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{ background: '#7B2D8B' }}
              >
                🔧 Réparer
              </button>
            </div>

            {/* Dropdown results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {results.map((t, i) => {
                  const logo = LOGO_MAP[t.marqueId]
                  return (
                    <button
                      key={`${t.marque}-${t.modele}-${i}`}
                      onMouseDown={e => { e.preventDefault(); selectPhone(t) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7B2D8B08] transition-colors border-b border-gray-50 last:border-0 group"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt={t.marque} className="w-6 h-4 object-contain" style={{ filter: 'brightness(0)' }} />
                        ) : (
                          <span className="text-base">📱</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-[#7B2D8B] transition-colors">
                          {t.marque}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{t.modele}</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#7B2D8B] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Suggestions rapides */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-white/50 text-xs">Populaires :</span>
            {['iPhone 15', 'Galaxy S24', 'Redmi Note 13', 'Pixel 8'].map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal choix du magasin */}
      {showModal && selectedPhone && (
        <MagasinModal
          phone={selectedPhone}
          onSelect={selectMagasin}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
