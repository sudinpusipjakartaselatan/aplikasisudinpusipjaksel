import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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
  matcher: ['/admin/:path*', '/login'],
};
