'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Letra minúscula', valid: /[a-z]/.test(password) },
    { label: 'Número', valid: /[0-9]/.test(password) },
  ]

  const passedCount = checks.filter(c => c.valid).length
  const strengthPercent = (passedCount / checks.length) * 100

  if (!password) return null

  return (
    <div className="mt-3 space-y-2">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${strengthPercent}%`,
            backgroundColor:
              strengthPercent <= 25 ? '#ef4444' :
              strengthPercent <= 50 ? '#f97316' :
              strengthPercent <= 75 ? '#eab308' : '#22c55e',
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: check.valid ? '#22c55e' : '#9ca3af' }}
          >
            <span>{check.valid ? '✓' : '○'}</span>
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos mínimos de segurança.')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Token de recuperação inválido ou ausente.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Senha alterada com sucesso! Redirecionando para login...')
        setTimeout(() => {
          router.push('/admin/login')
        }, 2500)
      } else {
        setError(data.error || 'Ocorreu um erro ao redefinir sua senha.')
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
            Nova Senha
          </p>
        </div>

        {!token && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100 font-bold">
            Nenhum token de recuperação encontrado. Use o link enviado por e-mail.
          </div>
        )}

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
            <label htmlFor="new-password" className="form-label">Nova senha</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="••••••••"
              minLength={8}
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <div>
            <label htmlFor="confirm-password" className="form-label">Confirme a nova senha</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              placeholder="••••••••"
              minLength={8}
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token || !isPasswordValid || password !== confirmPassword}
            className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/admin/login"
              className="text-sm text-gray-500 hover:text-black font-medium transition-colors"
            >
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Carregando...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
