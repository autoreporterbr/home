import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function ColunaSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article || article.status !== 'published') notFound()

  return (
    <div>
      <Header />
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <article>
          <header className="mb-12 text-center">
             <span className="text-yellow-600 font-bold uppercase text-xs tracking-widest mb-4 block">Coluna</span>
             <h1 className="text-4xl font-black text-black mb-6">{article.title}</h1>
             <div className="flex items-center justify-center gap-3">
                <div className="text-sm font-bold">Por {article.authorName}</div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="text-sm text-gray-400">
                  {article.publishedAt?.toLocaleDateString('pt-BR')}
                </div>
             </div>
          </header>

          <div 
            className="article-content text-xl leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
