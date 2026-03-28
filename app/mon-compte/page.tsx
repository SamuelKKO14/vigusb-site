'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/client'

const STATUS_CONFIG: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  en_attente: { label: 'En attente', icon: '⏳', bg: '#FFF3E0', color: '#E65100' },
  en_cours:   { label: 'En cours',   icon: '🔧', bg: '#E3F2FD', color: '#1565C0' },
  termine:    { label: 'Terminé',    icon: '✅', bg: '#E8F5E9', color: '#2E7D32' },
  annule:     { label: 'Annulé',     icon: '❌', bg: '#FFEBEE', color: '#C62828' },
}

interface Reservation {
  id: string
  ticket_id: string
  marque: string
  modele: string
  pannes: string[]
  statut: string
  prix_total: number | null
  created_at: string
  magasin_id: number | null
}

export default function MonComptePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedEmail = localStorage.getItem('vigusb_client_email')
    const storedPrenom = localStorage.getItem('vigusb_client_prenom') || ''
    if (!storedEmail) {
      router.replace('/mon-compte/connexion')
      return
    }
    setEmail(storedEmail)
    setPrenom(storedPrenom)
    fetchReservations(storedEmail)
  }, [router])

  async function fetchReservations(clientEmail: string) {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('reservations')
        .select('id, ticket_id, marque, modele, pannes, statut, prix_total, created_at, magasin_id')
        .eq('email', clientEmail)
        .order('created_at', { ascending: false })
      if (data) setReservations(data)
    } catch {
      // Demo mode — show empty state
    }
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('vigusb_client_email')
    localStorage.removeItem('vigusb_client_prenom')
    router.push('/mon-compte/connexion')
  }

  const displayName = prenom || email.split('@')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header user */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#7B2D8B' }}>
              Bonjour, {displayName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{email}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Réservations */}
        <h2 className="font-black text-lg mb-4" style={{ color: '#1A1A1A' }}>Mes réservations</h2>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-3xl mb-3 animate-spin inline-block">⟳</div>
            <p className="text-sm">Chargement…</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-bold text-gray-700 mb-2">Aucune réservation</h3>
            <p className="text-sm text-gray-500 mb-6">Vous n&apos;avez pas encore effectué de réservation.</p>
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: '#7B2D8B' }}
            >
              🔧 Prendre rendez-vous
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reservations.map(r => {
              const status = STATUS_CONFIG[r.statut] ?? STATUS_CONFIG['en_attente']
              const date = new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              return (
                <Link
                  key={r.id}
                  href={`/reservation/${r.ticket_id.replace('#', '')}`}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-base" style={{ color: '#7B2D8B' }}>{r.ticket_id}</span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{r.marque} {r.modele}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {r.prix_total != null && r.prix_total > 0 && (
                        <p className="font-black text-lg" style={{ color: '#7B2D8B' }}>{r.prix_total}€</p>
                      )}
                      <span className="text-gray-300 group-hover:text-[#7B2D8B] transition-colors text-sm">→</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/simulation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 hover:text-white hover:bg-[#7B2D8B] text-sm"
            style={{ borderColor: '#7B2D8B', color: '#7B2D8B' }}
          >
            + Nouvelle réservation
          </Link>
        </div>
      </div>
    </div>
  )
}
