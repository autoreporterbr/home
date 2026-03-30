import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const videos = await prisma.video.findMany({
    orderBy: { publishedAt: 'desc' },
  })
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, youtubeUrl, thumbnailUrl } = body

  const video = await prisma.video.create({
    data: { title, description, youtubeUrl, thumbnailUrl }
  })

  return NextResponse.json(video)
}
