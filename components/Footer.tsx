import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-black text-[#7B2D8B]">Vigus</span>
              <span className="text-2xl font-black text-[#8DC63F]">'B</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">14 magasins pour réparer, acheter et recycler vos smartphones. Certifié QualiRepar.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Nos services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/simulation" className="hover:text-[#8DC63F] transition-colors">Simuler une réparation</Link></li>
              <li><Link href="/telephones" className="hover:text-[#8DC63F] transition-colors">Téléphones reconditionnés</Link></li>
              <li><Link href="/reparation" className="hover:text-[#8DC63F] transition-colors">Tarifs réparation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Qui sommes-nous</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/qui-sommes-nous" className="hover:text-[#8DC63F] transition-colors">Notre histoire</Link></li>
              <li><Link href="/magasins" className="hover:text-[#8DC63F] transition-colors">Nos 14 magasins</Link></li>
              <li><Link href="/contact" className="hover:text-[#8DC63F] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Certifications</h4>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-sm text-gray-400">✅ Certifié QualiRepar</span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-400">✅ Garantie 24 mois</span>
              <span className="inline-flex items-center gap-2 text-sm text-gray-400">✅ Éco-responsable</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 Vigus'B. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-300">Mentions légales</Link>
            <Link href="#" className="hover:text-gray-300">CGV</Link>
            <Link href="#" className="hover:text-gray-300">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
