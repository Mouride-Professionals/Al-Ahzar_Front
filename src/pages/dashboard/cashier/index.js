import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports/student_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { HiAcademicCap } from 'react-icons/hi';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

export default function Dashboard({ kpis, role, token, schoolId }) {
  const t = useTranslations();

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
    // Add more stats as needed, using t('pages.stats.teachers') etc.
  ];

const {  STUDENTS_COLUMNS } = useTableColumns();
  const students = mapStudentsDataTableForEnrollments({ enrollments: kpis[1] });
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
