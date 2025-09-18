'use client';

import { useToast } from '@chakra-ui/react';
import { routes } from '@theme';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { serverFetch } from '../api';

export default function useCustomRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const toast = useToast({
    position: 'top',
    duration: 5000,
    isClosable: true,
  });

  // Get current path to prevent unnecessary redirects
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    if (status === 'loading') return;

    const token = session?.user?.accessToken;

    if (!token) {
      // Only redirect to auth if not already there
      if (!currentPath.startsWith('/user/auth')) {
        router.push('/user/auth');
      }
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
        setForcePasswordChange(userResponse.forcePasswordChange);
        setIsInitialized(true);

        if (userResponse.forcePasswordChange) {
          const settingsPath = `${routes.page_route.dashboard.settings}?forcePasswordChange=true`;
          // Only redirect if not already on settings page
          if (!currentPath.startsWith(routes.page_route.dashboard.settings)) {
            router.push(settingsPath);
          }
          return;
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast({
          id: 'redirect-error',
          title: 'Erreur',
          description:
            error.message || 'Échec de la récupération du rôle utilisateur.',
          status: 'error',
        });
        await signOut({ redirect: false });
        router.push('/user/auth');
      }
    };

    fetchUserRole();
  }, [session, status, router, toast, currentPath]);

  useEffect(() => {
    // Only proceed if user data is initialized and no force password change
    if (!isInitialized || !role || forcePasswordChange) return;

    // Use the proper route destructuring pattern
    const {
      dashboard: {
        direction: { initial: direction },
        surveillant: { initial: surveillant },
        cashier: { initial: cashier },
      },
    } = routes.page_route;

    // Role-based redirect mapping
    const roleRedirectMap = {
      Caissier: cashier,
      'Adjoint Caissier': cashier,
      'Secretaire General': direction,
      'Adjoint Secretaire General': direction,
      'Directeur General': direction,
      'Adjoint Directeur General': direction,
      'Directeur etablissment': cashier,
      'Adjoint Directeur Etablissement': cashier,
      'Surveillant general': surveillant,
      'Adjoint Surveillant General': surveillant,
      'Secretaire Générale de Finances': direction,
      'Adjoint Secretaire Générale de Finances': direction,
    };

    const targetPath = roleRedirectMap[role.name];

    if (!targetPath) {
      // Invalid role, redirect to auth
      if (!currentPath.startsWith('/user/auth')) {
        router.push('/user/auth');
      }
      return;
    }

    // Only redirect if not already on the correct dashboard path
    const isDashboardPath = currentPath.startsWith('/dashboard');
    const isCorrectDashboard = currentPath.startsWith(targetPath);

    if (!isDashboardPath || !isCorrectDashboard) {
      router.push(targetPath);
    }
  }, [role, forcePasswordChange, router, currentPath, isInitialized]);

  return {
    role,
    forcePasswordChange,
    isInitialized,
    currentPath,
  };
}
