import { Stack, Text } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports/student_data_set';
import { DashboardLayout } from '@components/layout/dashboard';
import { DEFAULT_ROWS_PER_PAGE } from '@constants/pagination';
import { colors, messages, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

const mapDetail = (payload) => ({
  school: payload.school?.data?.attributes?.name ?? '',
  _class: `${payload.level} ${payload.letter}`.trim(),
});

const {
  pages: {
    class: { establishment },
  },
  components: {
    menu,
    dataset: {
      students: { title },
    },
  },
} = messages;

export default function Class({
  detail,
  role,
  token,
  students: initialStudents,
  studentPagination,
  schoolId,
  classId,
}) {
  console.log('detailclass:', detail);

  const { school, _class } = mapDetail(detail.data.attributes);
  const { STUDENTS_COLUMNS } = useTableColumns();
  const classFilter = classId ? `&filters[class][id][$eq]=${classId}` : '';
  return (
    <DashboardLayout
      title={establishment.replace('%name', `${school} - ${_class}`)}
      currentPage={menu.classes}
      role={role}
      token={token}
    >
      <Text
        color={colors.secondary.regular}
        fontSize={20}
        fontWeight={'700'}
        py={5}
      >
        {title}
      </Text>
      <Stack bgColor={colors.white} w={'100%'}>
        <DataSet
          role={role}
          data={initialStudents}
          initialPagination={studentPagination}
          schoolId={schoolId}
          columns={STUDENTS_COLUMNS}
          token={token}
          additionalFilters={classFilter}
        />
      </Stack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ query, req, res }) => {
  const { id } = query;

  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: 'user/auth',
        permanent: false,
      },
    };
  }

  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const currentUser = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const role = currentUser.role;

  const detail = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.detail.replace('%id', id),
    user_token: token,
  });

  const classroomAttributes = detail?.data?.attributes || {};
  const schoolId =
    classroomAttributes?.school?.data?.id ||
    classroomAttributes?.school?.id ||
    null;

  const defaultLevel =
    `${classroomAttributes?.level ?? ''} ${classroomAttributes?.letter ?? ''}`.trim();

  let studentsResponse = classroomAttributes?.enrollments;
  console.log('schoolIdd:', schoolId, 'activeSchoolYear:', activeSchoolYear);

  if (schoolId && activeSchoolYear) {
    const baseStudentsRoute = routes.api_route.alazhar.get.students.all
      .replace('%activeSchoolYear', activeSchoolYear)
      .replace('%schoolId', schoolId);

    const pageSize = DEFAULT_ROWS_PER_PAGE;

    studentsResponse = await serverFetch({
      uri: `${baseStudentsRoute}&filters[class][id][$eq]=${id}&pagination[page]=1&pagination[pageSize]=${pageSize}`,
      user_token: token,
    }).catch(() => classroomAttributes?.enrollments);
  }

  const students = mapStudentsDataTableForEnrollments({
    enrollments: {
      ...(studentsResponse || {}),
      defaultLevel,
    },
  });

  const studentPagination = studentsResponse?.meta?.pagination || null;

  return {
    props: {
      detail,
      role,
      token,
      students,
      studentPagination,
      schoolId,
      classId: id,
    },
  };
};
