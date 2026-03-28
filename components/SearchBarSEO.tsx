'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PHONES_DATABASE } from '@/lib/phones-data'
import type { Phone } from '@/lib/phones-data'

const LOGO_MAP: Record<string, string> = {
  Apple:   'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  Samsung: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  Xiaomi:  'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
  Google:  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
}

export default function SearchBarSEO({ magasinId }: { magasinId: number }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Phone[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter in real time
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); setShowDropdown(false); return }
    const filtered = PHONES_DATABASE.filter(p =>
      `${p.marque} ${p.modele}`.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(filtered)
    setShowDropdown(filtered.length > 0)
    setActiveIndex(-1)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectPhone = useCallback((phone: Phone) => {
    const params = new URLSearchParams({
      marque: phone.marque,
      modele: phone.modele,
      magasin: String(magasinId),
    })
    router.push(`/simulation?${params.toString()}`)
    setShowDropdown(false)
  }, [router, magasinId])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) selectPhone(results[activeIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  return (
    <section className="px-4 py-10 bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-black text-center mb-1" style={{ color: '#7B2D8B' }}>
          Quel est votre téléphone ?
        </h2>
        <p className="text-center text-gray-500 text-sm mb-5">
          Recherchez votre modèle pour obtenir un devis instantané
        </p>

        <div ref={containerRef} className="relative">
          {/* Input */}
          <div
            className="flex items-center bg-white rounded-2xl overflow-visible transition-all"
            style={{
              boxShadow: focused
                ? '0 0 0 2px #7B2D8B, 0 4px 16px rgba(0,0,0,0.08)'
                : '0 0 0 1.5px #E5E7EB, 0 4px 16px rgba(0,0,0,0.05)',
            }}
          >
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
              onKeyDown={handleKeyDown}
              placeholder="Ex : iPhone 15, Galaxy S24, Pixel 8…"
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
              onMouseDown={e => { e.preventDefault(); if (results.length > 0) selectPhone(results[activeIndex >= 0 ? activeIndex : 0]) }}
              className="flex-shrink-0 mx-2 my-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{ background: '#7B2D8B' }}
            >
              🔧 Réparer
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {results.map((phone, i) => {
                const logo = LOGO_MAP[phone.marque]
                const isActive = i === activeIndex
                return (
                  <button
                    key={phone.slug}
                    onMouseDown={e => { e.preventDefault(); selectPhone(phone) }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-0 transition-colors"
                    style={{ background: isActive ? '#7B2D8B08' : 'transparent' }}
                  >
                    {/* Logo */}
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt={phone.marque} className="w-6 h-5 object-contain" style={{ filter: 'brightness(0)' }} />
                      ) : (
                        <span className="text-base">📱</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-800" style={isActive ? { color: '#7B2D8B' } : {}}>
                        {phone.marque}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{phone.modele}</span>
                    </div>

                    {/* Badge */}
                    <span
                      className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ background: '#8DC63F' }}
                    >
                      Réparer →
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick picks */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-gray-400 text-xs">Populaires :</span>
          {['iPhone 15', 'Galaxy S24', 'Pixel 8', 'Redmi Note 13'].map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-[#7B2D8B] hover:text-[#7B2D8B] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
