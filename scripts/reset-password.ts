
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = 'autoreporterbr@gmail.com'
  const newPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  console.log(`🔄 Atualizando senha para: ${email}...`)

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log('✅ Senha atualizada com sucesso no banco de dados!')
    console.log(`📧 Email: ${user.email}`)
    console.log(`🔑 Nova Senha: ${newPassword}`)
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
