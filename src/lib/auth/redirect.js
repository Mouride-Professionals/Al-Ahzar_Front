'use client';
import { routes } from '@theme';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { serverFetch } from '../api';

export default function useCustomRedirect() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [role, setRole] = useState(null); // State to store the role

    useEffect(() => {
        // if (status === 'loading') return;

        const token = session?.user?.accessToken;

        if (!token) {
            return router.push('/user/auth');
        }


        async function fetchUserRole() {
            try {
                const response = await serverFetch({
                    uri: routes.api_route.alazhar.get.me,
                    user_token: token,
                });

                setRole(response.role); // Set the role in state
           console.log('User role:', response.role);
           
            } catch (error) {
                console.error('Error fetching user role:', error);
                signOut({ redirect: false });
                router.push('/user/auth');
            }
        }

        fetchUserRole();
    }, [ session, router]);

    useEffect(() => {
        if (!role) return; // Wait until the role is fetched

        const {
            dashboard: {
                direction: { initial: direction },
                surveillant: { initial: surveillant },
                cashier: { initial: cashier },
            },
        } = routes.page_route;

        let redirectPath = '/user/auth';
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
                redirectPath = cashier;
                break;
            default:
                redirectPath = '/user/auth';
        }
console.log('Redirecting to:', redirectPath);

        router.push(redirectPath);


    }, [role, router]);
}