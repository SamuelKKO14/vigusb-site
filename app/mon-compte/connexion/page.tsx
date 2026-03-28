'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ConnexionPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function sendCode() {
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide.')
      return
    }
    setLoading(true)
    setError('')
    // Simulate network delay for demo
    setTimeout(() => {
      setStep(2)
      setLoading(false)
    }, 800)
  }

  function verifyCode() {
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }
    setLoading(true)
    setError('')
    // Demo: any 6-digit code works
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vigusb_client_email', email.toLowerCase().trim())
      }
      window.location.href = '/mon-compte'
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-12 pb-16">

      {/* Logo centré */}
      <Link href="/" className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.vigusb.fr/img/vigus-b-logo-1610465866.jpg"
          alt="Vigus'B"
          className="h-12 w-auto object-contain"
        />
      </Link>

      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black" style={{ color: '#7B2D8B' }}>Mon Compte</h1>
        <p className="text-gray-400 text-sm mt-1 font-medium tracking-wide uppercase">Connexion</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

        {step === 1 ? (
          <>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Entrez votre email pour recevoir votre code de connexion
            </p>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="jean@exemple.fr"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none transition-all"
                onFocus={e => (e.target.style.borderColor = '#7B2D8B')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                onKeyDown={e => { if (e.key === 'Enter') sendCode() }}
              />
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <button
              onClick={sendCode}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#7B2D8B' }}
            >
              {loading
                ? <><span className="inline-block animate-spin">⟳</span> Envoi en cours…</>
                : 'Recevoir mon code'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Code valable 10 minutes
            </p>
          </>
        ) : (
          <>
            {/* Confirmation d'envoi */}
            <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background: '#F0FAE6', border: '1px solid #8DC63F33' }}>
              <span className="text-xl mt-0.5">✅</span>
              <div>
                <p className="text-sm font-bold" style={{ color: '#4a7c1f' }}>Code envoyé !</p>
                <p className="text-xs mt-0.5" style={{ color: '#4a7c1f' }}>
                  Votre code vous a été envoyé par SMS et email à{' '}
                  <strong>{email}</strong>
                </p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Code à 6 chiffres</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="— — — — — —"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 text-3xl font-black tracking-[0.6em] text-center outline-none transition-all"
                onFocus={e => (e.target.style.borderColor = '#7B2D8B')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                onKeyDown={e => { if (e.key === 'Enter') verifyCode() }}
              />
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <button
              onClick={verifyCode}
              disabled={loading || code.length !== 6}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#7B2D8B' }}
            >
              {loading
                ? <><span className="inline-block animate-spin">⟳</span> Vérification…</>
                : 'Continuer →'}
            </button>

            <button
              onClick={() => { setStep(1); setCode(''); setError('') }}
              className="w-full mt-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Changer d&apos;adresse email
            </button>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Pas encore client ?{' '}
        <Link href="/simulation" className="font-semibold" style={{ color: '#7B2D8B' }}>
          Prendre rendez-vous →
        </Link>
      </p>
    </div>
  )
}
