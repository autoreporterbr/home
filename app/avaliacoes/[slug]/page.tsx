import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return {}
  return {
    title: `${article.title} | Avaliao`,
    description: article.subtitle || article.metaDescription,
  }
}

export default async function AvaliacaoSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article || article.status !== 'published') notFound()

  return (
    <div>
      <Header />
      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <article>
          <div className="mb-8">
            <span className="text-yellow-600 font-black uppercase text-xs tracking-widest mb-2 block">
              Avaliao Completa
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {article.imageUrl && (
            <figure className="mb-10 rounded-xl overflow-hidden shadow-2xl relative aspect-video">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
            </figure>
          )}

          <div 
            className="article-content text-lg leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  )
}
