import { auth } from '@/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isAuthenticated = false

  try {
    const session = await auth()
    isAuthenticated = !!(session?.user?.email)
  } catch (e) {
    // Auth pode falhar se AUTH_SECRET não estiver configurado
    isAuthenticated = false
  }

  // Se não autenticado, renderizar apenas o conteúdo (login, esqueci-senha, etc.)
  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar text-white w-64 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-black text-white hover:text-yellow-400">
            AUTO<span className="text-yellow-400">REPÓRTER</span>
          </Link>
          <div className="text-xs text-gray-500 mt-1">PAINEL DE CONTROLE</div>
        </div>
        
        <nav className="flex-1 mt-6">
          <Link href="/admin" className="admin-nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/artigos" className="admin-nav-item">
            <span>📝</span> Artigos
          </Link>
          <Link href="/admin/captacao" className="admin-nav-item">
             <span>🤖</span> Captação IA
          </Link>
          <Link href="/admin/ranking" className="admin-nav-item">
            <span>🏆</span> Ranking
          </Link>
          <Link href="/admin/videos" className="admin-nav-item">
            <span>📹</span> Vídeos
          </Link>
          <Link href="/admin/colunas" className="admin-nav-item">
            <span>✍️</span> Colunas
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <form action="/api/auth/signout" method="POST">
             <button className="w-full text-left admin-nav-item hover:text-red-400">
               <span>🚪</span> Sair
             </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
