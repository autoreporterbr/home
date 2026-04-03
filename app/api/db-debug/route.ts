import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const adminUser = await prisma.user.findUnique({
      where: { email: 'autoreporterbr@gmail.com' }
    })

    return NextResponse.json({
      database_status: 'online',
      users_count: userCount,
      admin_found: !!adminUser,
      admin_email: adminUser?.email,
      admin_role: adminUser?.role,
      env_check: {
        has_database_url: !!process.env.DATABASE_URL,
        has_auth_secret: !!process.env.AUTH_SECRET,
        node_env: process.env.NODE_ENV
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      database_status: 'error',
      error: error.message || 'Unknown error',
      env_check: {
        has_database_url: !!process.env.DATABASE_URL,
      }
    }, { status: 500 })
  }
}
