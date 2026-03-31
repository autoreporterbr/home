import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'

export const metadata = {
  title: 'Notícias Automotivas',
  description: 'Fique por dentro das últimas novidades do setor automotivo, lançamentos e segredos.',
}

export const dynamic = 'force-dynamic'

export default async function NoticiasPage() {
  let articles: any[] = []
  try {
    articles = await prisma.article.findMany({
      where: { status: 'published', editoria: 'noticias' },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
  }

  return (
    <div>
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="section-header">
          <div className="section-header-bar" />
          <h1 className="text-3xl font-black uppercase tracking-tight">Notícias</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {articles.map((article, i) => (
            <NewsCard key={article.id} {...article} delay={i * 50} />
          ))}
          {articles.length === 0 && (
            <p className="col-span-full text-center py-20 text-gray-400 italic">
              Nenhuma notícia publicada ainda.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
