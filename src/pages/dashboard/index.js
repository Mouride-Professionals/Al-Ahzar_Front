import { Stack, Text, Wrap } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { STUDENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapStudentsDataTable } from '@utils/mappers/student';
import { serverFetch } from 'abstract-core/server';
import { getToken } from 'next-auth/jwt';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool2 } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';

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
      count: amount.teachers.replace(`%number`, kpis[2]?.data?.length),
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
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = `Bearer ${session.name.token}`;

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

  const { role } = await serverFetch({
    uri: me,
    user_token: token,
  });

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

  return {
    props: {
      kpis,
      role,
      token,
    },
  };
};
