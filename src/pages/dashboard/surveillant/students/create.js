import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { RegistrationCard } from '@components/common/cards';
import { CreateStudentForm } from '@components/forms/student/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';

export default function Create({ classes, role, token, schoolYear }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  return (
    <DashboardLayout
      title={t('pages.dashboard.students.title')}
      currentPage={t('components.menu.students.create')}
      role={role}
      token={token}
    >
      <VStack
        borderStyle={'solid'}
        border={1}
        borderColor={colors.gray.regular}
        mt={10}
        w={'100%'}
      >
        <HStack
          _hover={{ cursor: 'pointer' }}
          onClick={() => router.back()}
          alignItems={'center'}
          px={5}
          bgColor={colors.secondary.light}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          h={90}
          w={'100%'}
        >
          <BsArrowLeftShort size={40} />
          <Text fontSize={20} fontWeight={'700'}>
            {hasSucceeded
              ? t('components.cards.student.confirmation')
              : t('components.cards.student.registration')}
          </Text>
        </HStack>
        <Stack
          bgColor={colors.white}
          style={{ marginTop: 0 }}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          w={'100%'}
          minH={'35rem'}
        >
          {hasSucceeded ? (
            <RegistrationCard
              cta={{
                message: t('components.cards.student.another_student'),
                quickAction: () => setHasSucceeded(false),
              }}
              title={t('components.cards.student.info.success')}
              message={t('components.cards.student.info.message')}
            />
          ) : (
            <CreateStudentForm
              {...{
                classes,
                setHasSucceeded,
                token,
                schoolYear,
              }}
            />
          )}
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const { role, school } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const classes = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.all
      .replace('%schoolId', school?.id)
      .replace('%activeSchoolYear', activeSchoolYear),
    user_token: token,
  });

  console.log('classes in create', classes);

  return {
    props: {
      role,
      token: token,
      classes,
      schoolYear: activeSchoolYear,
    },
  };
};
