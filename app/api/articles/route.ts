import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const editoria = searchParams.get('editoria')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const skip = (page - 1) * limit

  const where: any = {}
  if (editoria) where.editoria = editoria
  if (status) where.status = status
  else where.status = 'published'

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip,
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({ articles, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, subtitle, content, imageUrl, imageCaption, editoria, category, status, isFeatured, authorName, metaTitle, metaDescription, sourceUrl, source } = body

  let slug = slugify(title, { lower: true, strict: true, locale: 'pt' })
  // Ensure uniqueness
  const existing = await prisma.article.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now()}`
  }

  const article = await prisma.article.create({
    data: {
      title,
      subtitle,
      slug,
      content,
      imageUrl,
      imageCaption,
      editoria: editoria || 'noticias',
      category,
      status: status || 'draft',
      isFeatured: isFeatured || false,
      authorName: authorName || 'Redação Auto Repórter',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || subtitle,
      source,
      sourceUrl,
      publishedAt: status === 'published' ? new Date() : null,
    },
  })

  return NextResponse.json(article)
}
