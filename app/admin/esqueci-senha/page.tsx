'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message)
        setEmail('')
      } else {
        setError(data.error || 'Ocorreu um erro ao processar sua solicitação.')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-black tracking-tight mb-2">
            AUTO<span className="text-yellow-500">REPÓRTER</span>
          </h1>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Recuperação de Senha
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-6 border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="recovery-email" className="form-label">Email cadastrado</label>
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder="seu@email.com.br"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-base"
          >
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/admin/login"
              className="text-sm text-gray-500 hover:text-black font-medium transition-colors"
            >
              ← Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
