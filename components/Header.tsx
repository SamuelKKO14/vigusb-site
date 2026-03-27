'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: '#7B2D8B' }}>Vigus</span>
            <span className="text-2xl font-black" style={{ color: '#8DC63F' }}>'B</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/telephones" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">Nos téléphones</Link>
            <Link href="/reparation" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">Réparation</Link>
            <Link href="/magasins" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">Nos magasins</Link>
            <Link href="/qui-sommes-nous" className="text-sm font-medium text-gray-600 hover:text-[#7B2D8B] transition-colors">Qui sommes-nous</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/simulation"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#7B2D8B' }}
            >
              🔧 Réparer mon téléphone
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link href="/telephones" className="py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Nos téléphones</Link>
            <Link href="/reparation" className="py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Réparation</Link>
            <Link href="/magasins" className="py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Nos magasins</Link>
            <Link href="/qui-sommes-nous" className="py-2 text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>Qui sommes-nous</Link>
            <Link href="/simulation" className="py-2 text-sm font-semibold text-white px-4 rounded-xl text-center" style={{ background: '#7B2D8B' }} onClick={() => setMenuOpen(false)}>🔧 Réparer mon téléphone</Link>
          </div>
        )}
      </div>
    </header>
  )
}
