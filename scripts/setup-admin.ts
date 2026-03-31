import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendMail } from '@/lib/mail'

const prisma = new PrismaClient()

async function setupAdmin() {
  const email = 'autoreporterbr@gmail.com'
  
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log(`Usuário administrativo ${email} já existe. Ignorando criação.`)
      return
    }

    // Gera uma senha aleatória segura de 12 caracteres base64url-safe
    const rawPassword = crypto.randomBytes(9).toString('base64url')
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: 'Administrador Principal',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log(`✅ Usuário ${user.email} criado com sucesso!`)
    console.log(`🔑 Senha gerada (apenas exibiçao inicial): ${rawPassword}`)

    // Enviar a senha por e-mail
    const emailResult = await sendMail(
      email,
      'Sua Conta e Senha - Auto Repórter',
      `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Bem-vindo ao Auto Repórter</h2>
        <p>Sua conta administrativa foi criada com sucesso.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>E-mail:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0;"><strong>Senha de acesso provisória:</strong> <span style="font-family: monospace; font-size: 16px;">${rawPassword}</span></p>
        </div>
        <p>Acesse o painel em: <a href="http://localhost:3000/admin/login">http://localhost:3000/admin/login</a></p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Recomendamos alterar sua senha assim que possível usando o recurso "Esqueci minha senha" ou editando no perfil.</p>
      </div>
      `
    )

    if (emailResult.mocked) {
      console.log('⚠️ Variáveis SMTP não configuradas. A senha mostrada acima acima NÃO FOI realmente enviada por e-mail. Utilize a senha logada no console para o primeiro acesso.')
    } else {
      console.log(`📩 A senha corporativa foi enviada em segurança para ${email}.`)
    }

  } catch (error) {
    console.error('Erro ao configurar administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAdmin()
