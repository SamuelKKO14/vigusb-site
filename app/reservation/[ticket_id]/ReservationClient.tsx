'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MAGASINS, PANNES } from '@/lib/data'

// ────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────
const BONUS_QUALIREPAR = 25
const ELIGIBLE_PANNES = ['ecran', 'batterie', 'connecteur', 'camera', 'vitre_arriere']

const STATUS_CONFIG = {
  en_attente: { label: "Un technicien va bientôt vous appeler", icon: "⏳", bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  en_cours:   { label: "En cours de réparation",                icon: "🔧", bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  termine:    { label: "Réparation terminée",                   icon: "✅", bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  annule:     { label: "Annulée",                               icon: "❌", bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}

const COLORIS = ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Rose', 'Or', 'Argent', 'Violet', 'Autre']

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
interface Reservation {
  id: string
  ticket_id: string
  marque: string
  modele: string
  pannes: string[]
  magasin_id: number
  statut: keyof typeof STATUS_CONFIG
  bonus_qualirepar: number
  prix_total: number
  file_attente: number
  numero_serie: string
  coloris: string
  prenom: string
  nom: string
  created_at: string
}

interface Message {
  id: string
  expediteur: 'client' | 'technicien'
  message: string
  created_at: string
}

// Mock data for demo (Supabase not configured)
const makeMock = (ticketId: string): Reservation => ({
  id: '1',
  ticket_id: '#' + ticketId.toUpperCase(),
  marque: 'Apple',
  modele: 'iPhone 15',
  pannes: ['ecran', 'batterie'],
  magasin_id: 1,
  statut: 'en_attente',
  bonus_qualirepar: BONUS_QUALIREPAR,
  prix_total: 279,
  file_attente: 3,
  numero_serie: '',
  coloris: 'Noir',
  prenom: 'Jean',
  nom: 'Dupont',
  created_at: new Date().toISOString(),
})

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────
function MinimalHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://www.vigusb.fr/img/vigus-b-logo-1610465866.jpg" alt="Vigus'B" className="h-8 w-auto object-contain" />
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm">
          <Link href="/simulation" className="text-gray-500 hover:text-[#7B2D8B] transition-colors">Simulation</Link>
          <Link href="/simulation" className="text-gray-500 hover:text-[#7B2D8B] transition-colors">Réservation</Link>
          <Link href="/mon-compte" className="text-gray-500 hover:text-[#7B2D8B] transition-colors">Mon Compte</Link>
        </nav>
      </div>
    </header>
  )
}

function DispoModal({ reservationId, onClose }: { reservationId: string; onClose: () => void }) {
  const [date, setDate] = useState('')
  const [debut, setDebut] = useState('09:00')
  const [fin, setFin] = useState('18:00')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase.from('reservation_disponibilites').insert({
        reservation_id: reservationId,
        date_disponible: date,
        heure_debut: debut,
        heure_fin: fin,
      })
    } catch { /* demo */ }
    setSaved(true)
    setSaving(false)
    setTimeout(onClose, 1000)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">✕</button>
        <h3 className="font-black text-lg mb-5" style={{ color: '#7B2D8B' }}>🗓️ Ajouter une disponibilité</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
              onFocus={e => e.target.style.borderColor = '#7B2D8B'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
              <input type="time" value={debut} onChange={e => setDebut(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                onFocus={e => e.target.style.borderColor = '#7B2D8B'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">À</label>
              <input type="time" value={fin} onChange={e => setFin(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                onFocus={e => e.target.style.borderColor = '#7B2D8B'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
            </div>
          </div>
        </div>
        <button
          onClick={save}
          disabled={!date || saving || saved}
          className="w-full mt-5 py-3 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: saved ? '#8DC63F' : '#7B2D8B' }}
        >
          {saved ? '✅ Enregistré !' : saving ? '…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────
export default function ReservationClient({ ticketId }: { ticketId: string }) {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [deviceOpen, setDeviceOpen] = useState(false)
  const [dispoOpen, setDispoOpen] = useState(false)
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [numSerie, setNumSerie] = useState('')
  const [coloris, setColoris] = useState('')
  const [savingDevice, setSavingDevice] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // ── Fetch reservation ────────────────────────────────────────────────────
  const fetchReservation = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('ticket_id', '#' + ticketId.toUpperCase())
        .single()
      if (data) {
        setReservation(data)
        setNumSerie(data.numero_serie || '')
        setColoris(data.coloris || '')
      } else {
        setReservation(makeMock(ticketId))
      }
    } catch {
      setReservation(makeMock(ticketId))
    }
    setLoading(false)
  }, [ticketId])

  // ── Fetch messages ───────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (resId: string) => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('reservation_messages')
        .select('*')
        .eq('reservation_id', resId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    } catch { /* demo */ }
  }, [])

  useEffect(() => { fetchReservation() }, [fetchReservation])

  // ── Poll messages every 5s when chat open ────────────────────────────────
  useEffect(() => {
    if (!chatOpen || !reservation) return
    fetchMessages(reservation.id)
    const interval = setInterval(() => fetchMessages(reservation.id), 5000)
    return () => clearInterval(interval)
  }, [chatOpen, reservation, fetchMessages])

  // ── Auto-scroll chat ─────────────────────────────────────────────────────
  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatOpen])

  // ── Send message ─────────────────────────────────────────────────────────
  async function sendMessage() {
    if (!newMsg.trim() || !reservation) return
    setSending(true)
    const optimistic: Message = {
      id: Date.now().toString(),
      expediteur: 'client',
      message: newMsg.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(m => [...m, optimistic])
    setNewMsg('')
    try {
      const supabase = createClient()
      await supabase.from('reservation_messages').insert({
        reservation_id: reservation.id,
        expediteur: 'client',
        message: optimistic.message,
      })
    } catch { /* demo */ }
    setSending(false)
  }

  // ── Save device info ─────────────────────────────────────────────────────
  async function saveDevice() {
    if (!reservation) return
    setSavingDevice(true)
    try {
      const supabase = createClient()
      await supabase.from('reservations').update({ numero_serie: numSerie, coloris }).eq('id', reservation.id)
    } catch { /* demo */ }
    setSavingDevice(false)
  }

  // ────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <MinimalHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-spin">⟳</div>
            <div className="font-semibold" style={{ color: '#7B2D8B' }}>Chargement…</div>
          </div>
        </div>
      </div>
    )
  }

  if (!reservation) return null

  const magasin = MAGASINS.find(m => m.id === reservation.magasin_id)
  const pannesData = PANNES.filter(p => reservation.pannes.includes(p.id))
  const statusCfg = STATUS_CONFIG[reservation.statut] ?? STATUS_CONFIG.en_attente
  const bonusApplique = reservation.bonus_qualirepar > 0
    ? reservation.bonus_qualirepar
    : reservation.pannes.some(p => ELIGIBLE_PANNES.includes(p)) ? BONUS_QUALIREPAR : 0
  const prixBrut = reservation.prix_total + bonusApplique
  const prix4x = Math.ceil(reservation.prix_total / 4)

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <MinimalHeader />
      {dispoOpen && <DispoModal reservationId={reservation.id} onClose={() => setDispoOpen(false)} />}

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── Ticket title ── */}
        <div>
          <div className="text-sm text-gray-400 mb-1 font-medium">Réservation</div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-black" style={{ color: '#7B2D8B' }}>
              {reservation.ticket_id}
            </h1>
            {reservation.file_attente > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#7B2D8B]/10 text-[#7B2D8B]">
                File d&apos;attente {reservation.file_attente}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {reservation.marque} {reservation.modele}
          </div>
          {magasin && <div className="text-sm text-gray-500 mt-0.5">📍 {magasin.nom}</div>}
        </div>

        {/* ── Status badge ── */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{ background: statusCfg.bg, borderColor: statusCfg.border }}
        >
          <span className="text-3xl">{statusCfg.icon}</span>
          <span className="font-bold text-base" style={{ color: statusCfg.color }}>
            {statusCfg.label}
          </span>
        </div>

        {/* ── Price breakdown card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-black text-base mb-4" style={{ color: '#7B2D8B' }}>Détail de la réparation</h2>

          <div className="space-y-2.5 mb-4">
            {pannesData.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  <span className="mr-2">{p.emoji}</span>
                  1× {p.label}
                </span>
                <span className="font-semibold text-gray-800">{p.prixBase}€</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2">
            {bonusApplique > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium" style={{ color: '#8DC63F' }}>
                  🎁 Bonus QualiRepar (aide de l&apos;État)
                </span>
                <span className="font-bold" style={{ color: '#8DC63F' }}>−{bonusApplique}€</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 line-through">{prixBrut}€</span>
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: '#7B2D8B' }}>
                  {reservation.prix_total}€
                </div>
                <div className="text-xs text-gray-400">soit {prix4x}€ en 4×CB</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 action buttons ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: '🗓️', label: 'Disponibilité',
              action: () => setDispoOpen(true),
              style: { background: '#7B2D8B', color: 'white' },
            },
            {
              icon: '🗺️', label: 'Itinéraire GPS',
              href: magasin?.maps,
              style: { background: '#1A1A1A', color: 'white' },
            },
            {
              icon: '💬', label: 'Discuter',
              action: () => { setChatOpen(v => !v); setDeviceOpen(false) },
              style: chatOpen
                ? { background: '#7B2D8B', color: 'white' }
                : { background: 'white', color: '#7B2D8B', border: '2px solid #7B2D8B' },
            },
            {
              icon: '📲', label: 'Appeler',
              href: magasin ? `tel:${magasin.telephone}` : undefined,
              style: { background: '#8DC63F', color: 'white' },
            },
          ].map(btn => {
            const cls = "flex flex-col items-center gap-2 py-5 px-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
            const inner = <><span className="text-2xl">{btn.icon}</span><span>{btn.label}</span></>
            if (btn.href) return (
              <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer" className={cls} style={btn.style}>{inner}</a>
            )
            return (
              <button key={btn.label} onClick={btn.action} className={cls} style={btn.style}>{inner}</button>
            )
          })}
        </div>

        {/* ── Chat section (accordion) ── */}
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span className="font-bold text-sm text-gray-800">Discussion avec le technicien</span>
              <span className="ml-auto text-xs text-gray-400">Actualisation auto · 5s</span>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-[#F8F8F8]">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-8">
                  Aucun message pour l&apos;instant.<br />
                  Posez votre question, le technicien vous répondra rapidement.
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.expediteur === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={msg.expediteur === 'client'
                      ? { background: '#7B2D8B', color: 'white', borderBottomRightRadius: 4 }
                      : { background: 'white', color: '#1A1A1A', borderBottomLeftRadius: 4, border: '1px solid #E5E7EB' }}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Votre message…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"
                onFocus={e => e.target.style.borderColor = '#7B2D8B'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                onClick={sendMessage}
                disabled={!newMsg.trim() || sending}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                style={{ background: '#7B2D8B' }}
              >
                {sending ? '…' : '→'}
              </button>
            </div>
          </div>
        )}

        {/* ── Device details (accordion) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => { setDeviceOpen(v => !v); setChatOpen(false) }}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span className="font-bold text-sm text-gray-800">Détails de l&apos;appareil</span>
            </div>
            <span className="text-gray-400 text-sm">{deviceOpen ? '▲' : '▼'}</span>
          </button>

          {deviceOpen && (
            <div className="px-5 pb-5 border-t border-gray-100 space-y-4">
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">Numéro de série (IMEI)</label>
                  <a href="tel:*%2306%23" className="text-xs underline" style={{ color: '#7B2D8B' }}>
                    Composez *#06#
                  </a>
                </div>
                <input
                  type="text"
                  value={numSerie}
                  onChange={e => setNumSerie(e.target.value)}
                  placeholder="Ex : 352099001761481"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none font-mono"
                  onFocus={e => e.target.style.borderColor = '#7B2D8B'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coloris</label>
                <div className="flex flex-wrap gap-2">
                  {COLORIS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColoris(c)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={coloris === c
                        ? { background: '#7B2D8B', color: 'white', borderColor: '#7B2D8B' }
                        : { background: 'white', color: '#6B7280', borderColor: '#E5E7EB' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveDevice}
                disabled={savingDevice}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                style={{ background: '#7B2D8B' }}
              >
                {savingDevice ? 'Enregistrement…' : '💾 Mettre à jour'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
