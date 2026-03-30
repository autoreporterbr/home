import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLoginPage = nextUrl.pathname === '/admin/login'

      if (isOnAdmin) {
        if (isOnLoginPage) return true
        if (isLoggedIn) return true
        return false // Redireciona para a página de login
      }
      return true
    },
  },
  providers: [], // Estrutura básica para o middleware
} as NextAuthConfig
