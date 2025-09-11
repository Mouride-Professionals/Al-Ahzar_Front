import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { SchoolCreationCard } from '@components/common/cards';
import { CreateSchoolForm } from '@components/forms/school/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';


export default function Create({ schools, role, token }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  return (
    <DashboardLayout
      title={t('pages.dashboard.schools.title')}
      currentPage={t('components.menu.schools')}
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
            {t('components.cards.school.creation')}
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
            <SchoolCreationCard
              cta={{
                message: t('components.cards.school.creation'),
                // link: routes.page_route.dashboard.direction.schools.create,
                quickAction: () => setHasSucceeded(false),
              }}
              title={t('components.cards.school.info.success')}
              message={t('components.cards.school.info.message')}
            />
          ) : (
            // router.push(routes.page_route.dashboard.direction.initial)
            <CreateSchoolForm
              {...{
                schools,
                setHasSucceeded,
                token,
              }}
            />
          )}
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const { role = null } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  // fetch all schools with only their name ,id and type
  const schoolsFilterTerms =
    '?fields[0]=name&fields[1]=id&fields[2]=type&filters[type][$in]=Centre&filters[type][$in]=Centre Secondaire';
  const schools = await serverFetch({
    uri: `${routes.api_route.alazhar.get.schools.all}${schoolsFilterTerms}`,
    user_token: token,
  });

  return {
    props: {
      role,
      token: token,
      schools,
    },
  };
};
