import { Stack, Text, Wrap } from '@chakra-ui/react';
import { SchoolDataSet } from '@components/common/reports/school_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { SCHOOLS_COLUMNS } from '@utils/mappers/kpi';
import { mapSchoolsDataTable } from '@utils/mappers/school';
import { getToken } from 'next-auth/jwt';
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
      title: teachers,
    },
    {
      count: amount.schools.replace(`%number`, kpis[3]?.data?.length),
      icon: <LuSchool color={colors.primary.regular} size={25} />,
      title: schoolsStat,
    },
  ];

  const schools = mapSchoolsDataTable({ schools: kpis[3] });

  return (
      <DashboardLayout
        title={dashboard.initial.title}
        currentPage={menu.classes}
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
            {schoolsDataset.title}
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

export const getServerSideProps = async ({ req }) => {
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

  const {
    alazhar: {
      get: {
        me,
        class: { all: classrooms },
        students: { all: allStudents },
        teachers,
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
      uri: classrooms.split('pageSize')[0],
      user_token: token,
    }),

    serverFetch({
      uri: allStudents,
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
  ]);

  return {
    props: {
      kpis,
      role,
      token,
    },
  };
};
