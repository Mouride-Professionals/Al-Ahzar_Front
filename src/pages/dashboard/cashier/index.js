import { HStack, Skeleton, Stack, Text, Wrap } from '@chakra-ui/react';
import { DashboardLayout } from '@components/layout/dashboard';
import { DEFAULT_ROWS_PER_PAGE } from '@constants/pagination';
import { colors, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { HiAcademicCap } from 'react-icons/hi';
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

const DataSetFallback = () => (
  <Stack
    bgColor={colors.white}
    w="100%"
    p={6}
    borderRadius="lg"
    boxShadow="sm"
    spacing={4}
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} height="20px" />
    ))}
    <Skeleton height="200px" borderRadius="md" />
  </Stack>
);

const Statistics = dynamic(
  () =>
    import('@components/func/lists/Statistic').then((mod) => mod.Statistics),
  { ssr: false, loading: StatisticsFallback }
);

const DataSet = dynamic(
  () =>
    import('@components/common/reports/student_data_set').then(
      (mod) => mod.DataSet
    ),
  { ssr: false, loading: DataSetFallback }
);

export default function Dashboard({ kpis, role, token, schoolId }) {
  const t = useTranslations();

  const cardStats = [
    {
      count: t('pages.stats.amount.classes').replace(
        '%number',
        kpis[0]?.meta?.pagination?.total ?? kpis[0]?.data?.length ?? 0
      ),
      icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
      title: t('pages.stats.classes'),
    },
    {
      count: t('pages.stats.amount.students').replace(
        '%number',
        kpis[1]?.meta?.pagination?.total ?? kpis[1]?.data?.length ?? 0
      ),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: t('pages.stats.students'),
    },
    // Add more stats as needed, using t('pages.stats.teachers') etc.
  ];

  const { STUDENTS_COLUMNS } = useTableColumns();
  const studentsResponse = kpis[1];
  console.log('class response:', kpis[0]);

  const students = mapStudentsDataTableForEnrollments({
    enrollments: studentsResponse,
  });
  const studentPagination = studentsResponse?.meta?.pagination || null;
  const classrooms = kpis[0]?.data?.map((classroom) => ({
    id: classroom.id,
    cycle: classroom.attributes.cycle,
    level: classroom.attributes.level,
    letter: classroom.attributes.letter,
  }));
  return (
    <DashboardLayout
      title={t('pages.dashboard.initial.title')}
      currentPage={t('components.menu.home')}
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
          {t('components.dataset.students.title')}
        </Text>

        <Stack bgColor={colors.white} w={'100%'}>
          <DataSet
            {...{ role, token, schoolId }}
            data={students}
            initialPagination={studentPagination}
            columns={STUDENTS_COLUMNS}
            classrooms={classrooms}
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
        classes: { all: classrooms },
        students: { all: allStudents },
        teachers: { all: teachers },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });

  const role = response.role;

  const cacheTtlMs = 5 * 60 * 1000; // cache classrooms & students for 5 minutes
  const enrollmentPageSize = DEFAULT_ROWS_PER_PAGE;

  const kpis = await Promise.all([
    serverFetch({
      uri: classrooms
        .replace('%activeSchoolYear', activeSchoolYear)
        .replace('%schoolId', response.school?.id),
      user_token: token,
      cacheTtl: cacheTtlMs,
    }),

    serverFetch({
      uri: `${allStudents.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', response.school?.id)}&pagination[page]=1&pagination[pageSize]=${enrollmentPageSize}`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }),
    serverFetch({
      uri: teachers,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }).catch(() => ({ data: [] })),
  ]);

  return {
    props: {
      kpis,
      role,
      token,
      schoolId: response?.school?.id,
    },
  };
};
