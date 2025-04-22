import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { SchoolYearDataSet } from '@components/common/reports/school_year_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { SCHOOL_YEAR_COLUMNS } from '@utils/mappers/kpi';
import { mapSchoolYearsDataTable } from '@utils/mappers/school_year';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { Suspense } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const {
  pages: {
    dashboard,
    stats: {
      classes,
      students: studentsStat,
      teachers: teachersStat,
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
  const cardStats = [
    {
      count: amount.classes.replace(`%number`, kpis[0]?.data?.length),
      icon: <SiGoogleclassroom color={colors.primary.regular} size={25} />,
      title: classes,
    },
    {
      count: amount.students.replace(`%number`, kpis[1]?.data?.length),
      icon: <HiAcademicCap color={colors.primary.regular} size={25} />,
      title: studentsStat,
    },
    {
      count: amount.teachers.replace(`%number`, kpis[2]?.data?.length ?? 0),
      icon: <FaSuitcase color={colors.primary.regular} size={25} />,
      title: teachersStat,
    },
    {
      count: amount.schools.replace(`%number`, kpis[3]?.data?.length),
      icon: <LuSchool color={colors.primary.regular} size={25} />,
      title: schoolsStat,
    },
  ];

  const schoolYears = mapSchoolYearsDataTable({ schoolYears: kpis[4] });

  return (
    <DashboardLayout
      title={dashboard.initial.title}
      currentPage={menu.classes}
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
          {schoolsDataset.title}
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
