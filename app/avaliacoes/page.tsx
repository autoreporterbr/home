import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'

export const metadata = {
  title: 'Avaliações de Carros',
  description: 'Testes completos e imparciais dos principais modelos do mercado brasileiro.',
}

export default async function AvaliacoesPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'published', editoria: 'avaliacoes' },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div>
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="section-header">
          <div className="section-header-bar" />
          <h1 className="text-3xl font-black uppercase tracking-tight">Avaliações</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {articles.map((article, i) => (
            <NewsCard key={article.id} {...article} delay={i * 50} />
          ))}
          {articles.length === 0 && (
            <div className="col-span-full py-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
               <span className="text-5xl mb-4 text-gray-200">🚗</span>
               <p className="max-w-md text-gray-400 font-medium italic">
                 Estamos testando os modelos mais recentes. Em breve, avaliações inéditas e completas aqui.
               </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
