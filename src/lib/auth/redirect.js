'use client';
import { routes } from '@theme';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { serverFetch } from '../api';

export default function useCustomRedirect() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [role, setRole] = useState(null); // State to store the role
    const [forcePasswordChange, setForcePasswordChange] = useState(false); // State to store the forcePasswordChange flag

    useEffect(() => {
        // if (status === 'loading') return;

        const token = session?.user?.accessToken;

        if (!token) {
            return router.push('/user/auth');
        }


        async function fetchUserRole() {
            try {
                const userResponse = await serverFetch({
                    uri: routes.api_route.alazhar.get.me,
                    user_token: token,
                });


                if (!userResponse) {
                    console.error('No user response found');
                    signOut({ redirect: false });
                    router.push('/user/auth');
                    return;
                }
                Cookies.set('schoolName', userResponse?.school?.name || ''); // Save the selected school name to cookies


                setRole(userResponse.role); // Set the role in state

                // Check if the user needs to change their password
                setForcePasswordChange(userResponse.forcePasswordChange);

                if (userResponse.forcePasswordChange == true) {
                    // Redirect to change password page
                    // signOut({ redirect: false });
                    router.push(`${routes.page_route.dashboard.settings}?forcePasswordChange=true`);
                    return;
                }

            } catch (error) {
                console.error('Error fetching user role:', error);
                signOut({ redirect: false });
                router.push('/user/auth');
            }
        }

        fetchUserRole();
    }, [session, router]);

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

        router.push(redirectPath);


    }, [role, router]);
}