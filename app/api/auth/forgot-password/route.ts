import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendMail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Para não vazar se o e-mail existe, retornamos sucesso genérico
      return NextResponse.json({ message: 'Se o e-mail existir, um link de recuperação foi enviado.' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hora de validade

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
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Olá, ${user.name}</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no painel Auto Repórter.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #EAB308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Redefinir Senha</a>
        </div>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Se você não solicitou esta alteração, pode ignorar este e-mail. Este link expirará em 1 hora.</p>
      </div>
      `
    )

    return NextResponse.json({ message: 'E-mail de recuperação enviado com sucesso.' })
  } catch (error) {
    console.error('Erro na rota forgot-password:', error)
    return NextResponse.json({ error: 'Falha interna no servidor' }, { status: 500 })
  }
}
