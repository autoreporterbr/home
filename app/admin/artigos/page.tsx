import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StatusBadge from '@/components/admin/StatusBadge'

export default async function AdminArticlesList() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">GERENCIAR ARTIGOS</h1>
        <Link href="/admin/artigos/novo" className="btn-primary">
          <span>+</span> Criar Novo Artigo
        </Link>
      </div>

      <div className="admin-card overflow-hidden !p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Título</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Editoria</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Atualizado em</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-sm text-black line-clamp-1">{article.title}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">{article.slug}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 capitalize">{article.editoria}</td>
                <td className="p-4">
                  <StatusBadge status={article.status} />
                </td>
                <td className="p-4 text-xs text-gray-500">
                  {new Date(article.updatedAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/artigos/${article.id}/editar`} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </Link>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400 italic">
                  Nenhum artigo encontrado. Crie o seu primeiro!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
