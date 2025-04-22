import { Stack, Text } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports/student_data_set';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { STUDENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapStudentsDataTable, mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

const mapDetail = (payload) => ({
  school: payload.school.data.attributes.name,
  _class: `${payload.level} ${payload.letter}`,
  students: mapStudentsDataTableForEnrollments({
    enrollments: {
      ...payload.enrollments,
      defaultLevel: `${payload.level} ${payload.letter}`,
    },
  }),
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

export default function Class({ detail, role, token }) {
  const { school, _class, students } = mapDetail(detail.data.attributes);

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
        <DataSet role={role} data={students} columns={STUDENTS_COLUMNS} />
      </Stack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ query, req }) => {
  const { classId: id } = query;

  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const { role } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const detail = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.detail.replace('%id', id),
    user_token: token,
  });
//  const classes= await serverFetch({
//     uri: classrooms.replace('%activeSchoolYear', activeSchoolYear).replace('%schoolId', response.school?.id),
//     user_token: token,
//   });


  return {
    props: {
      detail,
      role,
      token,
    },
  };
};
