import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const envSnapshot = {
    has_DATABASE_URL: !!process.env.DATABASE_URL,
    has_DIRECT_URL: !!process.env.DIRECT_URL,
    has_AUTH_SECRET: !!process.env.AUTH_SECRET,
    DATABASE_URL_length: process.env.DATABASE_URL?.length ?? 0,
    DATABASE_URL_starts: process.env.DATABASE_URL?.substring(0, 13) ?? 'MISSING',
  }

  try {
    const prisma = new PrismaClient()
    const userCount = await prisma.user.count()
    const adminUser = await prisma.user.findUnique({
      where: { email: 'autoreporterbr@gmail.com' }
    })
    await prisma.$disconnect()

    return NextResponse.json({
      database_status: 'online',
      version: 'v12.0-final-name-fix',
      users_count: userCount,
      admin_found: !!adminUser,
      admin_email_masked: adminUser ? adminUser.email.substring(0, 5) + '***' : 'NOT FOUND',
      env: envSnapshot,
    })
  } catch (error: any) {
    return NextResponse.json({
      database_status: 'error',
      version: 'v12.0-final-name-fix',
      error: error.message,
      env: envSnapshot,
    }, { status: 500 })
  }
}
