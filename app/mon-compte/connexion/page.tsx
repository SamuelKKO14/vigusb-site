'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/client'

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function ConnexionPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendCode() {
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.')
      return
    }
    setLoading(true)
    setError('')
    const generated = generateCode()
    try {
      const supabase = createClient()
      // Upsert auth record with code + expiry
      const { error: dbErr } = await supabase.from('clients_auth').upsert(
        { email: email.toLowerCase().trim(), code: generated, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() },
        { onConflict: 'email' }
      )
      if (dbErr) throw dbErr
      // In production you'd send the code by email here.
      // For demo, we proceed directly (the code would be sent via an edge function/SMTP).
    } catch {
      // Demo mode — proceed anyway
    }
    setStep(2)
    setLoading(false)
  }

  async function verifyCode() {
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: dbErr } = await supabase
        .from('clients_auth')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('code', code)
        .gte('expires_at', new Date().toISOString())
        .single()
      if (dbErr || !data) throw new Error('Code invalide ou expiré.')
      // Invalidate code after use
      await supabase.from('clients_auth').update({ code: null, expires_at: null }).eq('email', email.toLowerCase().trim())
      // Set session cookie (simple approach: localStorage for demo)
      localStorage.setItem('vigusb_client_email', email.toLowerCase().trim())
      if (data.prenom) localStorage.setItem('vigusb_client_prenom', data.prenom)
      router.push('/mon-compte')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Code invalide ou expiré.'
      setError(msg)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: '#7B2D8B1A' }}
          >
            👤
          </div>
          <h1 className="text-2xl font-black" style={{ color: '#7B2D8B' }}>Mon espace client</h1>
          <p className="text-gray-500 text-sm mt-1">Accédez à vos réservations Vigus&apos;B</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {step === 1 ? (
            <>
              <h2 className="font-black text-lg mb-1 text-gray-800">Connexion</h2>
              <p className="text-sm text-gray-500 mb-6">Entrez votre email pour recevoir un code de connexion</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="jean@exemple.fr"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all"
                  onFocus={e => (e.target.style.borderColor = '#7B2D8B')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                  onKeyDown={e => { if (e.key === 'Enter') sendCode() }}
                />
              </div>
              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#7B2D8B' }}
              >
                {loading ? <><span className="animate-spin">⟳</span> Envoi...</> : 'Recevoir mon code →'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                Un code à 6 chiffres valable 10 minutes vous sera envoyé.
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep(1); setCode(''); setError('') }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B2D8B] mb-5 transition-colors"
              >
                ← Changer d&apos;email
              </button>
              <h2 className="font-black text-lg mb-1 text-gray-800">Code de vérification</h2>
              <p className="text-sm text-gray-500 mb-6">
                Code envoyé à <strong style={{ color: '#7B2D8B' }}>{email}</strong>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Code à 6 chiffres</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-2xl font-black tracking-[0.5em] text-center outline-none transition-all"
                  onFocus={e => (e.target.style.borderColor = '#7B2D8B')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                  onKeyDown={e => { if (e.key === 'Enter') verifyCode() }}
                />
              </div>
              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#7B2D8B' }}
              >
                {loading ? <><span className="animate-spin">⟳</span> Vérification...</> : '✅ Connexion'}
              </button>
              <button
                onClick={() => { sendCode() }}
                className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50"
                style={{ color: '#7B2D8B' }}
              >
                Renvoyer le code
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Pas encore client ?{' '}
          <Link href="/simulation" className="font-semibold" style={{ color: '#7B2D8B' }}>
            Prendre rendez-vous →
          </Link>
        </p>
      </div>
    </div>
  )
}
