import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  let stats = {
    articlesCount: 0,
    pendingCount: 0,
    carsCount: 0,
    publishedToday: 0
  }
  let recentArticles: any[] = []

  try {
    const [articlesCount, pendingCount, carsCount, publishedToday] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'pending_review' } }),
      prisma.car.count(),
      prisma.article.count({ 
        where: { 
          status: 'published',
          publishedAt: {
            gte: new Date(new Date().setHours(0,0,0,0))
          }
        } 
      }),
    ])
    stats = { articlesCount, pendingCount, carsCount, publishedToday }
    
    recentArticles = await prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
    })
  } catch (error) {
    console.error('Admin Dashboard Data Fetch Error:', error)
  }

  const { articlesCount, pendingCount, carsCount, publishedToday } = stats

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">Dashboard</h1>
        <div className="flex gap-3">
           <Link href="/admin/artigos/novo" className="btn-primary">
             <span>+</span> Novo Artigo
           </Link>
           <Link href="/admin/ranking/novo" className="btn-secondary">
             <span>+</span> Avaliar Carro
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Artigos" value={articlesCount} icon="📝" />
        <StatCard title="Aguardando Revisão" value={pendingCount} icon="⏳" color="text-amber-500" />
        <StatCard title="Publicados Hoje" value={publishedToday} icon="🚀" color="text-green-500" />
        <StatCard title="Carros no Ranking" value={carsCount} icon="🏆" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Recent Activity */}
        <div className="admin-card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🕒</span> Atividade Recente
          </h2>
          <div className="space-y-4">
            {recentArticles.map(article => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h3 className="text-sm font-semibold text-black line-clamp-1">{article.title}</h3>
                  <p className="text-xs text-gray-500">{new Date(article.updatedAt).toLocaleString('pt-BR')}</p>
                </div>
                <StatusBadge status={article.status} />
              </div>
            ))}
            {recentArticles.length === 0 && (
              <p className="text-sm text-gray-500 italic">Nenhuma atividade recente.</p>
            )}
          </div>
          <Link href="/admin/artigos" className="block text-center text-xs font-bold text-gray-400 mt-6 uppercase hover:text-yellow-600">
            Ver todos os artigos →
          </Link>
        </div>

        {/* Quick Actions / Help */}
        <div className="admin-card">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⚡</span> Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction title="Sincronizar IA" desc="Buscar novas notícias manuais nos portais de imprensa." icon="🤖" href="/admin/captacao" />
            <QuickAction title="Ver Site" desc="Visualizar como o portal está para o público." icon="🌐" href="/" />
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
             <h3 className="text-sm font-bold text-yellow-800 mb-1">Dica de SEO</h3>
             <p className="text-xs text-yellow-700 leading-relaxed">
               Lembre-se de preencher as meta-descrições com pelo menos 150 caracteres para melhor indexação no Google.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color = "text-black" }: any) {
  return (
    <div className="admin-card flex items-center gap-4">
      <div className="text-3xl bg-gray-50 w-14 h-14 flex items-center justify-center rounded-xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  )
}

function QuickAction({ title, desc, icon, href }: any) {
  return (
    <Link href={href} className="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-yellow-200 group">
      <div className="text-xl mb-2">{icon}</div>
      <h3 className="text-sm font-bold text-black group-hover:text-yellow-600 transition-colors uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{desc}</p>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    published: 'badge-published',
    draft: 'badge-draft',
    pending_review: 'badge-pending',
  }
  const labels: any = {
    published: 'Publicado',
    draft: 'Rascunho',
    pending_review: 'Pendente',
  }
  return <span className={`badge ${styles[status]}`}>{labels[status]}</span>
}
