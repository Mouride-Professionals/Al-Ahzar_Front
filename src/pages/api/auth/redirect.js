import { routes } from '@theme';
import { getServerSession, signOut } from 'next-auth';
import { serverFetch } from 'src/lib/api';

export default async function handler(req, res) {
  // Fetch the session to get the user role
  const session = await getServerSession(req, res);
  const token = session?.user?.accessToken;

  if (!token) {
    return res.redirect(307, '/user/auth');
  }

  const response = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const role = response.role;

  const {
    dashboard: {
      direction: { initial: direction },
      surveillant: { initial: surveillant },
      cashier: { initial: cashier },
    },
  } = routes.page_route;

  if (!role) {
    await signOut({ redirect: false });
    return res.redirect(307, '/user/auth');
  }

  // Define the redirect path based on role
  let redirectPath = '/user/auth';
  switch (role.name) {
    case 'Caissier':
    case 'Adjoint Caissier':
      redirectPath = cashier;
      break;
    case 'Secretaire General':
    case 'Adjoint Secretaire General':
    case 'Secretaire Générale de Finances':
    case 'Adjoint Secretaire Générale de Finances':
      redirectPath = direction;
      break;
    case 'Surveillant general':
    case 'Adjoint Surveillant General':
      redirectPath = surveillant;
      break;
    case 'Directeur General':
    case 'Adjoint Directeur General':
      redirectPath = direction;
      break;
    case 'Directeur etablissment':
    case 'Adjoint Directeur Etablissement':
      redirectPath = cashier;
      break;
    default:
      redirectPath = '/user/auth';
  }

  // Redirect the user
  return res.redirect(307, redirectPath);
}
