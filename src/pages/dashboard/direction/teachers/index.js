import { HStack, Stack, Text, Wrap } from '@chakra-ui/react';
import { TeacherDataSet } from '@components/common/reports/teacher_data_set';
import { Statistics } from '@components/func/lists/Statistic';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ROLES, getAllowedSchools } from '@utils/roles';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapTeachersDataTable } from '@utils/mappers/teacher';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';
import Loading from '../../loading';

export default function Dashboard({ kpis, role, token }) {
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  // Get columns from the hook
  const { TEACHERS_COLUMNS } = useTableColumns();

  // Internationalized statistics cards
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

  const teachers = mapTeachersDataTable({ teachers: kpis[2] });
  const schools = (kpis[3]?.data || []).map((school) => ({
    name: school.attributes.name,
    id: school.id,
  }));

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <DashboardLayout
      title={t('pages.dashboard.initial.title')}
      currentPage={t('components.menu.classes')}
      role={role}
      token={token}
    >
      <Wrap mt={10} spacing={20.01}>
        <HStack w="100%">
          <Statistics cardStats={cardStats} />
        </HStack>
        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight="700"
          pt={10}
        >
          {t('components.dataset.teachers.title')}
        </Text>
        <Stack bgColor={colors.white} w="100%">
          <TeacherDataSet
            {...{ role, token }}
            data={teachers}
            schools={schools}
            columns={TEACHERS_COLUMNS}
          />
        </Stack>
      </Wrap>
    </DashboardLayout>
  );
}

const DIRECTORIAL_ROLES = [
  ROLES.DIRECTEUR_ETABLISSMENT,
  ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
];

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
        teachers: { all: allTeachers },
        schools: { all: allSchools },
      },
    },
  } = routes.api_route;

  const response = await serverFetch({
    uri: me,
    user_token: token,
  });
  const role = response.role;
  const userSchoolId = response.school?.id;

  const [
    classesResponse,
    studentsResponse,
    teachersResponse,
    schoolsResponse,
  ] = await Promise.all([
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

  const isEstablishmentDirector = DIRECTORIAL_ROLES.includes(role?.name);

  const filteredTeachers = isEstablishmentDirector
    ? {
        ...teachersResponse,
        data: (teachersResponse?.data || []).filter(
          (teacher) =>
            teacher.attributes?.school?.data?.id === userSchoolId
        ),
      }
    : teachersResponse;

  const filteredSchools = isEstablishmentDirector
    ? {
        ...schoolsResponse,
        data: getAllowedSchools(
          role?.name,
          userSchoolId,
          schoolsResponse?.data || []
        ),
      }
    : schoolsResponse;

  return {
    props: {
      kpis: [
        classesResponse,
        studentsResponse,
        filteredTeachers,
        filteredSchools,
      ],
      role,
      token,
    },
  };
};
