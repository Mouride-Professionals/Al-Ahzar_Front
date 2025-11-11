import { HStack, Skeleton, Stack, Text, Wrap } from '@chakra-ui/react';
import { DashboardLayout } from '@components/layout/dashboard';
import { DEFAULT_ROWS_PER_PAGE } from '@constants/pagination';
import { colors, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapUsersDataTable } from '@utils/mappers/user';
import { ROLES } from '@utils/roles';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { FaSuitcase, FaUser } from 'react-icons/fa'; // icon for user
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const StatisticsFallback = () => (
  <HStack w="100%">
    <Stack direction={{ base: 'column', md: 'row' }} spacing={6} w="100%">
      {Array.from({ length: 2 }).map((_, index) => (
        <Stack
          key={index}
          bgColor={colors.white}
          borderRadius="lg"
          boxShadow="sm"
          p={6}
          flex={1}
        >
          <Skeleton height="24px" mb={2} />
          <Skeleton height="16px" />
        </Stack>
      ))}
    </Stack>
  </HStack>
);

const TableFallback = () => (
  <Stack
    bgColor={colors.white}
    w="100%"
    p={6}
    borderRadius="lg"
    boxShadow="sm"
    spacing={4}
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} height="18px" />
    ))}
    <Skeleton height="200px" borderRadius="md" />
  </Stack>
);

const Statistics = dynamic(
  () =>
    import('@components/func/lists/Statistic').then((mod) => mod.Statistics),
  { ssr: false, loading: () => <StatisticsFallback /> }
);

const UserDataSet = dynamic(
  () =>
    import('@components/common/reports/user_data_set').then(
      (mod) => mod.UserDataSet
    ),
  { ssr: false, loading: () => <TableFallback /> }
);

const DIRECTORIAL_ROLES = [
  ROLES.DIRECTEUR_ETABLISSMENT,
  ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
];

export default function Dashboard({ kpis, role, token, userQueryParams = '' }) {
  const t = useTranslations();

  const usersResponse = kpis[0];
  const classesResponse = kpis[1];
  const studentsResponse = kpis[2];
  const teachersResponse = kpis[3];
  const schoolsResponse = kpis[4];

  const cardStats = useMemo(
    () => [
      {
        count: t('pages.stats.amount.users').replace(
          `%number`,
          usersResponse?.meta?.pagination?.total ?? usersResponse?.length ?? 0
        ),
        icon: <FaUser color={colors.primary.regular} size={25} />,
        title: t('pages.stats.users'),
      },
      {
        count: t('pages.stats.amount.classes').replace(
          `%number`,
          classesResponse?.meta?.pagination?.total ??
            classesResponse?.data?.length ??
            0
        ),
        icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
        title: t('pages.stats.classes'),
      },
      {
        count: t('pages.stats.amount.students').replace(
          `%number`,
          studentsResponse?.meta?.pagination?.total ??
            studentsResponse?.data?.length ??
            0
        ),
        icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
        title: t('pages.stats.students'),
      },
      {
        count: t('pages.stats.amount.teachers').replace(
          `%number`,
          teachersResponse?.meta?.pagination?.total ??
            teachersResponse?.data?.length ??
            0
        ),
        icon: <FaSuitcase color={colors.primary.regular} size={25} />,
        title: t('pages.stats.teachers'),
      },
      // directorial cant see schools
      ...(DIRECTORIAL_ROLES.includes(role.name)
        ? []
        : [ 
      {
        count: t('pages.stats.amount.schools').replace(
          `%number`,
          schoolsResponse?.meta?.pagination?.total ??
            schoolsResponse?.data?.length ??
            0
        ),
        icon: <LuSchool color={colors.primary.regular} size={25} />,
        title: t('pages.stats.schools'),
      },
      ]),
    ],
    [
      classesResponse,
      schoolsResponse,
      studentsResponse,
      teachersResponse,
      t,
      usersResponse,
    ]
  );

  const users = mapUsersDataTable({ users: usersResponse });
  const userPagination = usersResponse?.meta?.pagination || null;
  const baseUsersRoute = `${routes.api_route.alazhar.get.users.all}?populate=*&sort=createdAt:desc${userQueryParams}`;
  // take all schools with only their name, id, and type for
  const schools = (schoolsResponse?.data || []).map((school) => ({
    name: school.attributes.name,
    id: school.id,
  }));
  const { USER_COLUMNS } = useTableColumns();
  return (
    <DashboardLayout
      title={t('pages.dashboard.initial.title')}
      currentPage={t('components.menu.users')}
      role={role}
      token={token}
    >
      <Wrap mt={10} spacing={20.01}>
        <HStack w={'100%'}>
          <Statistics cardStats={cardStats} />
        </HStack>
        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight={'700'}
          pt={10}
        >
          {t('components.dataset.users.title')}
        </Text>

        <Stack bgColor={colors.white} w={'100%'}>
          <UserDataSet
            {...{ role, token }}
            data={users}
            initialPagination={userPagination}
            baseRoute={baseUsersRoute}
            columns={USER_COLUMNS}
            schools={schools}
          />
        </Stack>
      </Wrap>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  if (!token) {
    return {
      redirect: {
        destination: 'user/auth',
        permanent: false,
      },
    };
  }

  const {
    alazhar: {
      get: {
        me,
        classes: { allWithoutSchoolId: classrooms },
        students: { allWithoutSchoolId: allStudents },
        teachers: { all: allTeachers },
        schools: { all: allSchools },
        users: { all: allUsers },
      },
    },
  } = routes.api_route;

  const currentUser = await serverFetch({
    uri: me,
    user_token: token,
  });

  const role = currentUser.role;
  const userSchoolId = currentUser.school?.id;

  const defaultPageSize = DEFAULT_ROWS_PER_PAGE;
  const userBaseRoute = userSchoolId
    ? `${allUsers}?filters[school][id][$eq]=${userSchoolId}&`
    : `${allUsers}?`;

    const classroomBaseRoute = userSchoolId
    ? `${classrooms}&filters[school][id][$eq]=${userSchoolId}`
    : `${classrooms}`;

    const studentsBaseRoute = userSchoolId
      ? `${allStudents}&filters[class][school][id][$eq]=${userSchoolId}`
      : `${allStudents}`;
      const teachersBaseRoute = userSchoolId
      ? `${allTeachers}?filters[school][id][$eq]=${userSchoolId}`
      : `${allTeachers}`;
  const [
    usersResponse,
    classesResponse,
    studentsResponse,
    teachersResponse,
    schoolsResponse,
  ] = await Promise.all([
    serverFetch({
      uri: `${userBaseRoute}populate=*&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=${defaultPageSize}`,
      user_token: token,
      cacheTtl: 5 * 60 * 1000,
    }),
    serverFetch({
      uri: classroomBaseRoute.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
      cacheTtl: 5 * 60 * 1000,
    }),
    serverFetch({
      uri: studentsBaseRoute.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
      cacheTtl: 5 * 60 * 1000,
    }),
    serverFetch({
      uri: teachersBaseRoute + '?sort=createdAt:desc&populate=school',
      user_token: token,
      cacheTtl: 5 * 60 * 1000,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: allSchools,
      user_token: token,
      cacheTtl: 5 * 60 * 1000,
    }).catch(() => ({ data: [] })),
  ]);
  console.log('userresponses', usersResponse.length, 'token', token);

  const isEstablishmentDirector = DIRECTORIAL_ROLES.includes(role?.name);
  const allowedUserRoles = [
    ROLES.SURVEILLANT_GENERAL,
    ROLES.ADJOINT_SURVEILLANT_GENERAL,
    ROLES.CAISSIER,
    ROLES.ADJOINT_CAISSIER,
  ];

  const schoolFilterQuery =
    isEstablishmentDirector && userSchoolId
      ? `&filters[school][id][$eq]=${userSchoolId}`
      : '';

  const roleFilterQuery =
    isEstablishmentDirector && allowedUserRoles.length
      ? allowedUserRoles
          .map(
            (roleName, idx) =>
              `&filters[$or][${idx}][role][name][$eq]=${encodeURIComponent(roleName)}`
          )
          .join('')
      : '';

  const usersQueryParams = `${schoolFilterQuery}${roleFilterQuery}`;

  const matchesSchool = (entitySchool) => {
    if (!userSchoolId || !entitySchool) {
      return false;
    }
    if (typeof entitySchool === 'number') {
      return entitySchool === userSchoolId;
    }
    if (entitySchool.id) {
      return entitySchool.id === userSchoolId;
    }
    if (entitySchool.data?.id) {
      return entitySchool.data.id === userSchoolId;
    }
    return false;
  };

  const getRoleName = (userRole) => {
    if (!userRole) return undefined;
    if (userRole.name) return userRole.name;
    if (userRole.data?.attributes?.name) return userRole.data.attributes.name;
    return undefined;
  };

  const filteredUsers = (() => {
    if (!isEstablishmentDirector || !usersResponse?.data) {
      return usersResponse;
    }

    const filteredData = usersResponse.data.filter(
      (user) =>
        allowedUserRoles.includes(getRoleName(user.role)) &&
        matchesSchool(user.school)
    );

    const pageSize =
      usersResponse.meta?.pagination?.pageSize || DEFAULT_ROWS_PER_PAGE;

    return {
      ...usersResponse,
      data: filteredData,
      meta: {
        ...(usersResponse.meta || {}),
        pagination: {
          ...(usersResponse.meta?.pagination || {}),
          total: filteredData.length,
          pageCount: Math.max(1, Math.ceil(filteredData.length / pageSize)),
        },
      },
    };
  })();

  const filteredTeachers =
    isEstablishmentDirector && teachersResponse?.data
      ? {
          ...teachersResponse,
          data: teachersResponse.data.filter((teacher) =>
            matchesSchool(teacher.attributes?.school)
          ),
        }
      : teachersResponse;

  const filteredSchools =
    isEstablishmentDirector && schoolsResponse?.data
      ? {
          ...schoolsResponse,
          data: schoolsResponse.data.filter((school) => matchesSchool(school)),
        }
      : schoolsResponse;

  return {
    props: {
      kpis: [
        filteredUsers,
        classesResponse,
        studentsResponse,
        filteredTeachers,
        filteredSchools,
      ],
      role,
      token,
      userQueryParams: usersQueryParams,
    },
  };
};
