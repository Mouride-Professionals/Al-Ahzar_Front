import { HStack, Skeleton, Stack, Text, Wrap } from '@chakra-ui/react';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapTeachersDataTable } from '@utils/mappers/teacher';
import { ROLES, getAllowedSchools } from '@utils/roles';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const StatisticsFallback = () => (
  <HStack w="100%">
    <Stack direction={{ base: 'column', md: 'row' }} spacing={6} w="100%">
      {Array.from({ length: 4 }).map((_, index) => (
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

const TeacherDataSet = dynamic(
  () =>
    import('@components/common/reports/teacher_data_set').then(
      (mod) => mod.TeacherDataSet
    ),
  { ssr: false, loading: () => <TableFallback /> }
);

const DIRECTORIAL_ROLES = [
  ROLES.DIRECTEUR_ETABLISSMENT,
  ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
];

export default function Dashboard({ kpis, role, token }) {
  const t = useTranslations();

  const teachersResponse = kpis[0];
  const classesResponse = kpis[1];
  const studentsResponse = kpis[2];
  const schoolsResponse = kpis[3];

  // Get columns from the hook
  const { TEACHERS_COLUMNS } = useTableColumns();

  // Memoized statistics cards
  const cardStats = useMemo(
    () => [
      {
        count: t('pages.stats.amount.classes').replace(
          '%number',
          classesResponse?.meta?.pagination?.total ??
            classesResponse?.data?.length ??
            0
        ),
        icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
        title: t('pages.stats.classes'),
      },
      {
        count: t('pages.stats.amount.students').replace(
          '%number',
          studentsResponse?.meta?.pagination?.total ??
            studentsResponse?.data?.length ??
            0
        ),
        icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
        title: t('pages.stats.students'),
      },
      {
        count: t('pages.stats.amount.teachers').replace(
          '%number',
          teachersResponse?.meta?.pagination?.total ??
            teachersResponse?.data?.length ??
            0
        ),
        icon: <FaSuitcase color={colors.primary.regular} size={25} />,
        title: t('pages.stats.teachers'),
      },
      {
        count: t('pages.stats.amount.schools').replace(
          '%number',
          schoolsResponse?.meta?.pagination?.total ??
            schoolsResponse?.data?.length ??
            0
        ),
        icon: <LuSchool color={colors.primary.regular} size={25} />,
        title: t('pages.stats.schools'),
      },
    ],
    [classesResponse, studentsResponse, teachersResponse, schoolsResponse, t]
  );
  const teachers = mapTeachersDataTable({ teachers: teachersResponse });
  const teacherPagination = teachersResponse?.meta?.pagination || null;
  const baseTeachersRoute = `${routes.api_route.alazhar.get.teachers.all}?sort=createdAt:desc&populate=school`;

  const schools = (schoolsResponse?.data || []).map((school) => ({
    name: school.attributes.name,
    id: school.id,
  }));

  return (
    <DashboardLayout
      title={t('pages.dashboard.initial.title')}
      currentPage={t('components.menu.classes')}
      role={role}
      token={token}
    >
      <Wrap mt={10} spacing={20.01}>
        <HStack w="100%">
          <Statistics cardStats={cardStats} />
        </HStack>
        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight="700"
          pt={10}
        >
          {t('components.dataset.teachers.title')}
        </Text>
        <Stack bgColor={colors.white} w="100%">
          <TeacherDataSet
            {...{ role, token }}
            data={teachers}
            initialPagination={teacherPagination}
            baseRoute={baseTeachersRoute}
            schools={schools}
            columns={TEACHERS_COLUMNS}
          />
        </Stack>
      </Wrap>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });

  const token = session?.accessToken; // Ensure token exists in session
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
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });
  const role = response.role;
  const userSchoolId = response.school?.id;

  const countQuery = '&pagination[page]=1&pagination[pageSize]=1&fields[0]=id';

  const [teachersResponse, classesResponse, studentsResponse, schoolsResponse] =
    await Promise.all([
      serverFetch({
        uri: `${allTeachers}?sort=createdAt:desc&populate=school&pagination[page]=1&pagination[pageSize]=50`,
        user_token: token,
        cacheTtl: 5 * 60 * 1000,
      }).catch(() => ({ data: [] })),
      serverFetch({
        uri: `${classrooms.replace('%activeSchoolYear', activeSchoolYear)}${countQuery}`,
        user_token: token,
        cacheTtl: 5 * 60 * 1000,
      }),
      serverFetch({
        uri: `${allStudents.replace('%activeSchoolYear', activeSchoolYear)}${countQuery}`,
        user_token: token,
        cacheTtl: 5 * 60 * 1000,
      }),
      serverFetch({
        uri: allSchools,
        user_token: token,
        cacheTtl: 5 * 60 * 1000,
      }).catch(() => ({ data: [] })),
    ]);

  const isEstablishmentDirector = DIRECTORIAL_ROLES.includes(role?.name);

  const filteredTeachers = isEstablishmentDirector
    ? {
        ...teachersResponse,
        data: (teachersResponse?.data || []).filter(
          (teacher) => teacher.attributes?.school?.data?.id === userSchoolId
        ),
      }
    : teachersResponse;

  const filteredSchools = isEstablishmentDirector
    ? {
        ...schoolsResponse,
        data: getAllowedSchools(
          role?.name,
          userSchoolId,
          schoolsResponse?.data || []
        ),
      }
    : schoolsResponse;

  return {
    props: {
      kpis: [
        teachersResponse,
        classesResponse,
        studentsResponse,
        filteredSchools,
      ],
      role,
      token,
    },
  };
};
