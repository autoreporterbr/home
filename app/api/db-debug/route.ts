import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
      admin_email_masked: adminUser ? adminUser.email.substring(0, 3) + '...' : 'none',
      env_check: {
        has_database_url_supabase: !!process.env.DATABASE_URL_SUPABASE,
        has_auth_secret: !!process.env.AUTH_SECRET,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      database_status: 'error',
      error: error.message || 'Unknown error',
      env_check: {
        has_database_url_supabase: !!process.env.DATABASE_URL_SUPABASE,
      }
    }, { status: 500 })
  }
}
