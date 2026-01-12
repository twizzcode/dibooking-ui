import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes - require PROVIDER or ADMIN role
  if (pathname.startsWith('/dashboard')) {
    try {
      // Get session from better-auth API
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      })

      if (!response.ok) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }

      const { user } = await response.json()

      // Check if user has PROVIDER or ADMIN role
      if (!user || (user.role !== 'PROVIDER' && user.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/become-provider', request.url))
      }
    } catch (error) {
      console.error('Middleware error:', error)
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
