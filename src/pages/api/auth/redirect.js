import { routes } from '@theme';
import { getSession, signOut } from 'next-auth/react';
import { serverFetch } from 'src/lib/api';

export default async function customRedirect() {
    // Fetch the session to get the user role
    const session = await getSession();
    const token = session?.user?.accessToken;
    console.log('session', session);

    if (!token) {
        return window.location.assign('/user/auth');
    }

    const response = await serverFetch({
        uri: routes.api_route.alazhar.get.me,
        user_token: token,
    });

    const role = response.role;

    console.log('role', role);

    const {
        dashboard: { direction: {
            initial: direction
        }, surveillant: {

            initial: surveillant

        }, cashier: {

            initial: cashier

        } }

    } = routes.page_route;

    if (!role) {
        signOut();
        return window.location.assign('/user/auth');
    }

    // Define the redirect path based on role
    let redirectPath = '/user/auth'; // Default path
    switch (role.name) {
        case 'Caissier':
            redirectPath = cashier;
            break;
        case 'Secretaire General':
            redirectPath = direction;
            break;
        case 'Surveillant general':
            redirectPath = surveillant;
            break;
        case 'Directeur General':
            redirectPath = direction;
            break;
        case 'Directeur etablissment':
            redirectPath = direction;
            break;
        default:
            redirectPath = '/user/auth';
    }

    // Redirect the user
    window.location.assign(redirectPath);


}
