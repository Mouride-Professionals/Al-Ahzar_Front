import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { SchoolYearDataSet } from '@components/common/reports/school_year_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapSchoolYearsDataTable } from '@utils/mappers/school_year';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';
import Loading from '../../loading';

export default function Dashboard({ kpis, role, token }) {
  const t = useTranslations();
  const { SCHOOL_YEAR_COLUMNS } = useTableColumns();

  const cardStats = [
    {
      count: t('pages.stats.amount.classes').replace('%number', kpis[0]?.data?.length ?? 0),
      icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
      title: t('pages.stats.classes'),
    },
    {
      count: t('pages.stats.amount.students').replace('%number', kpis[1]?.data?.length ?? 0),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: t('pages.stats.students'),
    },
    {
      count: t('pages.stats.amount.teachers').replace('%number', kpis[2]?.data?.length ?? 0),
      icon: <FaSuitcase color={colors.primary.regular} size={25} />,
      title: t('pages.stats.teachers'),
    },
    {
      count: t('pages.stats.amount.schools').replace('%number', kpis[3]?.data?.length ?? 0),
      icon: <LuSchool color={colors.primary.regular} size={25} />,
      title: t('pages.stats.schools'),
    },
  ];

  const schoolYears = mapSchoolYearsDataTable({ schoolYears: kpis[4] });

  return (
    <Suspense fallback={<Loading />}>
      <DashboardLayout
        title={t('pages.dashboard.initial.title')}
        currentPage={t('components.menu.school_years')}
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
            {t('components.dataset.schoolYears.title')}
          </Text>

          <Stack bgColor={colors.white} w={'100%'}>
            <Suspense fallback={<div>Loading...</div>}>
              <SchoolYearDataSet
                {...{ role, token }}
                data={schoolYears}
                columns={SCHOOL_YEAR_COLUMNS}
              />
            </Suspense>
          </Stack>
        </Wrap>
      </DashboardLayout>
    </Suspense>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });

  const token = session?.accessToken; // Ensure token exists in session
  const cookies = new Cookies(req, res);
  const activeSchoolYear = cookies.get('selectedSchoolYear');

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
        teachers: { all: teachers },
        schools: { all: allSchools },
        school_years: { all: schoolYears },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });

  const role = response.role;

  const kpis = await Promise.all([
    serverFetch({
      uri: classrooms.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
    }),

    serverFetch({
      uri: allStudents.replace('%activeSchoolYear', activeSchoolYear),
      user_token: token,
    }),
    serverFetch({
      uri: teachers,
      user_token: token,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: `${allSchools}?sort=createdAt:desc&populate=responsible`,
      user_token: token,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: schoolYears,
      user_token: token,
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
