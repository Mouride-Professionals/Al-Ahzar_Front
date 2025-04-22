import { routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import customRedirect from './pages/api/auth/redirect';

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: [
    '/api/dispatch/:function*',
    '/dashboard/:function*',
    '/user/auth/:function*',
  ],
};

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const url = req.nextUrl.clone();

  const {
    auth: { initial: loginRoute },
    dashboard: { initial: homeRoute },
  } = routes.page_route;

  const token = await getToken({
    req,
    secret,
  });

  if (url.pathname.includes(homeRoute) && !token) {
    url.pathname = loginRoute;
    return NextResponse.redirect(url);
  }

  if (url.pathname.includes(loginRoute) && token) {
    // url.pathname = homeRoute;
    // return NextResponse.redirect(url);
    customRedirect();
  }

  // Additionnal verifications
  if (url.pathname.includes('dispatch') && !req.headers.get('content-source')) {
    url.pathname = '/404';
    return NextResponse.redirect(url);
  }
  // End of verifications
}
