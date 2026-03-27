'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { MARQUES, MODELES, PANNES, MAGASINS, generateTicketId } from '@/lib/data'
import { createClient } from '@/lib/supabase/client'

type Step = 1 | 2 | 3 | 4 | 5 | 6

interface FormData {
  marque: string
  modele: string
  pannes: string[]
  magasinId: number | null
  prenom: string
  nom: string
  telephone: string
  email: string
  ticketId: string
}

function ProgressBar({ step }: { step: Step }) {
  const steps = ['Marque', 'Modèle', 'Panne', 'Magasin', 'Coordonnées', 'Confirmation']
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? 'bg-[#8DC63F] text-white' : i + 1 === step ? 'bg-[#7B2D8B] text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">{s}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full">
        <div className="h-full rounded-full transition-all duration-500" style={{ background: '#7B2D8B', width: `${((step - 1) / 5) * 100}%` }} />
      </div>
    </div>
  )
}

export default function SimulationPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    marque: '', modele: '', pannes: [], magasinId: null,
    prenom: '', nom: '', telephone: '', email: '', ticketId: '',
  })
  const [loading, setLoading] = useState(false)

  const magasinSelectionne = MAGASINS.find(m => m.id === form.magasinId)
  const pannesSelectionnees = PANNES.filter(p => form.pannes.includes(p.id))
  const prixTotal = pannesSelectionnees.reduce((sum, p) => sum + p.prixBase, 0)

  async function confirmerReservation() {
    setLoading(true)
    const ticketId = generateTicketId()
    try {
      const supabase = createClient()
      await supabase.from('reservations').insert({
        ticket_id: ticketId,
        prenom: form.prenom,
        nom: form.nom,
        telephone: form.telephone,
        email: form.email,
        magasin_id: form.magasinId,
        marque: form.marque,
        modele: form.modele,
        pannes: form.pannes,
        statut: 'en_attente',
      })
    } catch (e) {
      // Continue même si Supabase n'est pas configuré (démo)
    }
    setForm(f => ({ ...f, ticketId }))
    setStep(6)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        {step < 6 && <ProgressBar step={step} />}

        {/* Step 1: Marque */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Quelle est la marque de votre téléphone ?</h1>
            <p className="text-gray-500 mb-6 text-sm">Sélectionnez votre marque pour continuer</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MARQUES.map(m => (
                <button key={m.id} onClick={() => { setForm(f => ({ ...f, marque: m.nom, modele: '' })); setStep(2) }}
                  className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-[#7B2D8B] hover:shadow-md transition-all text-left group active:scale-95">
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <div className="font-semibold text-sm text-gray-700 group-hover:text-[#7B2D8B]">{m.nom}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Modèle */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">← Changer de marque</button>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Quel modèle avez-vous ?</h1>
            <p className="text-gray-500 mb-6 text-sm">Marque sélectionnée : <strong className="text-[#7B2D8B]">{form.marque}</strong></p>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
              {(MODELES[MARQUES.find(m => m.nom === form.marque)?.id || ''] || ['Modèle récent', 'Modèle intermédiaire', 'Ancien modèle']).map(modele => (
                <button key={modele} onClick={() => { setForm(f => ({ ...f, modele })); setStep(3) }}
                  className="bg-white rounded-xl px-5 py-4 border-2 border-gray-100 hover:border-[#7B2D8B] text-left font-medium text-gray-700 hover:text-[#7B2D8B] transition-all active:scale-95 flex items-center justify-between group">
                  {modele}
                  <span className="text-gray-300 group-hover:text-[#7B2D8B]">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Pannes */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">← Changer de modèle</button>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Quel(s) problème(s) rencontrez-vous ?</h1>
            <p className="text-gray-500 mb-6 text-sm">Vous pouvez sélectionner plusieurs pannes</p>
            <div className="flex flex-col gap-3 mb-6">
              {PANNES.map(panne => {
                const selected = form.pannes.includes(panne.id)
                return (
                  <button key={panne.id}
                    onClick={() => setForm(f => ({ ...f, pannes: selected ? f.pannes.filter(p => p !== panne.id) : [...f.pannes, panne.id] }))}
                    className={`bg-white rounded-xl px-5 py-4 border-2 text-left transition-all active:scale-95 flex items-center justify-between ${selected ? 'border-[#7B2D8B] bg-[#7B2D8B]/5' : 'border-gray-100 hover:border-[#7B2D8B]/40'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{panne.emoji}</span>
                      <div>
                        <div className={`font-semibold text-sm ${selected ? 'text-[#7B2D8B]' : 'text-gray-700'}`}>{panne.label}</div>
                        {panne.prixBase > 0 && <div className="text-xs text-gray-400">À partir de {panne.prixBase}€</div>}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-[#7B2D8B] border-[#7B2D8B] text-white' : 'border-gray-300'}`}>
                      {selected && '✓'}
                    </div>
                  </button>
                )
              })}
            </div>
            {form.pannes.length > 0 && (
              <div className="bg-[#7B2D8B]/5 rounded-xl p-4 mb-4 border border-[#7B2D8B]/20">
                <div className="flex justify-between text-sm font-semibold text-[#7B2D8B]">
                  <span>{form.pannes.length} panne{form.pannes.length > 1 ? 's' : ''} sélectionnée{form.pannes.length > 1 ? 's' : ''}</span>
                  {prixTotal > 0 && <span>À partir de {prixTotal}€</span>}
                </div>
              </div>
            )}
            <button onClick={() => setStep(4)} disabled={form.pannes.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#7B2D8B' }}>
              Continuer →
            </button>
          </div>
        )}

        {/* Step 4: Magasin */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">← Modifier les pannes</button>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Choisissez votre magasin</h1>
            <p className="text-gray-500 mb-6 text-sm">Sélectionnez le magasin Vigus&apos;B le plus proche</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MAGASINS.map(m => (
                <button key={m.id} onClick={() => { setForm(f => ({ ...f, magasinId: m.id })); setStep(5) }}
                  className={`bg-white rounded-2xl p-5 border-2 text-left transition-all active:scale-95 hover:shadow-md ${form.magasinId === m.id ? 'border-[#7B2D8B]' : 'border-gray-100 hover:border-[#7B2D8B]/40'}`}>
                  <div className="font-bold text-[#1A1A1A] mb-1">📍 {m.nom}</div>
                  <div className="text-xs text-gray-500">{m.adresse}</div>
                  <div className="text-xs text-gray-400 mt-1">🕐 {m.horaires}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Coordonnées */}
        {step === 5 && (
          <div>
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">← Changer de magasin</button>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Vos coordonnées</h1>
            <p className="text-gray-500 mb-6 text-sm">Pour finaliser votre réservation</p>

            {/* Récapitulatif */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
              <h3 className="font-bold text-sm text-[#7B2D8B] mb-3">Récapitulatif</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Appareil</span><span className="font-medium">{form.marque} {form.modele}</span></div>
                <div className="flex justify-between"><span>Pannes</span><span className="font-medium text-right">{pannesSelectionnees.map(p => p.label).join(', ')}</span></div>
                <div className="flex justify-between"><span>Magasin</span><span className="font-medium">{magasinSelectionne?.nom}</span></div>
                {prixTotal > 0 && <div className="flex justify-between pt-2 border-t border-gray-100"><span className="font-bold">Estimation</span><span className="font-bold text-[#7B2D8B]">À partir de {prixTotal}€</span></div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { key: 'prenom', label: 'Prénom *', type: 'text', placeholder: 'Jean' },
                { key: 'nom', label: 'Nom *', type: 'text', placeholder: 'Dupont' },
                { key: 'telephone', label: 'Téléphone *', type: 'tel', placeholder: '06 12 34 56 78' },
                { key: 'email', label: 'Email *', type: 'email', placeholder: 'jean@exemple.fr' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof FormData] as string}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B2D8B] text-sm transition-all"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={confirmerReservation}
              disabled={!form.prenom || !form.nom || !form.telephone || !form.email || loading}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#7B2D8B' }}
            >
              {loading ? <><span className="animate-spin">⟳</span> Confirmation...</> : '✅ Confirmer ma réservation'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">En confirmant, vous acceptez que Vigus&apos;B vous contacte pour votre réparation.</p>
          </div>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#8DC63F]/10 flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
            <h1 className="text-3xl font-black text-[#1A1A1A] mb-2">Réservation confirmée !</h1>
            <div className="inline-block bg-[#7B2D8B] text-white text-2xl font-black px-6 py-3 rounded-2xl mb-6 tracking-wider">
              {form.ticketId}
            </div>
            <p className="text-gray-500 mb-8">Présentez ce numéro en magasin. Nous vous contacterons sous peu pour confirmer le rendez-vous.</p>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left mb-6">
              <h3 className="font-bold text-[#7B2D8B] mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Client</span><span className="font-medium">{form.prenom} {form.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Téléphone</span><span className="font-medium">{form.telephone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Appareil</span><span className="font-medium">{form.marque} {form.modele}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pannes</span><span className="font-medium text-right">{pannesSelectionnees.map(p => p.label).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Magasin</span><span className="font-medium">{magasinSelectionne?.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Délai estimé</span><span className="font-medium text-[#8DC63F]">⚡ 30 à 90 minutes</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {magasinSelectionne && (
                <a href={magasinSelectionne.maps} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-semibold border-2 border-[#7B2D8B] text-[#7B2D8B] hover:bg-[#7B2D8B] hover:text-white transition-all flex items-center justify-center gap-2">
                  🗺️ Itinéraire GPS
                </a>
              )}
              {magasinSelectionne && (
                <a href={`tel:${magasinSelectionne.telephone}`}
                  className="w-full py-3 rounded-xl font-semibold bg-[#8DC63F] text-white hover:bg-[#6fa32e] transition-all flex items-center justify-center gap-2">
                  📞 Nous appeler
                </a>
              )}
              <Link href="/" className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
