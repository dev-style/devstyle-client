// import NextAuth from "next-auth";
// import { authConfig } from "./src/app/admin/authconfig";

// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ['/((?!api|static|.*\\..*|_next).*)'],
// };


import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Vérifiez si le chemin commence par /admin (sauf /admin/login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Redirigez vers la page de connexion si non authentifié
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}