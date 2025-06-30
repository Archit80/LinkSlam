
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const protectedPaths = ['/my-zone'] // TODO: add more later

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  ) 

  const path = request.nextUrl.pathname

  if (path.startsWith('/auth') && token) {
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
    '/'
    ],
}
