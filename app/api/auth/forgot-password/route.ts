import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendMail } from '@/lib/mail'

// Rate limiting simples em memória (por IP)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutos
const RATE_LIMIT_MAX = 5 // máximo 5 tentativas por janela

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(request: Request) {
  try {
    // Rate limiting por IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = body?.email?.trim()?.toLowerCase()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório.' }, { status: 400 })
    }

    // Resposta genérica para não vazar se o e-mail existe
    const genericResponse = NextResponse.json({
      message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes.'
    })

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return genericResponse
    }

    // Gerar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const resetUrl = `${appUrl}/admin/redefinir-senha?token=${resetToken}`

    await sendMail(
      user.email,
      'Recuperação de Senha - Auto Repórter',
      `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #121214; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.02em;">
            AUTO<span style="color: #FFCB08;">REPÓRTER</span>
          </h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">Olá, ${user.name}</h2>
          <p style="color: #555; line-height: 1.6;">Recebemos uma solicitação para redefinir a senha da sua conta no painel Auto Repórter.</p>
          <p style="color: #555; line-height: 1.6;">Clique no botão abaixo para criar uma nova senha:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #FFCB08; color: #121214; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; display: inline-block;">Redefinir Senha</a>
          </div>
          <p style="color: #888; font-size: 13px;">Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; font-size: 13px;"><a href="${resetUrl}" style="color: #FFCB08;">${resetUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">Se você não solicitou esta alteração, ignore este e-mail. O link expira em 1 hora.</p>
          <p style="color: #999; font-size: 12px;">Por segurança, nunca compartilhe este link com terceiros.</p>
        </div>
      </div>
      `
    )

    return genericResponse
  } catch (error) {
    console.error('Erro na rota forgot-password:', error)
    return NextResponse.json({ error: 'Falha interna no servidor.' }, { status: 500 })
  }
}
