import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasToken = request.cookies.has('token');
  const hasEmail = request.cookies.has('email');
  const isLogin = hasToken && hasEmail;

  const protectedPaths = ['/profile', '/post'];
  const publicPaths = ['/login', '/register'];

  if (
    !isLogin &&
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    isLogin &&
    publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!services|_next/static|_next/image|favicon.ico).*)'],
};
