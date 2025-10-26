import { Stack, Text } from '@chakra-ui/react';
import { ClassEditForm } from '@components/forms/class/edit';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { serverFetch } from 'src/lib/api';

export default function EditClass({ classData, role, token }) {
  const t = useTranslations();
  const router = useRouter();

  const handleCancel = () => {
    router.push(
      routes.page_route.dashboard.surveillant.classes.detail.replace(
        '%id',
        classData.id
      )
    );
  };

  return (
    <DashboardLayout
      title={t('pages.class.editClass').replace(
        '%name',
        `${classData.level} ${classData.letter}`
      )}
      currentPage={t('components.menu.classes')}
      role={role}
      token={token}
    >
      <Stack bgColor={colors.white} w={'100%'} borderRadius={10} p={5}>
        <Text
          color={colors.secondary.regular}
          fontSize={20}
          fontWeight={'700'}
          py={5}
        >
          {t('components.forms.actions.class.edit')}
        </Text>
        <ClassEditForm
          classData={classData}
          token={token}
          action={handleCancel}
        />
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

  const classDetail = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.detail.replace('%id', id),
    user_token: token,
  });

  const classData = {
    id: classDetail.data.id,
    ...classDetail.data.attributes,
  };

  return {
    props: {
      classData,
      role,
      token,
    },
  };
};
