import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@autoreporter.com.br'
  const adminPassword = process.env.ADMIN_PASSWORD || 'AutoReporter@2024'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log('Admin user already exists.')
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log(`Admin user created: ${adminEmail}`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
