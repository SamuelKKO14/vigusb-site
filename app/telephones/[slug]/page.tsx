import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductHero from '@/components/ProductHero'
import { PHONES_DATABASE, getLowestPrice, getLowestRepairPrice } from '@/lib/phones-data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return PHONES_DATABASE.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const phone = PHONES_DATABASE.find(p => p.slug === slug)
  if (!phone) return { title: 'Téléphone introuvable' }

  const lowestPrice = getLowestPrice(phone)
  const lowestRepair = getLowestRepairPrice(phone)
  const title = `${phone.marque} ${phone.modele} Reconditionné — dès ${lowestPrice}€ | Vigus'B`
  const description = `Achetez le ${phone.marque} ${phone.modele} reconditionné dès ${lowestPrice}€ avec garantie 24 mois. Réparation écran dès ${lowestRepair}€. 14 magasins en France.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: phone.image }],
    },
  }
}

const REPARATION_LABELS: Record<string, { label: string; emoji: string }> = {
  ecran: { label: 'Écran', emoji: '📺' },
  batterie: { label: 'Batterie', emoji: '🔋' },
  connecteur: { label: 'Connecteur', emoji: '🔌' },
  camera: { label: 'Caméra', emoji: '📷' },
  vitre_arriere: { label: 'Vitre arrière', emoji: '🪟' },
}

export default async function PhonePage({ params }: Props) {
  const { slug } = await params
  const phone = PHONES_DATABASE.find(p => p.slug === slug)
  if (!phone) notFound()

  const lowestPrice = getLowestPrice(phone)
  const similarPhones = PHONES_DATABASE
    .filter(p => p.slug !== phone.slug && p.marque === phone.marque)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${phone.marque} ${phone.modele} Reconditionné`,
    image: phone.image,
    description: `${phone.marque} ${phone.modele} reconditionné avec garantie 24 mois`,
    brand: { '@type': 'Brand', name: phone.marque },
    offers: {
      '@type': 'Offer',
      price: lowestPrice,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: "Vigus'B" },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
    },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#7B2D8B] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/telephones" className="hover:text-[#7B2D8B] transition-colors">Téléphones</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{phone.marque} {phone.modele}</span>
        </nav>

        {/* Hero product section */}
        <div className="mb-16">
          <ProductHero phone={phone} />
        </div>

        {/* Specs */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">Caractéristiques techniques</h2>
          <div className="bg-[#F8F8F8] rounded-3xl overflow-hidden border border-gray-100">
            {[
              { label: 'Écran', value: phone.specs.ecran },
              { label: 'Processeur', value: phone.specs.processeur },
              { label: 'RAM', value: phone.specs.ram },
              { label: 'Stockage', value: phone.specs.stockage.join(', ') },
              { label: 'Batterie', value: phone.specs.batterie },
              { label: 'Caméra principale', value: phone.specs.camera_principale },
              { label: 'Caméra frontale', value: phone.specs.camera_frontale },
              { label: 'Système', value: phone.specs.os },
              { label: 'Connectivité', value: phone.specs.connectivite },
              { label: 'Dimensions', value: phone.specs.dimensions },
              { label: 'Poids', value: phone.specs.poids },
              ...(phone.specs.resistance ? [{ label: 'Résistance', value: phone.specs.resistance }] : []),
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}`}
              >
                <span className="text-sm font-semibold text-gray-500 w-40 flex-shrink-0">{row.label}</span>
                <span className="text-sm text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Réparations */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#1A1A1A]">
              Réparations disponibles — {phone.marque} {phone.modele}
            </h2>
            <Link href="/simulation" className="text-sm font-semibold text-[#7B2D8B] hover:underline">
              Simuler →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {(Object.entries(phone.prix_reparation) as [keyof typeof phone.prix_reparation, number][]).map(([key, prix]) => {
              const meta = REPARATION_LABELS[key]
              return (
                <Link
                  key={key}
                  href={`/simulation?marque=${encodeURIComponent(phone.marque)}&modele=${encodeURIComponent(phone.modele)}`}
                  className="group bg-white border-2 border-gray-100 hover:border-[#7B2D8B] rounded-2xl p-5 text-center transition-all hover:shadow-md"
                >
                  <div className="text-3xl mb-3">{meta.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-[#7B2D8B] transition-colors mb-1">
                    {meta.label}
                  </div>
                  <div className="text-xl font-black text-[#7B2D8B]">{prix}€</div>
                  <div className="text-xs text-gray-400 mt-1">Garantie incluse</div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Avis */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">Avis clients</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { nom: 'Claire M.', note: 5, texte: `Mon ${phone.modele} est parfait. Comme neuf vraiment. La batterie tient toute la journée sans problème.` },
              { nom: 'Julien P.', note: 5, texte: 'Livraison rapide en magasin, emballage soigné. Personnel très sympa. Je recommande à 100%.' },
              { nom: 'Sarah K.', note: 5, texte: "Excellent rapport qualité/prix ! La garantie 24 mois m'a convaincu. Aucun regret." },
            ].map(avis => (
              <div key={avis.nom} className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-100">
                <div className="flex text-yellow-400 text-sm mb-3">{'★'.repeat(avis.note)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{avis.texte}&quot;</p>
                <div className="text-sm font-semibold text-[#1A1A1A]">{avis.nom}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar phones */}
        {similarPhones.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
              Autres {phone.marque} reconditionnés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similarPhones.map(p => (
                <Link
                  key={p.slug}
                  href={`/telephones/${p.slug}`}
                  className="group bg-white border-2 border-gray-100 hover:border-[#7B2D8B] rounded-2xl overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={`${p.marque} ${p.modele}`} className="h-28 object-contain" />
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-gray-800 group-hover:text-[#7B2D8B] transition-colors text-sm mb-1">
                      {p.marque} {p.modele}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-[#7B2D8B]">dès {getLowestPrice(p)}€</span>
                      <span className="text-xs text-gray-400">✅ 24 mois</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
    </>
  )
}
