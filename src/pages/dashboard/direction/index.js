import { Stack, Text, Wrap } from '@chakra-ui/react';
import { SchoolDataSet } from '@components/common/reports/school_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapSchoolsDataTable } from '@utils/mappers/school';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { FaSuitcase, FaUser } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const {
  pages: {
    dashboard,
    stats: {
      users: usersStat,
      classes,
      students: studentsStat,
      teachers,
      schools: schoolsStat,
      amount,
    },
  },
  components: {
    menu,
    dataset: { schools: schoolsDataset },
  },
} = messages;

export default function Dashboard({ kpis, role, token }) {
  const t = useTranslations();

  const cardStats = [
    {
      count: t('pages.stats.amount.users').replace(`%number`, kpis[0]?.length),
      icon: <FaUser color={colors.primary.regular} size={25} />,
      title: t('pages.stats.users'),
    },
    {
      count: t('pages.stats.amount.classes').replace(`%number`, kpis[1]?.data?.length),
      icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
      title: t('pages.stats.classes'),
    },
    {
      count: t('pages.stats.amount.students').replace(`%number`, kpis[2]?.data?.length),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: t('pages.stats.students'),
    },
    {
      count: t('pages.stats.amount.teachers').replace(`%number`, kpis[3]?.data?.length ?? 0),
      icon: <FaSuitcase color={colors.primary.regular} size={25} />,
      title: t('pages.stats.teachers'),
    },
    {
      count: t('pages.stats.amount.schools').replace(`%number`, kpis[4]?.data?.length),
      icon: <LuSchool color={colors.primary.regular} size={25} />,
      title: t('pages.stats.schools'),
    },
  ];

  const schools = mapSchoolsDataTable({ schools: kpis[4] });
  const {SCHOOLS_COLUMNS} = useTableColumns();

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

  const activeSchoolYear = new Cookies(req, res).get('selectedSchoolYear');

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

  const kpis = await Promise.all([
    serverFetch({
      uri: `${allUsers}?sort=createdAt:desc`,
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
      uri: teachers,
      user_token: token,
    }).catch(() => ({ data: [] })),
    serverFetch({
      uri: `${allSchools}?sort=createdAt:desc&populate=responsible,banner`,
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
