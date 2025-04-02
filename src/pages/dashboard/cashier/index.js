import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports/student_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { STUDENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapStudentsDataTable, mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { HiAcademicCap } from 'react-icons/hi';
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
    dataset: { students: studentsDataset, schools: schoolsDataset },
  },
} = messages;

export default function Dashboard({ kpis, role, token,schoolId }) {
  const router = useRouter();

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


  ];


  const students = mapStudentsDataTableForEnrollments({ enrollments: kpis[1] });
  const classrooms = kpis[0]?.data?.map((classroom) => ({
    id: classroom.id,
    cycle: classroom.attributes.cycle,
    level: classroom.attributes.level,
    letter: classroom.attributes.letter,
  }));
  return (
    <DashboardLayout
      title={dashboard.initial.title}
      currentPage={menu.home}
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
          {studentsDataset.title}
        </Text>

        <Stack bgColor={colors.white} w={'100%'}>

          <DataSet
            {...{ role, token, schoolId }}
            data={students}
            columns={STUDENTS_COLUMNS}
            classrooms={classrooms}
          />
        </Stack>
      </Wrap>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req,res }) => {
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

  const kpis = await Promise.all([
    serverFetch({
      uri: classrooms.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', response.school?.id),
      user_token: token,
    }),

    serverFetch({
      uri: allStudents.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', response.school?.id),  
      user_token: token,
    }),
    serverFetch({
      uri: teachers,
      user_token: token,
    }).catch(() => ({ data: [] })),

  ]);

  return {
    props: {
      kpis,
      role,
      token,
      schoolId: response?.school?.id
    },
  };
};
