'use client'
import { useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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

// ── Barre de progression mode ──────────────────────────────────────────────
function ModeBar() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className="text-sm font-bold" style={{ color: '#7B2D8B' }}>simulation</span>
      <div className="flex items-center gap-0">
        <div className="w-10 h-0.5" style={{ background: '#7B2D8B' }} />
        <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ background: '#7B2D8B' }} />
        <div className="w-10 h-0.5" style={{ background: '#7B2D8B' }} />
      </div>
      <span className="text-sm font-bold" style={{ color: '#7B2D8B' }}>réservation</span>
    </div>
  )
}

// ── Barre d'étapes ─────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  const steps = ['Marque', 'Modèle', 'Panne', 'Magasin', 'Coordonnées']
  return (
    <div className="w-full mb-8">
      <div className="flex items-center mb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: i + 1 < step ? '#8DC63F' : i + 1 === step ? '#7B2D8B' : '#E5E7EB',
                  color: i + 1 <= step ? 'white' : '#9CA3AF',
                }}
              >
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4 sm:mb-5 rounded transition-all duration-300"
                style={{ background: i + 1 < step ? '#8DC63F' : '#E5E7EB' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Carousel de marques ────────────────────────────────────────────────────
function BrandCarousel({ onSelect }: { onSelect: (marque: string) => void }) {
  const [idx, setIdx] = useState(0)
  const total = MARQUES.length

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx(i => Math.min(total - 1, i + 1)), [total])

  function getCardStyle(offset: number): React.CSSProperties {
    const absOff = Math.abs(offset)
    if (absOff > 2) return { opacity: 0, pointerEvents: 'none', transform: `translateX(${offset > 0 ? 130 : -130}%) scale(0.55)` }
    const translateMap: Record<number, number> = { [-2]: -115, [-1]: -60, 0: 0, 1: 60, 2: 115 }
    const scaleMap: Record<number, number> = { [-2]: 0.6, [-1]: 0.78, 0: 1, 1: 0.78, 2: 0.6 }
    const opacityMap: Record<number, number> = { [-2]: 0.25, [-1]: 0.55, 0: 1, 1: 0.55, 2: 0.25 }
    return {
      transform: `translateX(${translateMap[offset]}%) scale(${scaleMap[offset]})`,
      opacity: opacityMap[offset],
      zIndex: 10 - absOff,
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: absOff > 1 ? 'none' : 'auto',
    }
  }

  const brand = MARQUES[idx]

  return (
    <div>
      {/* Header step */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: '#7B2D8B' }}>
          ✦ GRATUITE EN 3MIN !
        </div>
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#7B2D8B' }}>1</div>
          <h1 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Choisis ta marque</h1>
        </div>
      </div>

      {/* Carousel container */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden select-none mb-6">
        {MARQUES.map((m, i) => {
          const offset = i - idx
          if (Math.abs(offset) > 2) return null
          const isCenter = offset === 0
          const isSide = Math.abs(offset) === 1
          return (
            <div
              key={m.id}
              className="absolute"
              style={getCardStyle(offset)}
              onClick={() => {
                if (isCenter) onSelect(m.nom)
                else if (isSide) setIdx(i)
              }}
            >
              <div
                className="w-36 h-40 bg-white rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer"
                style={{
                  boxShadow: isCenter
                    ? '0 8px 32px rgba(123,45,139,0.18), 0 2px 8px rgba(0,0,0,0.08)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  border: isCenter ? '2px solid #7B2D8B' : '2px solid #F3F4F6',
                  transition: 'border 0.3s, box-shadow 0.3s',
                }}
              >
                <div className="h-12 flex items-center justify-center px-4">
                  {m.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.logoUrl}
                      alt={m.nom}
                      className="max-h-10 max-w-[96px] w-auto object-contain"
                      style={{ filter: 'brightness(0)' }}
                    />
                  ) : (
                    <span className="text-4xl">{m.emoji}</span>
                  )}
                </div>
                {isCenter && (
                  <div
                    className="text-xs font-bold px-3 py-1 rounded"
                    style={{ color: '#7B2D8B', borderBottom: '2px dashed #7B2D8B' }}
                  >
                    {m.nom}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Brand name + label under carousel */}
      <div className="text-center mb-6">
        <div
          className="inline-block text-sm font-bold px-4 py-1.5 rounded"
          style={{ color: '#7B2D8B', border: '2px dashed #7B2D8B' }}
        >
          {brand.nom}
        </div>
        <p className="text-xs text-gray-400 mt-2">← {idx + 1} / {total} →</p>
      </div>

      {/* Arrows */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: '#7B2D8B', color: 'white' }}
          aria-label="Précédent"
        >
          ‹
        </button>

        <button
          onClick={() => onSelect(brand.nom)}
          className="px-8 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: '#7B2D8B' }}
        >
          Sélectionner {brand.nom} →
        </button>

        <button
          onClick={next}
          disabled={idx === total - 1}
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: '#7B2D8B', color: 'white' }}
          aria-label="Suivant"
        >
          ›
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5">
        {MARQUES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 6,
              height: 6,
              background: i === idx ? '#7B2D8B' : '#D1D5DB',
            }}
            aria-label={`Marque ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────
function SimulationContent() {
  const searchParams = useSearchParams()
  const initMarque = searchParams.get('marque') || ''
  const initModele = searchParams.get('modele') || ''
  const initMagasin = Number(searchParams.get('magasin')) || null
  const initialStep: Step = initMarque && initModele ? 3 : 1

  const [step, setStep] = useState<Step>(initialStep)
  const [form, setForm] = useState<FormData>({
    marque: initMarque, modele: initModele, pannes: [], magasinId: initMagasin,
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
    } catch {
      // Continue même si Supabase n'est pas configuré (démo)
    }
    setForm(f => ({ ...f, ticketId }))
    setStep(6)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Bannière de confirmation (step 6) */}
      {step === 6 && form.ticketId && (
        <div className="text-center py-3 text-sm font-bold" style={{ background: '#7B2D8B15', color: '#7B2D8B' }}>
          ⭐ Réservation {form.ticketId} effectuée ! ⭐
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10">
        <ModeBar />
        {step < 6 && <ProgressBar step={step} />}

        {/* ── Step 1 : Carousel marques ── */}
        {step === 1 && (
          <BrandCarousel
            onSelect={(marque) => {
              setForm(f => ({ ...f, marque, modele: '' }))
              setStep(2)
            }}
          />
        )}

        {/* ── Step 2 : Modèle ── */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">
              ← Changer de marque
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#7B2D8B' }}>2</div>
              <h1 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Quel modèle avez-vous ?</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm ml-10">
              Marque sélectionnée : <strong style={{ color: '#7B2D8B' }}>{form.marque}</strong>
            </p>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
              {(MODELES[MARQUES.find(m => m.nom === form.marque)?.id || ''] || ['Modèle récent', 'Modèle intermédiaire', 'Ancien modèle']).map(modele => (
                <button
                  key={modele}
                  onClick={() => { setForm(f => ({ ...f, modele })); setStep(3) }}
                  className="bg-white rounded-xl px-5 py-4 border-2 border-gray-100 hover:border-[#7B2D8B] text-left font-medium text-gray-700 hover:text-[#7B2D8B] transition-all active:scale-95 flex items-center justify-between group"
                >
                  {modele}
                  <span className="text-gray-300 group-hover:text-[#7B2D8B]">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3 : Pannes ── */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">
              ← Changer de modèle
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#7B2D8B' }}>3</div>
              <h1 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Quel(s) problème(s) rencontrez-vous ?</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm ml-10">Vous pouvez sélectionner plusieurs pannes</p>
            <div className="flex flex-col gap-3 mb-6">
              {PANNES.map(panne => {
                const selected = form.pannes.includes(panne.id)
                return (
                  <button
                    key={panne.id}
                    onClick={() => setForm(f => ({
                      ...f,
                      pannes: selected ? f.pannes.filter(p => p !== panne.id) : [...f.pannes, panne.id],
                    }))}
                    className="bg-white rounded-xl px-5 py-4 border-2 text-left transition-all active:scale-95 flex items-center justify-between"
                    style={{ borderColor: selected ? '#7B2D8B' : '#F3F4F6', background: selected ? '#7B2D8B0D' : 'white' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{panne.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: selected ? '#7B2D8B' : '#374151' }}>{panne.label}</div>
                        {panne.prixBase > 0 && <div className="text-xs text-gray-400">À partir de {panne.prixBase}€</div>}
                      </div>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background: selected ? '#7B2D8B' : 'transparent',
                        borderColor: selected ? '#7B2D8B' : '#D1D5DB',
                        color: 'white',
                      }}
                    >
                      {selected && '✓'}
                    </div>
                  </button>
                )
              })}
            </div>
            {form.pannes.length > 0 && (
              <div className="rounded-xl p-4 mb-4 border" style={{ background: '#7B2D8B0D', borderColor: '#7B2D8B33' }}>
                <div className="flex justify-between text-sm font-semibold" style={{ color: '#7B2D8B' }}>
                  <span>{form.pannes.length} panne{form.pannes.length > 1 ? 's' : ''} sélectionnée{form.pannes.length > 1 ? 's' : ''}</span>
                  {prixTotal > 0 && <span>À partir de {prixTotal}€</span>}
                </div>
              </div>
            )}
            <button
              onClick={() => setStep(4)}
              disabled={form.pannes.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#7B2D8B' }}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* ── Step 4 : Magasin ── */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">
              ← Modifier les pannes
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#7B2D8B' }}>4</div>
              <h1 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Choisissez votre magasin</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm ml-10">Sélectionnez le magasin Vigus&apos;B le plus proche</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MAGASINS.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setForm(f => ({ ...f, magasinId: m.id })); setStep(5) }}
                  className="bg-white rounded-2xl p-5 border-2 text-left transition-all active:scale-95 hover:shadow-md"
                  style={{ borderColor: form.magasinId === m.id ? '#7B2D8B' : '#F3F4F6' }}
                >
                  <div className="font-bold text-[#1A1A1A] mb-1">📍 {m.nom}</div>
                  <div className="text-xs text-gray-500">{m.adresse}</div>
                  <div className="text-xs text-gray-400 mt-1">🕐 {m.horaires}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5 : Coordonnées ── */}
        {step === 5 && (
          <div>
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-6 transition-colors">
              ← Changer de magasin
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: '#7B2D8B' }}>5</div>
              <h1 className="text-xl font-black" style={{ color: '#7B2D8B' }}>Vos coordonnées</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm ml-10">Pour finaliser votre réservation</p>

            {/* Récapitulatif */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
              <h3 className="font-bold text-sm mb-3" style={{ color: '#7B2D8B' }}>Récapitulatif</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Appareil</span><span className="font-medium">{form.marque} {form.modele}</span></div>
                <div className="flex justify-between"><span>Pannes</span><span className="font-medium text-right max-w-[60%]">{pannesSelectionnees.map(p => p.label).join(', ')}</span></div>
                <div className="flex justify-between"><span>Magasin</span><span className="font-medium">{magasinSelectionne?.nom}</span></div>
                {prixTotal > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold">Estimation</span>
                    <span className="font-bold" style={{ color: '#7B2D8B' }}>À partir de {prixTotal}€</span>
                  </div>
                )}
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm transition-all outline-none"
                    style={{ '--tw-ring-color': '#7B2D8B' } as React.CSSProperties}
                    onFocus={e => (e.target.style.borderColor = '#7B2D8B')}
                    onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
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
            <p className="text-xs text-gray-400 text-center mt-3">
              En confirmant, vous acceptez que Vigus&apos;B vous contacte pour votre réparation.
            </p>
          </div>
        )}

        {/* ── Step 6 : Confirmation ── */}
        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: '#8DC63F1A' }}>
              🎉
            </div>
            <h1 className="text-3xl font-black text-[#1A1A1A] mb-2">Réservation confirmée !</h1>
            <div className="inline-block text-white text-2xl font-black px-6 py-3 rounded-2xl mb-6 tracking-wider" style={{ background: '#7B2D8B' }}>
              {form.ticketId}
            </div>
            <p className="text-gray-500 mb-8">
              Présentez ce numéro en magasin. Nous vous contacterons sous peu pour confirmer le rendez-vous.
            </p>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left mb-6">
              <h3 className="font-bold mb-4" style={{ color: '#7B2D8B' }}>Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Client</span><span className="font-medium">{form.prenom} {form.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Téléphone</span><span className="font-medium">{form.telephone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Appareil</span><span className="font-medium">{form.marque} {form.modele}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pannes</span><span className="font-medium text-right max-w-[60%]">{pannesSelectionnees.map(p => p.label).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Magasin</span><span className="font-medium">{magasinSelectionne?.nom}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Délai estimé</span><span className="font-medium" style={{ color: '#8DC63F' }}>⚡ 30 à 90 minutes</span></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {magasinSelectionne && (
                <a
                  href={magasinSelectionne.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 hover:text-white"
                  style={{ borderColor: '#7B2D8B', color: '#7B2D8B' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#7B2D8B'; (e.currentTarget as HTMLElement).style.color = 'white' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#7B2D8B' }}
                >
                  🗺️ Itinéraire GPS
                </a>
              )}
              {magasinSelectionne && (
                <a
                  href={`tel:${magasinSelectionne.telephone}`}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ background: '#8DC63F' }}
                >
                  📞 Nous appeler
                </a>
              )}
              <Link
                href="/"
                className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg font-bold" style={{ color: '#7B2D8B' }}>Chargement…</div>
      </div>
    }>
      <SimulationContent />
    </Suspense>
  )
}
