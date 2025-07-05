
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { useUser } from './contexts/userContext'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  // const { user } = useUser();
  const protectedPaths = ['/my-zone', '/public-feed']  
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  ) 

  const path = request.nextUrl.pathname

  if (path === ( '/auth') && token) {
    return NextResponse.redirect(new URL('/my-zone', request.url))
  }

  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/my-zone', request.url))
  }


  if (isProtected && !token) {
    // Redirect to home page if no token
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/my-zone',
     '/auth/:path*',   
    '/my-zone/:path*',
    '/',
    '/public-feed',
    '/auth/onboarding',
    
    ],
}
