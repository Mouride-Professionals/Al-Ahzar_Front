import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { UserDataSet } from '@components/common/reports/user_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapUsersDataTable } from '@utils/mappers/user';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { FaSuitcase, FaUser } from 'react-icons/fa'; // icon for user
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const { components: componentsMessages = {} } = messages;

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
  const schools = kpis[4]?.data?.map((school) => ({
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

  // Fetch the user data from your Strapi endpoint.
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

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });
  const role = response.role;

  const kpis = await Promise.all([
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

  return {
    props: {
      kpis,
      role,
      token,
    },
  };
};
