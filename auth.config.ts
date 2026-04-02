import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  trustHost: true,
  // O secret deve ser carregado obrigatoriamente
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLoginPage = nextUrl.pathname === '/admin/login'

      if (isOnAdmin) {
        // Permitir páginas públicas dentro do /admin
        if (isOnLoginPage || 
            nextUrl.pathname.startsWith('/admin/esqueci-senha') || 
            nextUrl.pathname.startsWith('/admin/redefinir-senha')) {
          return true
        }
        
        if (isLoggedIn) return true
        return false // Redireciona para login se não estiver logado
      }
      return true
    },
  },
  providers: [], // Configurado no auth.ts para o runtime do servidor
} as NextAuthConfig
