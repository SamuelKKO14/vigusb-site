import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const SERVICES = [
  { emoji: '🔧', titre: 'Réparation rapide', desc: 'Écran, batterie, connecteur de charge, caméra, vitre arrière… Réparation express en moins d\'une heure dans la plupart des cas. Devis gratuit en magasin.', cta: 'Simuler ma réparation', href: '/simulation' },
  { emoji: '📱', titre: 'Téléphones reconditionnés', desc: 'Sélection rigoureuse de smartphones reconditionnés avec garantie 24 mois. Jusqu\'à -60% par rapport au prix du neuf. Apple, Samsung, Xiaomi et bien d\'autres.', cta: 'Voir nos téléphones', href: '/telephones' },
  { emoji: '🛍️', titre: 'Accessoires', desc: 'Coques de protection, films de verre trempé, câbles, chargeurs, écouteurs… Tout le nécessaire pour protéger et équiper votre smartphone au meilleur prix.', cta: 'Nos magasins', href: '/magasins' },
  { emoji: '🛡️', titre: 'Pose film de protection', desc: 'Application professionnelle de film de protection sur place. Pose parfaite sans bulle, garantie. Protégez votre écran dès aujourd\'hui.', cta: 'Trouver un magasin', href: '/magasins' },
  { emoji: '💳', titre: 'Paiement en plusieurs fois', desc: 'Étalez vos paiements sans frais. Achetez votre téléphone reconditionné ou financez votre réparation en toute sérénité.', cta: 'En savoir plus', href: '/contact' },
  { emoji: '♻️', titre: 'Reprise & Recyclage', desc: 'Donnez une seconde vie à votre ancien téléphone. Nous rachetons et recyclons vos appareils de manière éco-responsable. Bonne pour la planète et pour votre portefeuille.', cta: 'Nous contacter', href: '/contact' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #7B2D8B 0%, #5a1f67 100%)' }}>
        <h1 className="text-4xl font-black text-white mb-4">Nos Services</h1>
        <p className="text-white/80 max-w-xl mx-auto">
          Réparation, reconditionné, accessoires… tout pour votre smartphone dans nos 14 magasins.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map(s => (
            <div key={s.titre} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-shadow flex flex-col">
              <div className="text-5xl mb-5">{s.emoji}</div>
              <h2 className="font-black text-xl text-[#1A1A1A] mb-3">{s.titre}</h2>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">{s.desc}</p>
              <Link href={s.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#7B2D8B' }}>
                {s.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
