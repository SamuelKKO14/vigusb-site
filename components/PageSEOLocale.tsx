import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { VilleSEO, MagasinData } from '@/lib/villes-seo'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
export type PageType = 'telephone' | 'iphone' | 'samsung' | 'occasion'

type PriceRow = { modele: string; ecran: number; batterie: number; connecteur: number }
type OccasionRow = { modele: string; etat: string; prix: number; garantie: string }

// ────────────────────────────────────────────────────────────────────────────
// Per-type static content
// ────────────────────────────────────────────────────────────────────────────
const CONFIG: Record<PageType, {
  h1: (ville: string) => string
  intro: (ville: string, magasin: string) => string
  h2: (ville: string) => string
  seoText: (ville: string, magasin: string) => string
  models: { label: string; href: string }[]
  secondaryText: (ville: string) => string
  repairPrices?: PriceRow[]
  occasionPrices?: OccasionRow[]
  ctaLabel: string
}> = {
  // ── TELEPHONE ──────────────────────────────────────────────────────────────
  telephone: {
    h1: (v) => `Réparation de téléphones et tablettes à ${v}`,
    intro: (v, m) =>
      `Nous pouvons réparer au meilleur prix vos téléphones et tablettes Apple, Samsung, Huawei, Xiaomi, Sony, etc. directement dans notre magasin proche de ${v}. Pas besoin de rendez-vous — venez directement, nos techniciens s'occupent de tout.`,
    h2: (v) => `Un réparateur proche de ${v} ?`,
    seoText: (v, m) =>
      `L'écran de votre téléphone ou la vitre de votre tablette sont cassés ? Vous souhaitez une réparation iPhone, une réparation iPad, une réparation Galaxy S, une réparation Galaxy A ou encore la réparation d'un Xiaomi Redmi Note ? Notre magasin Vigus'B ${m}, à quelques minutes de ${v}, prend en charge tous types de réparations : remplacement d'écran, changement de batterie, réparation du connecteur de charge, remplacement de caméra ou de vitre arrière. Nos techniciens s'engagent sur un devis transparent avant toute intervention. Toutes les réparations sont garanties 24 mois pièces et main d'œuvre.`,
    models: [
      { label: 'iPhone 15 Pro Max', href: '/telephones/apple-iphone-15-pro-max' },
      { label: 'iPhone 15', href: '/telephones/apple-iphone-15' },
      { label: 'iPhone 14', href: '/telephones/apple-iphone-14' },
      { label: 'iPhone 13', href: '/telephones/apple-iphone-13' },
      { label: 'Galaxy S24 Ultra', href: '/telephones/samsung-galaxy-s24-ultra' },
      { label: 'Galaxy S24', href: '/telephones/samsung-galaxy-s24' },
      { label: 'Galaxy A55', href: '/telephones/samsung-galaxy-a55' },
      { label: 'Redmi Note 13 Pro', href: '/telephones/xiaomi-redmi-note-13-pro' },
      { label: 'Pixel 8 Pro', href: '/telephones/google-pixel-8-pro' },
      { label: 'Pixel 8', href: '/telephones/google-pixel-8' },
    ],
    secondaryText: (v) =>
      `Nous travaillons sur les principales marques : Apple, Samsung, Huawei, Honor, Xiaomi, Sony, Realme, Google, OnePlus, Oppo, Vivo, Nintendo, Xbox et bien d'autres. Nos techniciens experts dans le secteur de la réparation en téléphonie et tablette depuis 2015 se tiennent à votre disposition dans notre magasin proche de ${v}. Devis gratuit, réparation en moins d'une heure dans la plupart des cas.`,
    repairPrices: [
      { modele: 'iPhone 15 Pro Max', ecran: 289, batterie: 89, connecteur: 79 },
      { modele: 'iPhone 15',         ecran: 229, batterie: 79, connecteur: 69 },
      { modele: 'iPhone 14',         ecran: 199, batterie: 69, connecteur: 59 },
      { modele: 'Galaxy S24 Ultra',  ecran: 319, batterie: 89, connecteur: 79 },
      { modele: 'Galaxy S24',        ecran: 249, batterie: 79, connecteur: 69 },
      { modele: 'Redmi Note 13 Pro', ecran: 99,  batterie: 49, connecteur: 39 },
      { modele: 'Pixel 8 Pro',       ecran: 249, batterie: 79, connecteur: 69 },
    ],
    ctaLabel: 'Simuler ma réparation gratuite →',
  },

  // ── IPHONE ─────────────────────────────────────────────────────────────────
  iphone: {
    h1: (v) => `Réparation iPhone à ${v}`,
    intro: (v, m) =>
      `Vous habitez ${v} ? Notre magasin Vigus'B ${m} répare tous les modèles d'iPhone à prix imbattable. Écran, batterie, connecteur, caméra, vitre arrière — intervention rapide sans rendez-vous, garantie 24 mois, certifié QualiRepar.`,
    h2: (v) => `Un réparateur iPhone proche de ${v} ?`,
    seoText: (v, m) =>
      `L'écran de votre iPhone est fissuré ou votre batterie ne tient plus ? Nos techniciens Apple certifiés du magasin Vigus'B ${m}, situé à quelques minutes de ${v}, réparent l'ensemble de la gamme iPhone. Nous intervenons sur la réparation iPhone 15 Pro Max, la réparation iPhone 15 Pro, la réparation iPhone 15, la réparation iPhone 14 Pro, la réparation iPhone 14, la réparation iPhone 13, la réparation iPhone 12 et la réparation iPhone 11. Pièces de qualité originale ou équivalent OEM, devis gratuit avant intervention, garantie 24 mois. Bénéficiez du bonus QualiRepar de 25€ sur le remplacement d'écran.`,
    models: [
      { label: 'iPhone 15 Pro Max', href: '/telephones/apple-iphone-15-pro-max' },
      { label: 'iPhone 15 Pro',     href: '/telephones/apple-iphone-15-pro' },
      { label: 'iPhone 15',         href: '/telephones/apple-iphone-15' },
      { label: 'iPhone 14 Pro Max', href: '/telephones/apple-iphone-14-pro-max' },
      { label: 'iPhone 14',         href: '/telephones/apple-iphone-14' },
      { label: 'iPhone 13',         href: '/telephones/apple-iphone-13' },
      { label: 'iPhone 12',         href: '/telephones/apple-iphone-12' },
      { label: 'iPhone 11',         href: '/telephones/apple-iphone-11' },
      { label: 'iPhone XR',         href: '/simulation?marque=Apple&modele=iPhone+XR' },
      { label: 'iPhone SE',         href: '/simulation?marque=Apple&modele=iPhone+SE' },
    ],
    secondaryText: (v) =>
      `Nos techniciens experts en réparation Apple sont à votre service depuis 2015 dans notre magasin proche de ${v}. Nous utilisons uniquement des pièces certifiées pour garantir la qualité et la durabilité de nos réparations. Bénéficiez du bonus réparation QualiRepar de 25€ sur le remplacement d'écran iPhone. Garantie 24 mois sur toutes les interventions.`,
    repairPrices: [
      { modele: 'iPhone 15 Pro Max', ecran: 289, batterie: 89, connecteur: 79 },
      { modele: 'iPhone 15 Pro',     ecran: 259, batterie: 89, connecteur: 79 },
      { modele: 'iPhone 15',         ecran: 229, batterie: 79, connecteur: 69 },
      { modele: 'iPhone 14 Pro Max', ecran: 249, batterie: 79, connecteur: 69 },
      { modele: 'iPhone 14',         ecran: 199, batterie: 69, connecteur: 59 },
      { modele: 'iPhone 13',         ecran: 169, batterie: 59, connecteur: 49 },
      { modele: 'iPhone 12',         ecran: 129, batterie: 49, connecteur: 39 },
      { modele: 'iPhone 11',         ecran: 99,  batterie: 39, connecteur: 29 },
      { modele: 'iPhone SE',         ecran: 89,  batterie: 39, connecteur: 29 },
    ],
    ctaLabel: 'Simuler ma réparation iPhone →',
  },

  // ── SAMSUNG ────────────────────────────────────────────────────────────────
  samsung: {
    h1: (v) => `Réparation Samsung à ${v}`,
    intro: (v, m) =>
      `Vous habitez ${v} ? Notre magasin Vigus'B ${m} répare tous les Samsung Galaxy au meilleur prix. Galaxy S, Galaxy A, Galaxy Note — intervention rapide sans rendez-vous, garantie 24 mois, certifié QualiRepar.`,
    h2: (v) => `Un réparateur Samsung proche de ${v} ?`,
    seoText: (v, m) =>
      `L'écran de votre Samsung Galaxy est fissuré ou votre batterie ne tient plus ? Nos techniciens du magasin Vigus'B ${m}, situé à quelques minutes de ${v}, réparent l'ensemble de la gamme Samsung. Nous intervenons sur la réparation Galaxy S24 Ultra, la réparation Galaxy S24, la réparation Galaxy S23, la réparation Galaxy S22, la réparation Galaxy A55, la réparation Galaxy A54, la réparation Galaxy A35. Devis gratuit avant intervention, pièces de qualité, garantie 24 mois. Profitez du bonus QualiRepar de 25€ sur le remplacement d'écran Samsung.`,
    models: [
      { label: 'Galaxy S24 Ultra', href: '/telephones/samsung-galaxy-s24-ultra' },
      { label: 'Galaxy S24',       href: '/telephones/samsung-galaxy-s24' },
      { label: 'Galaxy S23 Ultra', href: '/telephones/samsung-galaxy-s23-ultra' },
      { label: 'Galaxy A55',       href: '/telephones/samsung-galaxy-a55' },
      { label: 'Galaxy S22',       href: '/simulation?marque=Samsung&modele=Galaxy+S22' },
      { label: 'Galaxy S21',       href: '/simulation?marque=Samsung&modele=Galaxy+S21' },
      { label: 'Galaxy A54',       href: '/simulation?marque=Samsung&modele=Galaxy+A54' },
      { label: 'Galaxy A35',       href: '/simulation?marque=Samsung&modele=Galaxy+A35' },
      { label: 'Galaxy Note 20',   href: '/simulation?marque=Samsung&modele=Galaxy+Note+20' },
    ],
    secondaryText: (v) =>
      `Nos techniciens experts en réparation Samsung travaillent sur toutes les gammes : Galaxy S, Galaxy A, Galaxy Note, Galaxy Z Fold et Z Flip. Depuis 2015, nous réparons les smartphones Samsung proche de ${v} avec des pièces certifiées et une garantie 24 mois. Devis gratuit, réparation rapide en moins d'une heure pour les pannes courantes.`,
    repairPrices: [
      { modele: 'Galaxy S24 Ultra', ecran: 319, batterie: 89, connecteur: 79 },
      { modele: 'Galaxy S24+',      ecran: 279, batterie: 89, connecteur: 79 },
      { modele: 'Galaxy S24',       ecran: 249, batterie: 79, connecteur: 69 },
      { modele: 'Galaxy S23 Ultra', ecran: 289, batterie: 89, connecteur: 79 },
      { modele: 'Galaxy S23',       ecran: 229, batterie: 79, connecteur: 69 },
      { modele: 'Galaxy A55',       ecran: 149, batterie: 59, connecteur: 49 },
      { modele: 'Galaxy A54',       ecran: 139, batterie: 59, connecteur: 49 },
      { modele: 'Galaxy A35',       ecran: 129, batterie: 49, connecteur: 39 },
    ],
    ctaLabel: 'Simuler ma réparation Samsung →',
  },

  // ── OCCASION ───────────────────────────────────────────────────────────────
  occasion: {
    h1: (v) => `Téléphone reconditionné à ${v}`,
    intro: (v, m) =>
      `Vous cherchez un téléphone reconditionné ou d'occasion proche de ${v} ? Notre magasin Vigus'B ${m} vous propose une sélection rigoureuse d'iPhone, Samsung, Xiaomi et Google Pixel reconditionnés. Garantie 24 mois, jusqu'à -60% vs le prix du neuf.`,
    h2: (v) => `Un téléphone reconditionné près de ${v} ?`,
    seoText: (v, m) =>
      `Vous souhaitez acheter un iPhone reconditionné, un Samsung Galaxy reconditionné, un Xiaomi reconditionné ou un Google Pixel reconditionné à proximité de ${v} ? Notre magasin Vigus'B ${m} vous propose une sélection rigoureuse de smartphones reconditionnés : iPhone 15 reconditionné, iPhone 14 reconditionné, iPhone 13 reconditionné, Galaxy S24 reconditionné, Galaxy S23 reconditionné, Pixel 8 reconditionné. Chaque appareil passe par 25 points de contrôle et bénéficie d'une garantie 24 mois. Jusqu'à 60% d'économies par rapport au neuf.`,
    models: [
      { label: 'iPhone 15 Pro Max reconditionné', href: '/telephones/apple-iphone-15-pro-max' },
      { label: 'iPhone 15 reconditionné',         href: '/telephones/apple-iphone-15' },
      { label: 'iPhone 14 reconditionné',         href: '/telephones/apple-iphone-14' },
      { label: 'iPhone 13 reconditionné',         href: '/telephones/apple-iphone-13' },
      { label: 'iPhone 12 reconditionné',         href: '/telephones/apple-iphone-12' },
      { label: 'Galaxy S24 Ultra reconditionné',  href: '/telephones/samsung-galaxy-s24-ultra' },
      { label: 'Galaxy S24 reconditionné',        href: '/telephones/samsung-galaxy-s24' },
      { label: 'Pixel 8 Pro reconditionné',       href: '/telephones/google-pixel-8-pro' },
    ],
    secondaryText: (v) =>
      `Nous proposons des téléphones reconditionnés toutes marques : Apple iPhone, Samsung Galaxy, Google Pixel, Xiaomi Redmi, OnePlus et bien d'autres. Chaque appareil est nettoyé, testé sur 25 points de contrôle et livré avec sa garantie 24 mois. Retrouvez notre sélection complète dans notre magasin proche de ${v} ou consultez notre catalogue en ligne. Paiement en 3 fois sans frais dès 100€.`,
    occasionPrices: [
      { modele: 'iPhone 15',              etat: 'Très bon état', prix: 599, garantie: '24 mois' },
      { modele: 'iPhone 14',              etat: 'Très bon état', prix: 459, garantie: '24 mois' },
      { modele: 'iPhone 13',              etat: 'Très bon état', prix: 329, garantie: '24 mois' },
      { modele: 'iPhone 12',              etat: 'Bon état',      prix: 209, garantie: '24 mois' },
      { modele: 'Galaxy S24',             etat: 'Très bon état', prix: 589, garantie: '24 mois' },
      { modele: 'Galaxy S23',             etat: 'Très bon état', prix: 429, garantie: '24 mois' },
      { modele: 'Redmi Note 13 Pro',      etat: 'Comme neuf',    prix: 199, garantie: '24 mois' },
      { modele: 'Google Pixel 8',         etat: 'Très bon état', prix: 419, garantie: '24 mois' },
    ],
    ctaLabel: 'Voir nos téléphones disponibles →',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// Helper: small inline link chip
// ────────────────────────────────────────────────────────────────────────────
function ModelChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-block text-sm font-medium underline underline-offset-2 transition-colors"
      style={{ color: '#7B2D8B' }}
    >
      {label}
    </Link>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────
export default function PageSEOLocale({
  ville,
  magasin,
  pageType,
}: {
  ville: VilleSEO
  magasin: MagasinData
  pageType: PageType
}) {
  const cfg = CONFIG[pageType]
  const mapsQuery = encodeURIComponent(`Vigus'B ${magasin.adresse}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Vigus'B — ${cfg.h1(ville.nom)}`,
    description: cfg.intro(ville.nom, magasin.nom),
    address: {
      '@type': 'PostalAddress',
      streetAddress: magasin.adresse,
      addressLocality: magasin.nom,
      postalCode: ville.cp,
      addressCountry: 'FR',
    },
    telephone: magasin.tel,
    openingHours: 'Mo-Sa 10:00-19:15',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <Header />

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="py-16 px-4" style={{ background: '#7B2D8B' }}>
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              {cfg.h1(ville.nom)}
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {cfg.intro(ville.nom, magasin.nom)}
            </p>
            <a
              href={`tel:${magasin.tel.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl shadow-xl transition-all hover:scale-105"
              style={{ background: 'white', color: '#7B2D8B' }}
            >
              <span className="text-2xl">📞</span>
              {magasin.tel}
            </a>
          </div>
        </section>

        {/* ── 2. BANDE D'INFOS ────────────────────────────────────────────── */}
        <section className="py-6 px-4" style={{ background: '#F8F8F8' }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                <span className="text-3xl flex-shrink-0">📅</span>
                <div>
                  <div className="font-bold text-gray-900">Rapide</div>
                  <div className="text-sm text-gray-500">Pas besoin de rendez-vous</div>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-8">
                <span className="text-3xl flex-shrink-0">📍</span>
                <div>
                  <div className="font-bold text-gray-900">{ville.nom}</div>
                  <div className="text-sm text-gray-500">
                    Notre magasin proche de {ville.nom} {ville.cp}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4 sm:py-0 sm:px-8">
                <span className="text-3xl flex-shrink-0">🅿️</span>
                <div>
                  <div className="font-bold text-gray-900">Stationnement</div>
                  <div className="text-sm text-gray-500">
                    Le parking le plus proche est {magasin.parking}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">

          {/* ── 3. TEXTE SEO ──────────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-black mb-5" style={{ color: '#7B2D8B' }}>
              {cfg.h2(ville.nom)}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5 text-base">
              {cfg.seoText(ville.nom, magasin.nom)}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {cfg.models.map(m => (
                <ModelChip key={m.label} label={m.label} href={m.href} />
              ))}
            </div>
          </section>

          {/* ── 4. BLOC MAGASIN ───────────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl p-6 sm:p-8 text-white" style={{ background: '#1A1A1A' }}>
              <p className="text-white/80 text-base leading-relaxed">
                Votre magasin de réparation de téléphones le plus proche de{' '}
                <span className="text-white font-bold">{ville.nom}</span> est notre boutique de{' '}
                <span className="font-bold" style={{ color: '#8DC63F' }}>Vigus&apos;B {magasin.nom}</span>{' '}
                située au{' '}
                <span className="text-white font-semibold">{magasin.adresse}</span>.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 text-white/70">
                  <span>🕐</span> Lun–Sam 10h–19h15
                </span>
                <span className="flex items-center gap-2 text-white/70">
                  <span>📞</span> {magasin.tel}
                </span>
                <span className="flex items-center gap-2 text-white/70">
                  <span>🅿️</span> {magasin.parking}
                </span>
              </div>
            </div>
          </section>

          {/* ── 5. CARTE GOOGLE MAPS ──────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '360px' }}>
              <iframe
                title={`Vigus'B ${magasin.nom} — carte`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${mapsQuery}`}
              />
            </div>
          </section>

          {/* ── 6. TEXTE SEO SECONDAIRE ───────────────────────────────────── */}
          <section>
            <p className="text-gray-700 leading-relaxed text-base">
              {cfg.secondaryText(ville.nom)}
            </p>
          </section>

          {/* ── 7. TARIFS ─────────────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: '#7B2D8B' }}>
              {pageType === 'occasion' ? 'Nos téléphones reconditionnés' : `Tarifs réparation proche de ${ville.nom}`}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {pageType === 'occasion'
                ? 'Prix indicatifs — sélection disponible en magasin. Garantie 24 mois incluse.'
                : 'Tarifs indicatifs · Devis gratuit sur place · Garantie 24 mois · Bonus QualiRepar -25€'}
            </p>

            {pageType === 'occasion' && cfg.occasionPrices ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white" style={{ background: '#7B2D8B' }}>
                      <th className="text-left px-5 py-4 font-bold">Modèle</th>
                      <th className="text-center px-4 py-4 font-bold">État</th>
                      <th className="text-center px-4 py-4 font-bold">Prix</th>
                      <th className="text-center px-4 py-4 font-bold">Garantie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfg.occasionPrices.map((row, i) => (
                      <tr key={row.modele} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}>
                        <td className="px-5 py-3.5 font-semibold text-gray-800">{row.modele}</td>
                        <td className="px-4 py-3.5 text-center text-gray-600">{row.etat}</td>
                        <td className="px-4 py-3.5 text-center font-black" style={{ color: '#7B2D8B' }}>dès {row.prix}€</td>
                        <td className="px-4 py-3.5 text-center font-semibold" style={{ color: '#8DC63F' }}>{row.garantie}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : cfg.repairPrices ? (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white" style={{ background: '#7B2D8B' }}>
                      <th className="text-left px-5 py-4 font-bold">Modèle</th>
                      <th className="text-center px-4 py-4 font-bold">📺 Écran</th>
                      <th className="text-center px-4 py-4 font-bold">🔋 Batterie</th>
                      <th className="text-center px-4 py-4 font-bold">🔌 Connecteur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cfg.repairPrices.map((row, i) => (
                      <tr key={row.modele} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}>
                        <td className="px-5 py-3.5 font-semibold text-gray-800">{row.modele}</td>
                        <td className="px-4 py-3.5 text-center font-bold" style={{ color: '#7B2D8B' }}>{row.ecran}€</td>
                        <td className="px-4 py-3.5 text-center font-bold" style={{ color: '#7B2D8B' }}>{row.batterie}€</td>
                        <td className="px-4 py-3.5 text-center font-bold" style={{ color: '#7B2D8B' }}>{row.connecteur}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <p className="text-xs text-gray-400 mt-3">
              * Tarifs indicatifs, devis gratuit et définitif en magasin.
            </p>
          </section>

          {/* ── 8. CTA FINAL ──────────────────────────────────────────────── */}
          <section className="border-t border-gray-100 pt-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={pageType === 'occasion' ? '/telephones' : '/simulation'}
                className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-center text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                style={{ background: '#7B2D8B' }}
              >
                {cfg.ctaLabel}
              </Link>
              <a
                href={`tel:${magasin.tel.replace(/\s/g, '')}`}
                className="flex-1 py-4 px-6 rounded-2xl font-bold text-base text-center transition-all hover:opacity-90 hover:scale-[1.02] border-2"
                style={{ borderColor: '#8DC63F', color: '#8DC63F' }}
              >
                📞 Nous appeler — {magasin.tel}
              </a>
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </>
  )
}
