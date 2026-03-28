'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MAGASINS } from '@/lib/data'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const HERO_PLACEHOLDERS = [
  'iPhone 15 Pro Max...',
  'Samsung Galaxy S24...',
  'Réparer mon écran...',
  'Xiaomi Redmi Note 13...',
  'Changer ma batterie...',
  'Google Pixel 8...',
]

const STATS = [
  { value: 14,    suffix: '',      label: 'Magasins en France',    icon: '📍' },
  { value: 5000,  suffix: '+',     label: 'Références disponibles', icon: '📱' },
  { value: 78593, suffix: '',      label: 'Clients satisfaits',    icon: '😊' },
  { value: 24,    suffix: ' mois', label: 'de garantie',           icon: '✅' },
]

const PRODUCTS = [
  { id: 1, name: 'iPhone 13',            price: 279, oldPrice: 699,  stars: 4.9, reviews: 234, badge: 'POPULAIRE', badgeColor: '#7B2D8B', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { id: 2, name: 'Samsung Galaxy A55',   price: 189, oldPrice: 449,  stars: 4.7, reviews: 156, badge: null,        badgeColor: '',        bg: 'linear-gradient(135deg,#0f3460,#16213e)' },
  { id: 3, name: 'iPhone 14 Pro',        price: 549, oldPrice: 1199, stars: 4.9, reviews: 389, badge: 'TOP VENTE', badgeColor: '#8DC63F', bg: 'linear-gradient(135deg,#533483,#7b2d8b)' },
  { id: 4, name: 'Xiaomi Redmi Note 13', price: 149, oldPrice: 299,  stars: 4.6, reviews: 98,  badge: 'ECO',       badgeColor: '#8DC63F', bg: 'linear-gradient(135deg,#16213e,#0d7377)' },
  { id: 5, name: 'Google Pixel 8',       price: 379, oldPrice: 799,  stars: 4.8, reviews: 201, badge: null,        badgeColor: '',        bg: 'linear-gradient(135deg,#0d7377,#14213d)' },
  { id: 6, name: 'Samsung S24',          price: 499, oldPrice: 999,  stars: 4.8, reviews: 312, badge: null,        badgeColor: '',        bg: 'linear-gradient(135deg,#14213d,#1a1a2e)' },
]

const PANNE_SHORTCUTS = [
  { id: 'ecran',    label: 'Écran',      emoji: '📺', prix: 79 },
  { id: 'batterie', label: 'Batterie',   emoji: '🔋', prix: 49 },
  { id: 'charge',   label: 'Connecteur', emoji: '🔌', prix: 59 },
  { id: 'camera',   label: 'Caméra',     emoji: '📷', prix: 59 },
  { id: 'autre',    label: 'Autre',      emoji: '🔧', prix: 0  },
]

const AVANTAGES = [
  { emoji: '🏆', titre: 'Certifié QualiRepar',  desc: 'Réparateur agréé par l\'État. Bonus réparation éco jusqu\'à 25€.' },
  { emoji: '💰', titre: 'Prix le plus bas',       desc: 'Garanti ou remboursé. On s\'aligne sur tout concurrent.' },
  { emoji: '⚡', titre: 'Réparation express',     desc: 'En 1h sans rendez-vous dans la plupart des cas.' },
  { emoji: '🔋', titre: 'Garantie 24 mois',       desc: 'Sur tous nos produits et réparations sans exception.' },
  { emoji: '💳', titre: 'Paiement en 4x',         desc: 'Sans frais dès 100€. Profitez maintenant, payez sereinement.' },
  { emoji: '🌱', titre: 'Engagement écolo',       desc: 'On répare au lieu de jeter. +50 000 appareils sauvés.' },
]

const BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Google', 'OnePlus',
  'Sony', 'Oppo', 'Honor', 'Vivo', 'Nintendo', 'Xbox',
]

const TEMOIGNAGES = [
  { nom: 'Marie L.',   ville: 'Nantes',   note: 5, texte: 'Écran changé en 45 minutes chrono ! Personnel super sympa et prix imbattable. Je recommande à 100%.' },
  { nom: 'Thomas R.',  ville: 'Rennes',   note: 5, texte: "Mon iPhone tombé dans l'eau, ils l'ont sauvé ! Incroyable. Garantie 24 mois en plus, parfait." },
  { nom: 'Sophie M.',  ville: 'Angers',   note: 5, texte: 'Acheté un iPhone 13 reconditionné, comme neuf ! Le rapport qualité/prix est exceptionnel.' },
  { nom: 'Antoine B.', ville: 'Bordeaux', note: 5, texte: 'Batterie Samsung changée en 30 min pendant ma pause déjeuner. Très professionnel !' },
  { nom: 'Clara V.',   ville: 'Tours',    note: 5, texte: 'Service impeccable, prix compétitifs. Mon Pixel 7 est comme neuf après la réparation.' },
  { nom: 'Julien P.',  ville: 'Le Mans',  note: 5, texte: 'Certifié QualiRepar, ça se sent dans la qualité du travail. Je n\'irai plus nulle part ailleurs !' },
]

const ARTICLES = [
  { titre: 'Comment choisir un téléphone reconditionné ?', cat: 'Guide',      emoji: '📖', desc: 'Tout ce qu\'il faut savoir avant d\'acheter un smartphone reconditionné en 2024.' },
  { titre: '5 signes que votre batterie doit être changée', cat: 'Conseil',    emoji: '🔋', desc: 'Votre téléphone tient moins longtemps ? Voici les signaux d\'alerte à ne pas ignorer.' },
  { titre: 'iPhone vs Samsung : lequel réparer en 2024 ?', cat: 'Comparatif', emoji: '⚖️', desc: 'On compare les coûts et délais de réparation entre les deux géants pour vous aider.' },
]

// Villes sur la carte SVG France (viewBox 0 0 420 460)
const MAP_CITIES = [
  { nom: 'Guérande',          x: 87,  y: 272 },
  { nom: 'Saint-Nazaire',     x: 94,  y: 265 },
  { nom: 'Trignac',           x: 98,  y: 270 },
  { nom: 'Nantes',            x: 115, y: 268 },
  { nom: 'Nantes - Paridis',  x: 119, y: 275 },
  { nom: 'Saint Grégoire',    x: 126, y: 193 },
  { nom: 'Rennes',            x: 130, y: 198 },
  { nom: 'Rennes - Colombia', x: 133, y: 204 },
  { nom: 'Angers',            x: 158, y: 262 },
  { nom: 'Le Mans',           x: 170, y: 225 },
  { nom: 'Le Mans - Jacobins',x: 173, y: 232 },
  { nom: 'Tours',             x: 190, y: 247 },
  { nom: 'Bordeaux',          x: 138, y: 347 },
  { nom: 'Toulouse',          x: 218, y: 388 },
]

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    if (!active) return
    const duration = 2200
    const startTime = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * target))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active, target])
  return count
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function StatCard({ stat, delay, active }: { stat: typeof STATS[0]; delay: string; active: boolean }) {
  const count = useCountUp(stat.value, active)
  return (
    <div className={`reveal ${delay} ${active ? 'visible' : ''} text-center`}>
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className="text-4xl md:text-5xl font-black" style={{ color: '#7B2D8B' }}>
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </div>
      <div className="text-gray-500 text-sm mt-2 font-medium">{stat.label}</div>
    </div>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-yellow-400 text-sm leading-none">
      {'★'.repeat(Math.floor(n))}{'☆'.repeat(5 - Math.floor(n))}
    </span>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function HomePage() {

  // Promo banner
  const [promoClosed, setPromoClosed] = useState(false)

  // Hero animated placeholder
  const [phIdx, setPhIdx]       = useState(0)
  const [phVisible, setPhVisible] = useState(true)
  const [heroSearch, setHeroSearch] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setPhVisible(false)
      setTimeout(() => {
        setPhIdx(i => (i + 1) % HERO_PLACEHOLDERS.length)
        setPhVisible(true)
      }, 350)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Products carousel
  const productsRef = useRef<HTMLDivElement>(null)
  const scrollProducts = (dir: 'left' | 'right') => {
    productsRef.current?.scrollBy({ left: dir === 'right' ? 290 : -290, behavior: 'smooth' })
  }

  // Testimonials auto-carousel
  const [testiIdx, setTestiIdx] = useState(0)
  const [testiKey, setTestiKey] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setTestiIdx(i => (i + 1) % TEMOIGNAGES.length)
      setTestiKey(k => k + 1)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  // Repair simulator
  const [simuPhone, setSimuPhone] = useState('')
  const [simuPanne, setSimuPanne] = useState<string | null>(null)
  const simuPrice = simuPanne
    ? PANNE_SHORTCUTS.find(p => p.id === simuPanne)?.prix ?? null
    : null

  // Map tooltip
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  // Stats counter trigger
  const statsRef  = useRef<HTMLDivElement>(null)
  const [statsActive, setStatsActive] = useState(false)
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.unobserve(el) } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Section reveal refs
  const { ref: prodRef,  inView: prodVisible  } = useInView()
  const { ref: repaRef,  inView: repaVisible  } = useInView()
  const { ref: whyRef,   inView: whyVisible   } = useInView()
  const { ref: mapRef,   inView: mapVisible   } = useInView()
  const { ref: testiRef, inView: testiVisible } = useInView()
  const { ref: blogRef,  inView: blogVisible  } = useInView()

  const topBarItems = [
    '🛡️ Notre Pacte Qualité',
    '🔧 Réparation en 1h',
    '🌱 Stop fast tech',
    '📰 Le Mag',
    '🏆 Certifié QualiRepar',
    '💳 Paiement en 4x sans frais',
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── 1. TOP BAR ── */}
      <div className="bg-gray-100 text-gray-600 text-xs py-2 overflow-hidden">
        <div className="flex items-center justify-between max-w-full px-4">
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-topbar whitespace-nowrap" style={{ width: 'max-content' }}>
              {[...topBarItems, ...topBarItems].map((item, i) => (
                <span key={i} className="px-6 border-r border-gray-300 font-medium">{item}</span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 pl-4 font-semibold text-gray-700">
            <span>🇫🇷</span><span>FR</span>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER ── */}
      <Header />

      {/* ── 3. BARRE NAV ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-[64px] z-40">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 px-4 py-2 min-w-max max-w-7xl mx-auto">
            {[
              { label: '✨ Bons plans',   href: '/telephones',      color: '#8DC63F', bold: true  },
              { label: '🎁 Cartes cadeau',href: '#',                color: undefined, bold: false },
              { label: 'Smartphones',    href: '/telephones',       color: undefined, bold: false },
              { label: 'Tablettes',      href: '#',                 color: undefined, bold: false },
              { label: 'Consoles',       href: '#',                 color: undefined, bold: false },
              { label: 'Accessoires',    href: '/services',         color: undefined, bold: false },
              { label: 'Réparation',     href: '/reparation',       color: undefined, bold: false },
              { label: 'À propos',       href: '/qui-sommes-nous',  color: undefined, bold: false },
            ].map(({ label, href, color, bold }) => (
              <Link
                key={label}
                href={href}
                className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all hover:bg-gray-100"
                style={{ color: color || '#374151', fontWeight: bold ? 700 : 500 }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── 4. BANDEAU PROMO ── */}
      {!promoClosed && (
        <div className="bg-[#F3E8FF] border-b border-purple-200 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-center flex-1 font-medium text-[#7B2D8B]">
              ⚡ <strong>VENTE FLASH 48h :</strong> -30€ sur la réparation iPhone 15.{' '}
              <Link href="/simulation" className="underline font-semibold hover:no-underline">
                J&#39;en profite →
              </Link>
            </p>
            <button
              onClick={() => setPromoClosed(true)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-purple-200 text-[#7B2D8B] transition-colors font-bold text-sm"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── 5. HERO ── */}
      <section
        className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 pt-12 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F3E8FF 0%, #EDE9FE 30%, #FFFFFF 70%)' }}
      >
        {/* Décors */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#7B2D8B', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#8DC63F', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: '#F3E8FF', color: '#7B2D8B', border: '1px solid #c084fc' }}>
            🏆 Certifié QualiRepar — Réparateur agréé par l&#39;État
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6" style={{ color: '#1A1A2E' }}>
            Votre téléphone mérite{' '}
            <span style={{ color: '#7B2D8B' }}>mieux qu&#39;une poubelle</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Réparez, achetez reconditionné, choisissez l&#39;écologie.
            <br className="hidden sm:block" />
            <strong className="text-gray-700">14 magasins en France</strong>, réparation en 1h sans rendez-vous.
          </p>

          {/* Search bar géante */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">🔍</div>
            <input
              type="text"
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              className="w-full h-16 pl-14 pr-36 rounded-2xl text-lg font-medium border-2 outline-none focus:border-[#7B2D8B] transition-colors shadow-xl bg-white"
              style={{ borderColor: '#e5e7eb' }}
              onKeyDown={e => {
                if (e.key === 'Enter') window.location.href = `/simulation${heroSearch ? `?q=${encodeURIComponent(heroSearch)}` : ''}`
              }}
            />
            {/* Placeholder animé */}
            {!heroSearch && (
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none transition-all duration-300"
                style={{ opacity: phVisible ? 1 : 0, transform: `translateY(calc(-50% + ${phVisible ? '0px' : '8px'}))` }}
              >
                {HERO_PLACEHOLDERS[phIdx]}
              </span>
            )}
            <Link
              href={`/simulation${heroSearch ? `?q=${encodeURIComponent(heroSearch)}` : ''}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: '#7B2D8B' }}
            >
              Simuler →
            </Link>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { icon: '✅', text: 'Garantie 24 mois' },
              { icon: '🏆', text: 'Certifié QualiRepar' },
              { icon: '💳', text: 'Paiement en 4x' },
            ].map(b => (
              <span key={b.text}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold shadow-sm border border-gray-100">
                {b.icon} {b.text}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/simulation"
              className="px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
              style={{ background: '#7B2D8B' }}>
              🔧 Simuler ma réparation
            </Link>
            <Link href="/telephones"
              className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:bg-gray-50 border-2"
              style={{ borderColor: '#7B2D8B', color: '#7B2D8B' }}>
              📱 Voir les téléphones
            </Link>
          </div>
        </div>

        {/* Flèche bas */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow text-[#7B2D8B] opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── 6. STATS ── */}
      <section className="py-20 px-4 bg-white">
        <div ref={statsRef} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              stat={s}
              delay={`reveal-d${i + 1}`}
              active={statsActive}
            />
          ))}
        </div>
      </section>

      {/* ── 7. BONS PLANS ── */}
      <section className="py-20 px-4 bg-[#F8F8F8]">
        <div ref={prodRef} className="max-w-7xl mx-auto">
          <div className={`reveal ${prodVisible ? 'visible' : ''} flex items-end justify-between mb-8 flex-wrap gap-4`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E]">✨ Bons plans du moment</h2>
              <p className="text-gray-500 mt-1">Téléphones reconditionnés, garantis 24 mois</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollProducts('left')}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#7B2D8B] hover:text-[#7B2D8B] transition-all shadow-sm text-lg font-bold">
                ←
              </button>
              <button onClick={() => scrollProducts('right')}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#7B2D8B] hover:text-[#7B2D8B] transition-all shadow-sm text-lg font-bold">
                →
              </button>
            </div>
          </div>

          {/* Carousel horizontal */}
          <div
            ref={productsRef}
            className="products-scroll flex gap-5 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`reveal reveal-d${Math.min(i + 1, 6)} ${prodVisible ? 'visible' : ''} flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image */}
                <div className="relative h-44 flex items-center justify-center" style={{ background: p.bg }}>
                  <span className="text-6xl">📱</span>
                  {p.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black text-white"
                      style={{ background: p.badgeColor }}>
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
                    Reconditionné
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1A1A2E] text-sm mb-1 group-hover:text-[#7B2D8B] transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Stars n={p.stars} />
                    <span className="text-xs text-gray-400">({p.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-black" style={{ color: '#7B2D8B' }}>{p.price} €</span>
                    <span className="text-sm text-gray-400 line-through">{p.oldPrice} €</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-3">✅ Garantie 24 mois incluse</div>
                  <Link href="/telephones"
                    className="block text-center py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: '#7B2D8B' }}>
                    Voir →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/telephones"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all hover:bg-[#7B2D8B] hover:text-white"
              style={{ borderColor: '#7B2D8B', color: '#7B2D8B' }}>
              Voir tous les téléphones →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. RÉPARATION ── */}
      <section ref={repaRef} className="py-20 px-4" style={{ background: '#7B2D8B' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Gauche */}
          <div className={`reveal ${repaVisible ? 'visible' : ''} text-white`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm font-semibold mb-6">
              🔧 Réparation express
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Votre téléphone est cassé ?
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Réparation en <strong className="text-white">1h dans nos magasins</strong>, sans rendez-vous. Devis gratuit et immédiat.
            </p>
            <ul className="space-y-3 mb-10">
              {['Écran cassé / fissuré', 'Batterie qui lâche', 'Connecteur de charge', 'Caméra défectueuse', 'Dégât des eaux'].map(item => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs flex-shrink-0 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/simulation"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-[#7B2D8B] bg-white transition-all hover:bg-gray-50 hover:scale-[1.02] shadow-xl">
              Simuler ma réparation gratuitement →
            </Link>
          </div>

          {/* Droite — simulateur */}
          <div className={`reveal reveal-d2 ${repaVisible ? 'visible' : ''}`}>
            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <h3 className="font-black text-[#1A1A2E] text-lg mb-5">⚡ Estimez le prix en 30 secondes</h3>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Quel est votre téléphone ?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    value={simuPhone}
                    onChange={e => setSimuPhone(e.target.value)}
                    placeholder="Ex: iPhone 13, Samsung S23..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#7B2D8B] transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Quelle est la panne ?
                </label>
                <div className="flex flex-wrap gap-2">
                  {PANNE_SHORTCUTS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSimuPanne(simuPanne === p.id ? null : p.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all"
                      style={{
                        borderColor: simuPanne === p.id ? '#7B2D8B' : '#e5e7eb',
                        background:  simuPanne === p.id ? '#F3E8FF' : 'white',
                        color:       simuPanne === p.id ? '#7B2D8B' : '#374151',
                      }}
                    >
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {simuPanne && (
                <div className="mb-5 p-4 rounded-2xl text-center" style={{ background: '#F3E8FF' }}>
                  {simuPrice && simuPrice > 0 ? (
                    <>
                      <p className="text-xs text-gray-500 font-medium mb-1">Prix estimé à partir de</p>
                      <p className="text-3xl font-black" style={{ color: '#7B2D8B' }}>{simuPrice} €</p>
                      <p className="text-xs text-gray-400 mt-1">Garantie 24 mois incluse · Devis sans engagement</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-[#7B2D8B]">🔧 Diagnostic gratuit en magasin</p>
                  )}
                </div>
              )}

              <Link href="/simulation"
                className="block text-center py-3.5 rounded-2xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#7B2D8B' }}>
                Prendre rendez-vous →
              </Link>
              <p className="text-center text-xs text-gray-400 mt-3">Sans engagement · Devis gratuit</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. POURQUOI VIGUS'B ── */}
      <section className="py-20 px-4 bg-[#F8F8F8]">
        <div ref={whyRef} className="max-w-7xl mx-auto">
          <div className={`reveal ${whyVisible ? 'visible' : ''} text-center mb-12`}>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-3">
              Pourquoi choisir Vigus&#39;B ?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Bien plus qu&#39;un réparateur — un partenaire de confiance pour votre smartphone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AVANTAGES.map((a, i) => (
              <div
                key={a.titre}
                className={`reveal reveal-d${Math.min(i + 1, 6)} ${whyVisible ? 'visible' : ''} bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-[#7B2D8B]/20 hover:-translate-y-1 transition-all group`}
              >
                <div className="text-4xl mb-4">{a.emoji}</div>
                <h3 className="font-bold text-[#1A1A2E] mb-2 group-hover:text-[#7B2D8B] transition-colors">{a.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. MARQUES — carousel infini ── */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#1A1A2E]">
            Nous réparons toutes les marques
          </h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, white, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, white, transparent)' }} />
          <div className="flex animate-marquee" style={{ width: 'max-content' }}>
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div key={i}
                className="flex-shrink-0 mx-4 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#7B2D8B]/30 hover:bg-[#F3E8FF] transition-all cursor-default">
                <span className="text-sm font-semibold text-gray-600">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. MAGASINS ── */}
      <section className="py-20 px-4 bg-[#F8F8F8]">
        <div ref={mapRef} className="max-w-7xl mx-auto">
          <div className={`reveal ${mapVisible ? 'visible' : ''} text-center mb-12`}>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-3">
              14 magasins partout en France
            </h2>
            <p className="text-gray-500">Trouvez le magasin le plus proche de chez vous</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* SVG France */}
            <div className={`reveal reveal-d1 ${mapVisible ? 'visible' : ''} w-full lg:w-auto flex justify-center`}>
              <svg
                viewBox="0 0 420 460"
                className="w-full max-w-[280px] md:max-w-xs"
                style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.08))' }}
              >
                {/* Fond France */}
                <path
                  d="M190,18 L235,25 L268,50 L298,46 L318,66 L345,76 L364,102 L378,132 L375,165 L358,185 L378,218 L380,258 L362,292 L338,320 L308,348 L276,376 L248,398 L222,412 L196,415 L174,405 L150,390 L126,370 L102,342 L82,310 L70,274 L72,240 L54,214 L55,182 L72,152 L86,124 L106,96 L130,72 L158,50 L174,32 Z"
                  fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2"
                />
                {/* Péninsule bretonne */}
                <path
                  d="M102,272 L82,265 L65,258 L55,248 L60,238 L75,232 L90,240 L100,255 L102,272 Z"
                  fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2"
                />
                {/* Points villes */}
                {MAP_CITIES.map(city => (
                  <g key={city.nom}
                    onMouseEnter={() => setHoveredCity(city.nom)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <circle cx={city.x} cy={city.y} r={hoveredCity === city.nom ? 10 : 7}
                      fill="#7B2D8B" opacity={0.2} style={{ transition: 'r 0.15s' }} />
                    <circle cx={city.x} cy={city.y} r={hoveredCity === city.nom ? 6 : 4}
                      fill="#7B2D8B" stroke="white" strokeWidth="1.5"
                      className="cursor-pointer" style={{ transition: 'r 0.15s' }} />
                    {hoveredCity === city.nom && (
                      <g>
                        <rect x={city.x + 8} y={city.y - 14}
                          width={city.nom.length * 5.5 + 14} height={22} rx="4" fill="#1A1A2E" />
                        <text x={city.x + 15} y={city.y + 3}
                          fontSize="8.5" fill="white" fontFamily="Inter,sans-serif" fontWeight="600">
                          {city.nom}
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Liste villes */}
            <div className={`reveal reveal-d2 ${mapVisible ? 'visible' : ''} flex-1`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {MAGASINS.map(m => (
                  <Link key={m.id} href={`/magasins#magasin-${m.id}`}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-[#7B2D8B] hover:bg-[#F3E8FF] hover:shadow-sm transition-all group">
                    <span className="text-[#7B2D8B]">📍</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#7B2D8B] transition-colors">{m.nom}</span>
                  </Link>
                ))}
              </div>
              <Link href="/magasins"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#7B2D8B' }}>
                Voir tous les magasins →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. TÉMOIGNAGES ── */}
      <section ref={testiRef} className="py-20 px-4" style={{ background: '#F3E8FF' }}>
        <div className="max-w-7xl mx-auto">
          <div className={`reveal ${testiVisible ? 'visible' : ''} text-center mb-12`}>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-4">Ils nous font confiance</h2>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-sm">
              <span className="text-xl font-black text-blue-500">G</span>
              <div className="text-left">
                <div className="flex text-yellow-400 text-sm leading-none">★★★★★</div>
                <div className="text-xs font-semibold text-gray-600 mt-0.5">Note 4.8/5 · +2 300 avis Google</div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              TEMOIGNAGES[testiIdx % TEMOIGNAGES.length],
              TEMOIGNAGES[(testiIdx + 1) % TEMOIGNAGES.length],
              TEMOIGNAGES[(testiIdx + 2) % TEMOIGNAGES.length],
            ].map((t, i) => (
              <div key={`${testiKey}-${i}`}
                className="testi-enter bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <div className="flex text-yellow-400 mb-4 text-sm">{'★'.repeat(t.note)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.texte}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#7B2D8B' }}>
                    {t.nom[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1A1A2E]">{t.nom}</div>
                    <div className="text-xs text-gray-400">Magasin de {t.ville}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TEMOIGNAGES.map((_, i) => (
              <button key={i}
                onClick={() => { setTestiIdx(i); setTestiKey(k => k + 1) }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === testiIdx % TEMOIGNAGES.length ? '24px' : '8px',
                  height: '8px',
                  background: i === testiIdx % TEMOIGNAGES.length ? '#7B2D8B' : '#c084fc',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. LE MAG ── */}
      <section className="py-20 px-4 bg-white">
        <div ref={blogRef} className="max-w-7xl mx-auto">
          <div className={`reveal ${blogVisible ? 'visible' : ''} text-center mb-12`}>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] mb-3">📰 Le Mag Vigus&#39;B</h2>
            <p className="text-gray-500">Conseils, guides et actualités du monde de la tech</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES.map((a, i) => (
              <div key={a.titre}
                className={`reveal reveal-d${i + 1} ${blogVisible ? 'visible' : ''} bg-[#F8F8F8] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group`}>
                <div className="h-40 flex items-center justify-center"
                  style={{ background: i === 0 ? '#EDE9FE' : i === 1 ? '#F3E8FF' : '#E0F2FE' }}>
                  <span className="text-5xl">{a.emoji}</span>
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold text-white mb-3"
                    style={{ background: '#8DC63F' }}>
                    {a.cat}
                  </span>
                  <h3 className="font-bold text-[#1A1A2E] mb-2 group-hover:text-[#7B2D8B] transition-colors leading-snug">
                    {a.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                  <p className="text-[#7B2D8B] text-sm font-semibold mt-4 group-hover:underline">Lire l&#39;article →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. CTA FINAL ── */}
      <section className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 45%, #3d6b18 75%, #8DC63F 100%)' }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            Prêt à donner une seconde vie à votre téléphone ?
          </h2>
          <p className="text-white/80 mb-10 text-lg">Simulation gratuite en 3 minutes. Sans engagement.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/simulation"
              className="px-8 py-4 rounded-2xl font-bold text-[#7B2D8B] bg-white transition-all hover:bg-gray-50 hover:scale-[1.02] shadow-xl text-base">
              🔧 Réparer mon téléphone
            </Link>
            <Link href="/telephones"
              className="px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/60 transition-all hover:bg-white/10 text-base">
              📱 Voir les téléphones reconditionnés
            </Link>
          </div>
        </div>
      </section>

      {/* ── 15. FOOTER ── */}
      <Footer />

    </div>
  )
}
