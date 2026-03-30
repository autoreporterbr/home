import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'

export default async function ColunasPage() {
  const colunas = await prisma.article.findMany({
    where: { editoria: 'colunas', status: 'published' },
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div>
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="section-header">
          <div className="section-header-bar" />
          <h1 className="text-3xl font-black uppercase tracking-tight">Colunas</h1>
        </div>
        
        {colunas.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p>Nenhuma coluna publicada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colunas.map((coluna) => (
              <NewsCard key={coluna.id} {...coluna} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
