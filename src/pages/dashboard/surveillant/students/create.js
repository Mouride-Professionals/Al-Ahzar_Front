import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { RegistrationCard } from '@components/common/cards';
import { CreateStudentForm } from '@components/forms/student/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

const {
  components: {
    cards: {
      student: { confirmation, registration, another_student, info },
    },
  },
} = messages;

export default function Create({ classes, role, token ,schoolYear}) {
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const router = useRouter();

  return (
    <DashboardLayout
      title={messages.pages.dashboard.students.title}
      currentPage={messages.components.menu.students.create}
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
            {hasSucceeded ? confirmation : registration}
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
                message: another_student,
                quickAction: () => setHasSucceeded(false),
              }}
              title={info.success}
              message={info.message}
            />
          ) : (
            <CreateStudentForm
              {...{
                classes,
                setHasSucceeded,
                token,
                schoolYear
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
  const activeSchoolYear = new Cookies(req, res).get('selectedSchoolYear');

  const { role ,school } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  const classes = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.all.replace('%schoolId', school?.id).replace('%activeSchoolYear', activeSchoolYear),
    user_token: token,
  });

  return {
    props: {
      role,
      token: token,
      classes,
      schoolYear: activeSchoolYear,
    },
  };
};
