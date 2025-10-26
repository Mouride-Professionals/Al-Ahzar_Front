import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateUserForm } from '@components/forms/user/create';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { getAllowedSchools, ROLES } from '@utils/roles';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

const DIRECTORIAL_ROLES = [
  ROLES.DIRECTEUR_ETABLISSMENT,
  ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
];

const SCHOOL_STAFF_ROLES = [
  ROLES.SURVEILLANT_GENERAL,
  ROLES.ADJOINT_SURVEILLANT_GENERAL,
  ROLES.CAISSIER,
  ROLES.ADJOINT_CAISSIER,
];

const extractSchoolId = (school) => {
  if (!school) {
    return undefined;
  }
  if (typeof school === 'number') {
    return school;
  }
  if (school.id) {
    return school.id;
  }
  if (school.data?.id) {
    return school.data.id;
  }
  return undefined;
};

export default function Edit({ user, schools, role, token, roles }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  if (hasSucceeded) {
    router.push(routes.page_route.dashboard.direction.users.all);
  }

  return (
    <DashboardLayout
      title={t('pages.dashboard.users.title')}
      currentPage={t('components.menu.users')}
      role={role}
      token={token}
    >
      <VStack
        borderStyle={'solid'}
        border={1}
        borderColor={colors.gray.regular}
        mt={10}
        w={'100%'}
      >
        <HStack
          _hover={{ cursor: 'pointer' }}
          onClick={() => router.back()}
          alignItems={'center'}
          px={5}
          bgColor={colors.secondary.light}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          h={90}
          w={'100%'}
        >
          <BsArrowLeftShort size={40} />
          <Text fontSize={20} fontWeight={'700'}>
            {t('components.cards.user.edit')}
          </Text>
        </HStack>
        <Stack
          bgColor={colors.white}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          w={'100%'}
          minH={'35rem'}
        >
          <CreateUserForm
            {...{
              schools,
              setHasSucceeded,
              token,
              role,
              roles,
              initialData: user,
              isEdit: true,
            }}
          />
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, params }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: routes.page_route.auth?.initial || '/user/auth',
        permanent: false,
      },
    };
  }

  const currentUser = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });
  const role = currentUser.role ?? null;
  const userSchoolId = currentUser.school?.id;

  const userResponse = await serverFetch({
    uri: `${routes.api_route.alazhar.get.users.detail.replace(
      '%id',
      params.id
    )}?populate=role,school`,
    user_token: token,
  });

  if (!userResponse || !userResponse.id) {
    return {
      redirect: {
        destination: routes.page_route.dashboard.direction.users.all,
        permanent: false,
      },
    };
  }

  const targetSchoolId = extractSchoolId(userResponse.school);
  const allowedRoleNames = DIRECTORIAL_ROLES.includes(role?.name)
    ? SCHOOL_STAFF_ROLES
    : Object.values(ROLES).filter(
        (roleName) => roleName !== ROLES.DIRECTEUR_GENERAL
      );

  const userRoleName =
    userResponse.role?.name ||
    userResponse.role?.data?.attributes?.name ||
    userResponse.role;

  if (
    DIRECTORIAL_ROLES.includes(role?.name) &&
    (!allowedRoleNames.includes(userRoleName) ||
      (targetSchoolId && targetSchoolId !== userSchoolId))
  ) {
    return {
      redirect: {
        destination: routes.page_route.dashboard.direction.users.all,
        permanent: false,
      },
    };
  }

  const schoolsResponse = await serverFetch({
    uri: `${routes.api_route.alazhar.get.schools.all}?fields[0]=name&fields[1]=id&fields[2]=type`,
    user_token: token,
  });

  const filteredSchools =
    Array.isArray(schoolsResponse?.data) && role?.name
      ? {
          ...schoolsResponse,
          data: getAllowedSchools(
            role.name,
            userSchoolId,
            schoolsResponse.data
          ),
        }
      : schoolsResponse;

  const { roles: availableRoles } = await serverFetch({
    uri: `${routes.api_route.alazhar.get.roles}?fields[0]=name&fields[1]=id&fields[2]=type`,
    user_token: token,
  });

  const filteredRoles = (availableRoles || []).filter((availableRole) =>
    allowedRoleNames.includes(availableRole.name)
  );

  if (
    userResponse.role?.id &&
    !filteredRoles.find((availableRole) => availableRole.id === userResponse.role.id)
  ) {
    filteredRoles.push({
      id: userResponse.role.id,
      name: userResponse.role.name,
    });
  }

  const mappedRoles = filteredRoles.map((availableRole) => ({
    name: availableRole.name,
    value: availableRole.id,
  }));

  const mappedUser = {
    id: userResponse.id,
    username: userResponse.username || '',
    firstname: userResponse.firstname || '',
    lastname: userResponse.lastname || '',
    email: userResponse.email || '',
    role: userResponse.role?.id || '',
    school: targetSchoolId || '',
  };

  return {
    props: {
      role,
      token,
      user: mappedUser,
      schools: filteredSchools,
      roles: mappedRoles,
    },
  };
};
