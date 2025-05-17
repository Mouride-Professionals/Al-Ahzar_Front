'use client';

import { routes } from '@theme';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { serverFetch } from '../api';
import { useToast } from '@chakra-ui/react';

export default function useCustomRedirect() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [role, setRole] = useState(null);
    const [forcePasswordChange, setForcePasswordChange] = useState(false);
    const toast = useToast({
        position: 'top',
        duration: 5000,
        isClosable: true,
    });

    useEffect(() => {
        if (status === 'loading') return;

        const token = session?.user?.accessToken;

        if (!token) {
            router.push('/user/auth');
            return;
        }

        const fetchUserRole = async () => {
            try {
                const userResponse = await serverFetch({
                    uri: routes.api_route.alazhar.get.me,
                    user_token: token,
                });

                if (!userResponse) {
                    throw new Error('Aucune réponse utilisateur trouvée.');
                }

                Cookies.set('schoolName', userResponse?.school?.name || '');
                setRole(userResponse.role);
                // setForcePasswordChange(userResponse.forcePasswordChange);

                // if (userResponse.forcePasswordChange) {
                    
                //     router.push(`${routes.page_route.dashboard.settings}?forcePasswordChange=true`);
                //     return;
                // }
            } catch (error) {
                console.error('Error fetching user role:', error);
                toast({
                    id: 'redirect-error',
                    title: 'Erreur',
                    description: error.message || 'Échec de la récupération du rôle utilisateur.',
                    status: 'error',
                });
                signOut({ redirect: false });
                router.push('/user/auth');
            }
        };

        fetchUserRole();
    }, [session, status, router, toast]);

    useEffect(() => {
        if (!role || forcePasswordChange) return;

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
            case 'Directeur General':
            case 'Directeur etablissment': // Fixed redirect anomaly
                redirectPath = direction;
                break;
            case 'Surveillant general':
                redirectPath = surveillant;
                break;
            default:
                redirectPath = '/user/auth';
        }

        router.push(redirectPath);
    }, [role, forcePasswordChange, router]);
}