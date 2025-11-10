import { Skeleton, Stack, Text, Wrap } from '@chakra-ui/react';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapSchoolsDataTable } from '@utils/mappers/school';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { FaSuitcase, FaUser } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const StatisticsFallback = () => (
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

const SchoolDataSet = dynamic(
  () =>
    import('@components/common/reports/school_data_set').then(
      (mod) => mod.SchoolDataSet
    ),
  { ssr: false, loading: () => <TableFallback /> }
);

export default function Dashboard({ kpis, role, token }) {
  const t = useTranslations();

  const cardStats = useMemo(
    () => [
      {
        count: t('pages.stats.amount.users').replace(
          `%number`,
          kpis[0]?.meta?.pagination?.total ?? kpis[0]?.length ?? 0
        ),
        icon: <FaUser color={colors.primary.regular} size={25} />,
        title: t('pages.stats.users'),
      },
      {
        count: t('pages.stats.amount.classes').replace(
          `%number`,
          kpis[1]?.meta?.pagination?.total ?? kpis[1]?.data?.length ?? 0
        ),
        icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
        title: t('pages.stats.classes'),
      },
      {
        count: t('pages.stats.amount.students').replace(
          `%number`,
          kpis[2]?.meta?.pagination?.total ?? kpis[2]?.data?.length ?? 0
        ),
        icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
        title: t('pages.stats.students'),
      },
      {
        count: t('pages.stats.amount.teachers').replace(
          `%number`,
          kpis[3]?.meta?.pagination?.total ?? kpis[3]?.data?.length ?? 0
        ),
        icon: <FaSuitcase color={colors.primary.regular} size={25} />,
        title: t('pages.stats.teachers'),
      },
      {
        count: t('pages.stats.amount.schools').replace(
          `%number`,
          kpis[4]?.meta?.pagination?.total ?? kpis[4]?.data?.length ?? 0
        ),
        icon: <LuSchool color={colors.primary.regular} size={25} />,
        title: t('pages.stats.schools'),
      },
    ],
    [kpis, t]
  );

  const schools = useMemo(
    () => mapSchoolsDataTable({ schools: kpis[4] }),
    [kpis]
  );
  const { SCHOOLS_COLUMNS } = useTableColumns();

  return (
    <DashboardLayout
      title={t('pages.dashboard.initial.title')}
      currentPage={t('components.menu.home')}
      role={role}
      token={token}
    >
      <Wrap mt={10} spacing={20.01}>
        <Statistics cardStats={cardStats} />

        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight={'700'}
          pt={10}
        >
          {t('components.dataset.schools.title')}
        </Text>

        <Stack bgColor={colors.white} w={'100%'}>
          <SchoolDataSet
            {...{ role, token }}
            data={schools}
            columns={SCHOOLS_COLUMNS}
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

  if (!token) {
    return {
      redirect: {
        destination: 'user/auth',
        permanent: false,
      },
    };
  }

  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const {
    alazhar: {
      get: {
        me,
        users: { all: allUsers },
        classes: { allWithoutSchoolId: classrooms },
        students: { allWithoutSchoolId: allStudents },
        teachers: { all: teachers },
        schools: { all: allSchools },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });

  const role = response.role;

  const cacheTtlMs = 5 * 60 * 1000;
  const countQuery = '&pagination[page]=1&pagination[pageSize]=1&fields[0]=id';

  const kpis = await Promise.all([
    serverFetch({
      uri: `${allUsers}?sort=createdAt:desc${countQuery}`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }),
    serverFetch({
      uri: `${classrooms
        .replace('%activeSchoolYear', activeSchoolYear)}${countQuery}`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }),

    serverFetch({
      uri: `${allStudents
        .replace('%activeSchoolYear', activeSchoolYear)}${countQuery}`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }),
    serverFetch({
      uri: `${teachers}${countQuery}`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: `${allSchools}?sort=createdAt:desc&populate=responsible,banner`,
      user_token: token,
      cacheTtl: cacheTtlMs,
    }).catch(() => ({ data: [] })),
  ]);
  return {
    props: {
      kpis,
      role,
      token,
    },
  };
};
