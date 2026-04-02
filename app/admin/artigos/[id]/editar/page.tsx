import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id }
  })

  if (!article) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-black uppercase tracking-tight">Editar Artigo</h1>
      <ArticleForm initialData={article} isEditing={true} />
    </div>
  )
}
