'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-lg">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-black text-red-800 uppercase tracking-tight mb-2">Ops! Algo deu errado no painel</h2>
        <p className="text-sm text-red-600 mb-6">
          {error.message || 'Ocorreu um erro inesperado ao carregar esta página do painel administrativo.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary"
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => window.location.href = '/admin'}
            className="btn-secondary"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
      <p className="mt-8 text-xs text-gray-400">
        Se o erro persistir, verifique a conexão com o banco de dados ou os logs do servidor.
      </p>
    </div>
  )
}
