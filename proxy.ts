import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Protect /admin and sub-routes
  if (pathname.startsWith('/admin')) {
    if (!session || session.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged-in admins from going to login page
  if (pathname === '/login') {
    if (session && session.value === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    '/admin/:path*',
    '/login',
  ],
};
