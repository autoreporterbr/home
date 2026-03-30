import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return {}
  return {
    title: article.title,
    description: article.subtitle || article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.subtitle || article.metaDescription,
      images: [article.imageUrl || '/og-image.jpg'],
    },
  }
}

export default async function ArticleSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article || article.status !== 'published') notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.subtitle,
    "image": article.imageUrl,
    "datePublished": article.publishedAt?.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": article.authorName
    }
  }

  return (
    <div>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <article>
          <div className="mb-8">
            <span className="text-yellow-600 font-black uppercase text-xs tracking-widest mb-2 block">
              {article.editoria}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {article.subtitle}
            </p>
            <div className="flex items-center gap-4 mt-6 border-t border-b border-gray-100 py-4">
              <div className="text-sm">
                Por <span className="font-bold">{article.authorName}</span>
              </div>
              <div className="text-sm text-gray-400">
                {article.publishedAt?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {article.imageUrl && (
            <figure className="mb-10 rounded-xl overflow-hidden shadow-2xl">
              <img src={article.imageUrl} alt={article.title} className="w-full h-auto" />
              {article.imageCaption && (
                <figcaption className="bg-black text-white text-[11px] p-3 italic uppercase tracking-wider text-center">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          <div 
            className="article-content text-lg leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-12 p-8 bg-gray-50 rounded-2xl flex flex-col items-center text-center">
            <h3 className="text-lg font-bold mb-2">Gostou da nossa análise?</h3>
            <p className="text-sm text-gray-400 mb-6">Compartilhe essa notícia com seus amigos e nas redes sociais.</p>
            <div className="flex gap-4">
               {['WhatsApp', 'Twitter', 'Facebook'].map(sn => (
                 <button key={sn} className="px-6 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold hover:bg-yellow-400 transition-colors uppercase tracking-widest">{sn}</button>
               ))}
            </div>
          </div>
        </article>

        {/* Ad Placeholder */}
        <div className="mt-12 ad-unit ad-banner">Publicidade</div>
      </main>
      <Footer />
    </div>
  )
}
