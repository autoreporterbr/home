import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdmin() {
  const email = 'autoreporterbr@gmail.com'
  const newPassword = 'AutoReporterAdmin@2026'
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  try {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    console.log(`✅ Senha do administrador ${email} resetada com sucesso para: ${newPassword}`)
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdmin()
