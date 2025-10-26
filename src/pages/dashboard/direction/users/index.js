import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { UserDataSet } from '@components/common/reports/user_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ROLES } from '@utils/roles';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapUsersDataTable } from '@utils/mappers/user';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { FaSuitcase, FaUser } from 'react-icons/fa'; // icon for user
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';


const DIRECTORIAL_ROLES = [
  ROLES.DIRECTEUR_ETABLISSMENT,
  ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
];

export default function Dashboard({ kpis, role, token }) {
  const t = useTranslations();

  const cardStats = [
    {
      count: t('pages.stats.amount.users').replace(
        `%number`,
        kpis[0]?.length ?? 0
      ),
      icon: <FaUser color={colors.primary.regular} size={25} />,
      title: t('pages.stats.users'),
    },
    {
      count: t('pages.stats.amount.classes').replace(
        `%number`,
        kpis[1]?.data?.length ?? 0
      ),
      icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
      title: t('pages.stats.classes'),
    },
    {
      count: t('pages.stats.amount.students').replace(
        `%number`,
        kpis[2]?.data?.length ?? 0
      ),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: t('pages.stats.students'),
    },
    {
      count: t('pages.stats.amount.teachers').replace(
        `%number`,
        kpis[3]?.data?.length ?? 0
      ),
      icon: <FaSuitcase color={colors.primary.regular} size={25} />,
      title: t('pages.stats.teachers'),
    },
    {
      count: t('pages.stats.amount.schools').replace(
        `%number`,
        kpis[4]?.data?.length ?? 0
      ),
      icon: <LuSchool color={colors.primary.regular} size={25} />,
      title: t('pages.stats.schools'),
    },
  ];

  // Map the fetched users data to the desired shape.
  const users = mapUsersDataTable({ users: kpis[0] });
  // take all schools with only their name, id, and type for
  const schools = (kpis[4]?.data || []).map((school) => ({
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

  const [
    usersResponse,
    classesResponse,
    studentsResponse,
    teachersResponse,
    schoolsResponse,
  ] = await Promise.all([
    serverFetch({
      uri: `${allUsers}?populate=*&sort=createdAt:desc`,
      user_token: token,
    }),
    serverFetch({
      uri: classrooms.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
    }),
    serverFetch({
      uri: allStudents.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
    }),
    serverFetch({
      uri: allTeachers + '?sort=createdAt:desc&populate=school',
      user_token: token,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: allSchools,
      user_token: token,
    }).catch(() => ({ data: [] })),
  ]);

  const isEstablishmentDirector = DIRECTORIAL_ROLES.includes(role?.name);
  const allowedUserRoles = [
    ROLES.SURVEILLANT_GENERAL,
    ROLES.ADJOINT_SURVEILLANT_GENERAL,
    ROLES.CAISSIER,
    ROLES.ADJOINT_CAISSIER,
  ];

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

  const filteredUsers =
    isEstablishmentDirector && Array.isArray(usersResponse)
      ? usersResponse.filter(
          (user) =>
            allowedUserRoles.includes(getRoleName(user.role)) &&
            matchesSchool(user.school)
        )
      : usersResponse;

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
    },
  };
};
