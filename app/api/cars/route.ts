import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  
  const where: any = {}
  if (category) where.category = category

  const cars = await prisma.car.findMany({
    where,
    orderBy: { overallScore: 'desc' },
  })

  return NextResponse.json(cars)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { 
    brand, model, year, category, 
    acabamento, infotenimento, espacoInterno, 
    portaMalas, desempenho, dirigibilidade, 
    conforto, consumo, imageUrl, reviewSlug 
  } = body

  const scores = [
    acabamento, infotenimento, espacoInterno, 
    portaMalas, desempenho, dirigibilidade, 
    conforto, consumo
  ]
  const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length

  const car = await prisma.car.create({
    data: {
      brand, model, year: parseInt(year), category,
      acabamento: parseFloat(acabamento),
      infotenimento: parseFloat(infotenimento),
      espacoInterno: parseFloat(espacoInterno),
      portaMalas: parseFloat(portaMalas),
      desempenho: parseFloat(desempenho),
      dirigibilidade: parseFloat(dirigibilidade),
      conforto: parseFloat(conforto),
      consumo: parseFloat(consumo),
      overallScore,
      imageUrl,
      reviewSlug
    }
  })

  return NextResponse.json(car)
}
