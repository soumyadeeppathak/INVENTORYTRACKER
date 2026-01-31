import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'session'

/**
 * Middleware to protect authenticated routes and redirect based on auth state
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)
  const { pathname } = request.nextUrl

  // Define public auth routes (login, verify magic link)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/verify')

  // Redirect unauthenticated users to login
  if (!session && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url)
    // Preserve the intended destination for redirect after login (including query params)
    const redirectPath = pathname + request.nextUrl.search
    loginUrl.searchParams.set('redirect', redirectPath)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  return NextResponse.next()
}

/**
 * Configure which routes the middleware should run on
 * Exclude:
 * - /api routes (handled separately)
 * - /_next/static (static files)
 * - /_next/image (image optimization)
 * - /favicon.ico, /manifest.json, /icons (PWA and static assets)
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)'],
}
