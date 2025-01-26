import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateSchoolForm } from '@components/forms/school/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

const {
  components: {
    cards: {
      school: { edit, another_school },
    },
  },
} = messages;

export default function Edit({ schoolData, schools, role, token }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const router = useRouter();

  return (
    <DashboardLayout
      title={messages.pages.dashboard.schools.title}
      currentPage={messages.components.menu.schools.edit}
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
            {edit}
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
            router.push(routes.page_route.dashboard.direction.schools.all)
          ) : (
            <CreateSchoolForm
              {...{
                initialValues: schoolData, // Pre-fill the form with the fetched data
                schools,
                setHasSucceeded,
                token,
                isEdit: true, // Add a flag to indicate this is an edit operation
              }}
            />
          )}
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, query }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const { id } = query; // Get the school ID from the query params

  const { role = null } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  // Fetch the school data for the given ID
  const schoolData = await serverFetch({
    uri: `${routes.api_route.alazhar.get.schools.all}/${id}`,
    user_token: token,
  });

  // Fetch the list of schools with only their name, id, and type
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
      schoolData: schoolData?.data || null, // Pre-fill the form with this data
      schools,
    },
  };
};
