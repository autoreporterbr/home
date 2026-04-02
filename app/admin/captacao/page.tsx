'use client'

import { useState, useEffect } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import Link from 'next/link'

export default function AICaptacaoPage() {
  const [loading, setLoading] = useState(false)
  const [articles, setArticles] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const fetchPending = async () => {
    const res = await fetch('/api/articles?status=pending_review')
    const data = await res.json()
    setArticles(data.articles || [])
  }

  useEffect(() => { fetchPending() }, [])

  const handleSync = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/fetch-news', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMessage(`Sucesso! ${data.count} novas matérias captadas e reescritas pela IA.`)
        fetchPending()
      } else {
        setMessage('Erro na sincronização.')
      }
    } catch (err) {
      setMessage('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight">Captação Automática (IA)</h1>
          <p className="text-sm text-gray-500 mt-1">Sincronize notícias dos portais de imprensa e revise antes de publicar.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={loading}
          className={`btn-primary px-8 py-3 shadow-lg shadow-yellow-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? '🤖 SINCRONIZANDO...' : '🔄 SINCRONIZAR AGORA'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.includes('Erro') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Pending Queue */}
      <div className="admin-card">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
           <span>⏳</span> Fila de Aprovação ({articles.length})
        </h2>

        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                🗞️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-black line-clamp-1">{article.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black uppercase text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">{article.source}</span>
                   <span className="text-[10px] text-gray-400">Captado em {new Date(article.createdAt).toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <Link 
                   href={`/admin/artigos/${article.id}/editar`} 
                   className="btn-secondary !py-2 !px-4 !text-xs"
                 >
                   REVISAR & EDITAR
                 </Link>
                 <button className="btn-primary !py-2 !px-4 !text-xs !bg-green-600 !text-white hover:!bg-green-700">
                   APROVAR
                 </button>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="text-center py-10">
               <p className="text-gray-400 italic">Nenhuma matéria aguardando revisão no momento.</p>
               <button onClick={handleSync} className="text-yellow-600 text-xs font-bold uppercase mt-2 hover:underline">Sincronizar agora</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
