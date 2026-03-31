import nodemailer from 'nodemailer'

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.warn('\n======================================================')
    console.warn('E-MAIL SIMULADO (FALTAM CREDENCIAIS SMTP NO .env)')
    console.warn(`Para: ${to}`)
    console.warn(`Assunto: ${subject}`)
    console.warn(`Conteúdo:\n${html.replace(/<[^>]+>/g, ' ')}`) // stripped HTML for easier reading
    console.warn('======================================================\n')
    return { success: true, mocked: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Auto Repórter" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    return { success: true, mocked: false }
  } catch (error) {
    console.error('Erro ao enviar e-mail via SMTP:', error)
    throw new Error('Falha ao enviar e-mail')
  }
}
