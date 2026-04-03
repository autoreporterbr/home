import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[AUTH] Login falhou: Email ou senha ausentes no formulário.')
          return null
        }

        try {
          console.log(`[AUTH] Tentando login para: ${credentials.email}`)
          
          const user = await prisma.user.findUnique({
            where: { email: (credentials.email as string).toLowerCase() },
          })

          if (!user) {
            console.warn(`[AUTH] Falha: Usuário não encontrado no banco: ${credentials.email}`)
            return null
          }

          console.log(`[AUTH] Usuário encontrado: ${user.email}. Comparando senhas...`)

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!passwordMatch) {
            console.warn(`[AUTH] Falha: Senha incorreta para o usuário: ${user.email}`)
            return null
          }

          console.log(`[AUTH] Login com SUCESSO: ${user.email}`)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error: any) {
          console.error("[AUTH] ERRO CRÍTICO NO BANCO DE DADOS:", error.message || error)
          // Em Vercel, isso geralmente indica que a DATABASE_URL está faltando ou incorreta
          return null
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
})
