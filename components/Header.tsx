'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { MAGASINS } from '@/lib/data'

const REPARATION_ITEMS = [
  { label: 'Tarifs iPhone', href: '/reparation#apple' },
  { label: 'Tarifs Samsung', href: '/reparation#samsung' },
  { label: 'Tarifs Xiaomi', href: '/reparation#xiaomi' },
  { label: 'Tarifs Huawei', href: '/reparation#huawei' },
]

function SimulationModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function go(mode: string) {
    router.push(`/simulation?mode=${mode}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-[fadeIn_0.2s_ease]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors text-sm font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-center mb-1" style={{ color: '#7B2D8B' }}>
          Je veux réaliser une
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Choisissez le type de démarche souhaitée
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => go('simulation')}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed hover:scale-[1.02] transition-all group"
            style={{ borderColor: '#7B2D8B' }}
          >
            <span className="text-4xl">🔧</span>
            <span className="font-black text-base" style={{ color: '#7B2D8B' }}>Simulation</span>
            <span className="text-xs text-gray-400 text-center leading-relaxed">
              Estimez le coût de votre réparation
            </span>
          </button>

          <button
            onClick={() => go('reservation')}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed hover:scale-[1.02] transition-all group"
            style={{ borderColor: '#8DC63F' }}
          >
            <span className="text-4xl">📅</span>
            <span className="font-black text-base" style={{ color: '#8DC63F' }}>Réservation</span>
            <span className="text-xs text-gray-400 text-center leading-relaxed">
              Réservez votre créneau en magasin
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors py-1"
        onClick={() => setOpen(v => !v)}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] z-50">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileMagasinsOpen, setMobileMagasinsOpen] = useState(false)
  const [mobileReparationOpen, setMobileReparationOpen] = useState(false)

  function openModal() {
    setMenuOpen(false)
    setModalOpen(true)
  }

  return (
    <>
      {modalOpen && <SimulationModal onClose={() => setModalOpen(false)} />}

      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.vigusb.fr/img/vigus-b-logo-1610465866.jpg"
                alt="Vigus'B"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {/* Nos Magasins dropdown */}
              <Dropdown label="Nos Magasins">
                <div className="grid grid-cols-2 gap-x-2 px-2 py-1">
                  {MAGASINS.map(m => (
                    <Link
                      key={m.id}
                      href={`/magasins#magasin-${m.id}`}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-[#7B2D8B] hover:bg-[#7B2D8B]/5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {m.nom}
                    </Link>
                  ))}
                </div>
              </Dropdown>

              <Link href="/telephones" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">
                Nos Téléphones
              </Link>

              {/* Réparation dropdown */}
              <Dropdown label="Réparation">
                {REPARATION_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-[#7B2D8B] hover:bg-[#7B2D8B]/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </Dropdown>

              <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">
                Nos Services
              </Link>

              <Link href="/qui-sommes-nous" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">
                Qui sommes-nous
              </Link>

              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">
                Contact
              </Link>
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={openModal}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                style={{ background: '#7B2D8B' }}
              >
                🔧 Simuler ma réparation
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 flex flex-col gap-1">
              {/* Nos Magasins */}
              <button
                onClick={() => setMobileMagasinsOpen(v => !v)}
                className="flex items-center justify-between w-full py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nos Magasins
                <svg className={`w-4 h-4 transition-transform ${mobileMagasinsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileMagasinsOpen && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  {MAGASINS.map(m => (
                    <Link key={m.id} href={`/magasins#magasin-${m.id}`}
                      className="py-2 px-2 text-sm text-gray-500 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}>
                      📍 {m.nom}
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/telephones" className="py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                Nos Téléphones
              </Link>

              {/* Réparation */}
              <button
                onClick={() => setMobileReparationOpen(v => !v)}
                className="flex items-center justify-between w-full py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réparation
                <svg className={`w-4 h-4 transition-transform ${mobileReparationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileReparationOpen && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  {REPARATION_ITEMS.map(item => (
                    <Link key={item.href} href={item.href}
                      className="py-2 px-2 text-sm text-gray-500 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/services" className="py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                Nos Services
              </Link>
              <Link href="/qui-sommes-nous" className="py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                Qui sommes-nous
              </Link>
              <Link href="/contact" className="py-2.5 px-2 text-sm font-medium text-gray-600 hover:text-[#7B2D8B] rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>

              <button
                onClick={openModal}
                className="mt-2 py-3 px-4 text-sm font-bold text-white rounded-xl text-center transition-all hover:opacity-90"
                style={{ background: '#7B2D8B' }}
              >
                🔧 Simuler ma réparation
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
