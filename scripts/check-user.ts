import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkUser() {
  const email = 'autoreporterbr@gmail.com'
  const passwordToTest = 'AutoReporterAdmin@2026'
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ Usuário ${email} NÃO encontrado no banco de dados.`)
      return
    }

    console.log(`✅ Usuário encontrado:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Nome: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Hash no Banco: ${user.password}`)

    const isMatch = await bcrypt.compare(passwordToTest, user.password)
    console.log(`\n🔍 Teste de Bcrypt com "${passwordToTest}": ${isMatch ? '✅ MATCH!' : '❌ FALHA NO MATCH'}`)

  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
