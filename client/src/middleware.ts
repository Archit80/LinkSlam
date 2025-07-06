
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Since we're using localStorage for tokens, we can't check authentication 
  // in middleware (server-side). Let the client-side handle redirects.
  
  const path = request.nextUrl.pathname
  
  // Only handle public paths that don't require authentication checks
  if (path === '/') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}