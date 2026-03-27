'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { MAGASINS } from '@/lib/data'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1A1A1A] mb-4">Contactez-nous</h1>
          <p className="text-gray-500">Notre équipe vous répond dans les plus brefs délais.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-black text-xl text-[#1A1A1A] mb-6">Envoyer un message</h2>
                {[
                  { key: 'nom', label: 'Nom complet *', type: 'text', placeholder: 'Jean Dupont' },
                  { key: 'email', label: 'Email *', type: 'email', placeholder: 'jean@exemple.fr' },
                  { key: 'sujet', label: 'Sujet *', type: 'text', placeholder: 'Ex: Question sur une réparation' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} required
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B2D8B] text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea rows={5} placeholder="Décrivez votre demande..." required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B2D8B] text-sm resize-none" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90" style={{ background: '#7B2D8B' }}>
                  Envoyer le message
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Message envoyé !</h3>
                <p className="text-gray-500">Nous vous répondrons dans les 24h.</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-black text-xl text-[#1A1A1A] mb-6">Nos magasins</h2>
            <div className="flex flex-col gap-3">
              {MAGASINS.slice(0, 8).map(m => (
                <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-[#1A1A1A]">📍 {m.nom}</div>
                    <div className="text-xs text-gray-400">{m.telephone}</div>
                  </div>
                  <a href={`tel:${m.telephone}`} className="text-xs font-semibold text-[#7B2D8B] hover:underline">Appeler</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
