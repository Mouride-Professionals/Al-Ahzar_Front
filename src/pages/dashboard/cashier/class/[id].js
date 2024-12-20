import { Stack, Text } from '@chakra-ui/react';
import { DataSet } from '@components/common/reports';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { STUDENTS_COLUMNS } from '@utils/mappers/kpi';
import { mapStudentsDataTable } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { serverFetch } from 'src/lib/api';

const mapDetail = (payload) => ({
  school: payload.etablissement.data.attributes.name,
  _class: `${payload.level} ${payload.letter}`,
  students: mapStudentsDataTable({
    students: {
      ...payload.eleves,
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

export default function Class({ detail, role }) {
  const { school, _class, students } = mapDetail(detail.data.attributes);

  return (
    <DashboardLayout
      title={establishment.replace('%name', `${school} - ${_class}`)}
      currentPage={menu.classes}
      role={role}
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
  const { id } = query;

  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const response = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  })

  const role  = response.role
  console.log("roled", response);


  const detail = await serverFetch({
    uri: routes.api_route.alazhar.get.class.detail.replace('%id', id),
    user_token: token,
  });

  return {
    props: {
      detail,
      role,
    },
  };
};
