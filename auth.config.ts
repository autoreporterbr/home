import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnLoginPage = nextUrl.pathname === '/admin/login'

      if (isOnAdmin) {
        // Redirecionamento correto para páginas públicas sob /admin
        if (isOnLoginPage || 
            nextUrl.pathname.startsWith('/admin/esqueci-senha') || 
            nextUrl.pathname.startsWith('/admin/redefinir-senha')) {
          return true
        }
        
        if (isLoggedIn) return true
        return false // Redireciona para login
      }
      return true
    },
  },
  providers: [], // Providers configurados no auth.ts (Node.js runtime)
} as NextAuthConfig
