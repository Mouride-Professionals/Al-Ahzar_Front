// src/components/common/school_year_selector/index.js
'use client';

import { Select, VStack } from '@chakra-ui/react';
import { colors, routes } from '@theme';
import { useSchoolYear } from '@utils/context/school_year_context';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { serverFetch } from 'src/lib/api';

export const SchoolYearSelector = ({ token }) => {
  const router = useRouter();
  const { schoolYear, setSchoolYear } = useSchoolYear();
  const [triggerRedirect, setTriggerRedirect] = useState(false);
  const [schoolYears, setSchoolYears] = useState([]);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(
    Cookies.get('selectedSchoolYear') || null
  );
  const [loading, setLoading] = useState(false);
  const {
    alazhar: {
      get: {
        school_years: { all: allSchoolYears },
        me: meEndpoint,
      },
    },
  } = routes.api_route;
  const t = useTranslations('components.layout.header');

  // Fetch school years
  const fetchSchoolYears = async () => {
    setLoading(true);
    try {
      const response = await serverFetch({
        uri: allSchoolYears,
        user_token: token,
      });

      if (!response || !response.data) {
        setCurrentSchoolYear(null);
        setSchoolYear(null);
        Cookies.remove('selectedSchoolYear');
        console.error('No school years found');
        return;
      }
      if (response.data.length === 0) {
        router.push('/dashboard/direction/school_years/create');
      }

      setSchoolYears(response.data);
      const current = response.data.find((year) => year.attributes?.isCurrent);
      if (current) {
        setCurrentSchoolYear(current.id);
        setSchoolYear(current.id);
        Cookies.set('selectedSchoolYear', current.id);
      }
    } catch (error) {
      console.error('Error fetching school years:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedSchoolYear = Cookies.get('selectedSchoolYear');
    if (savedSchoolYear) {
      setCurrentSchoolYear(savedSchoolYear);
      setSchoolYear(savedSchoolYear);
    }
    if (schoolYears.length === 0 || !savedSchoolYear) {
      fetchSchoolYears();
    }
  }, [token]);

  // Fetch user role and redirect
  const fetchUserRole = async () => {
    try {
      const response = await serverFetch({
        uri: meEndpoint,
        user_token: token,
      });

      const role = response.role;
      if (!role) {
        signOut({ redirect: false });
        router.push('/user/auth');
        return;
      }
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
          redirectPath = '/user/auth';
      }

      router.push(redirectPath);
    } catch (error) {
      console.error('Error fetching user role:', error);
      signOut({ redirect: false });
      router.push('/user/auth');
    }
  };

  useEffect(() => {
    if (!triggerRedirect) return;
    if (!token) {
      signOut({ redirect: false });
      router.push('/user/auth');
      return;
    }
    fetchUserRole();
    setTriggerRedirect(false);
  }, [triggerRedirect, router, token]);

  const handleSchoolYearChange = (selectedYear) => {
    setSchoolYear(selectedYear);
    setCurrentSchoolYear(selectedYear);
    Cookies.set('selectedSchoolYear', selectedYear);
    setTriggerRedirect(true);
  };

  return (
    <VStack w={{ base: '120px', sm: '120px' }} spacing={1} align="left">
      {/* <Text fontWeight="hairline" fontSize={{ base: 'xs', sm: 'sm' }}>
                {t('schoolYearSelector.label')}
            </Text> */}
      <Select
        value={currentSchoolYear || ''}
        onChange={(e) => handleSchoolYearChange(e.target.value)}
        isDisabled={loading}
        bg="white"
        borderColor={colors.secondary.regular}
        size={{ base: 'sm', sm: 'md' }}
        fontSize={{ base: '12px', sm: '14px' }}
        placeholder={t('schoolYearSelector.label')}
        _placeholder={{ color: colors.gray.dark }}
      >
        {loading ? (
          <option value="" disabled>
            {t('schoolYearSelector.label')}
          </option>
        ) : (
          schoolYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.attributes.name}
            </option>
          ))
        )}
      </Select>
    </VStack>
  );
};
