import { Stack, Text } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports/student_data_set';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { useTableColumns } from '@utils/mappers/kpi';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
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

export default function Class({ detail, role, token }) {
  const t = useTranslations();
  const { school, _class, students } = mapDetail(detail.data.attributes);
  const { STUDENTS_COLUMNS } = useTableColumns();
    return(
      <DashboardLayout
        title={t('pages.class.establishment').replace('%name', `${school} - ${_class}`)}
        currentPage={t('components.menu.classes')}
        role={role}
        token={token}
      >
        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight={'700'}
          py={5}
        >
          {t('components.dataset.students.title')}
        </Text>
        <Stack bgColor={colors.white} w={'100%'}>
          <DataSet role={role} data={students} columns={STUDENTS_COLUMNS} />
        </Stack>
      </DashboardLayout>
    );
}

export const getServerSideProps = async ({ query, req }) => {
  const { id } = query;

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

  return {
    props: {
      detail,
      role,
      token,
    },
  };
};
