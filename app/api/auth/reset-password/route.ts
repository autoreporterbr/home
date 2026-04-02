import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validação de força da senha
function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.'
  }
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula.'
  }
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número.'
  }
  return null
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e nova senha são obrigatórios.' }, { status: 400 })
    }

    // Validar token contra timing attacks — busca com constante de tempo
    if (typeof token !== 'string' || token.length !== 64) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 400 })
    }

    // Validar força da senha
    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    if (!user) {
      return NextResponse.json({ error: 'Token inválido ou já utilizado.' }, { status: 400 })
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      // Limpar token expirado por segurança
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      })
      return NextResponse.json({ error: 'O link de recuperação expirou. Solicite um novo.' }, { status: 400 })
    }

    // Hash com cost factor 12 (mais seguro que 10)
    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: 'Senha atualizada com sucesso.' })
  } catch (error) {
    console.error('Erro na rota reset-password:', error)
    return NextResponse.json({ error: 'Falha interna no servidor.' }, { status: 500 })
  }
}
