import { Stack, Text, Wrap } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { STUDENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapStudentsDataTable } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { Suspense } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool2 } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';



const {
  pages: {
    dashboard,
    stats: { classes, students: studentsStat, teachers, schools, amount },
  },
  components: {
    menu,
    dataset: { students: studentsDataset },
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
      count: amount.classes.replace(`%number`, kpis[1]?.data?.length),
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
      icon: <LuSchool2 color={colors.primary.regular} size={25} />,
      title: schools,
    },
  ];

  const students = mapStudentsDataTable({ students: kpis[1] });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout
        title={dashboard.initial.title}
        currentPage={menu.classes}
        role={role}
      >
        <Wrap mt={10} spacing={20.01}>
          <Statistics cardStats={cardStats} />

          <Text
            color={colors.secondary.regular}
            fontSize={20}
            fontWeight={'700'}
            pt={10}
          >
            {studentsDataset.title}
          </Text>
          <Stack bgColor={colors.white} w={'100%'}>
            <DataSet
              {...{ role, token }}
              data={students}
              columns={STUDENTS_COLUMNS}
            />
          </Stack>
        </Wrap>
      </DashboardLayout>
    </Suspense>
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
      uri: allSchools,
      user_token: token,
    }).catch(() => ({ data: [] })),
  ]);
  console.log("kpis", kpis);


  return {
    props: {
      kpis,
      role,
      token,
    },
  };
};

