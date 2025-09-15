import { routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

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
    dashboard: {
      initial: homeRoute,
      direction: { initial: direction },
      surveillant: { initial: surveillant },
      cashier: { initial: cashier },
    },
  } = routes.page_route;

  const token = await getToken({ req, secret });

  // Redirect unauthenticated users from dashboard to login
  if (url.pathname.includes(homeRoute) && !token) {
    url.pathname = loginRoute;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login to role-based dashboard
  if (url.pathname.includes(loginRoute) && token) {
    let redirectPath = homeRoute;
    switch (token.role?.name) {
      case 'Caissier':
      case 'Adjoint Caissier':
        redirectPath = cashier;
        break;
      case 'Secretaire General':
      case 'Directeur General':
      case 'Adjoint Secretaire General':
      case 'Adjoint Directeur General':
        redirectPath = direction;
        break;
      case 'Surveillant general':
      case 'Adjoint Surveillant General':
        redirectPath = surveillant;
        break;
      case 'Directeur etablissment':
      case 'Adjoint Directeur Etablissement':
        redirectPath = cashier;
        break;
      default:
        redirectPath = homeRoute;
    }
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // Additional verifications
  if (url.pathname.includes('dispatch') && !req.headers.get('content-source')) {
    url.pathname = '/404';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


