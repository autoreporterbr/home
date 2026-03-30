'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Email ou senha inválidos.')
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login.')
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
            Acesso Administrativo
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder="seu@email.com.br"
            />
          </div>

          <div>
            <label className="form-label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-base"
          >
            {loading ? 'Carregando...' : 'Entrar no Painel'}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-400">
          Auto Repórter — Portal de Notícias Automotivas
        </p>
      </div>
    </div>
  )
}
