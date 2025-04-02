import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { RegistrationCard } from '@components/common/cards';
import { ResubscribeForm } from '@components/forms/student/enrollmentForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';

const {
  components: {
    cards: {
      student: { confirmation, registration, another_student, info },
    },
  },
  pages: {
    dashboard: {
      students: { title: resubscribeTitle },
    },
  },
  components: { menu: { resubscribe: menuResubscribe } },
} = messages;

export default function Resubscribe({ student, role, token }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const router = useRouter();

  if (hasSucceeded) {
    return (
      <DashboardLayout
        title="Resubscribe Student"
        currentPage="Resubscribe"
        role={role}
        token={token}
      >
        <Text>Student resubscribed successfully!</Text>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={resubscribeTitle}
      currentPage={menuResubscribe}
      role={role}
      token={token}
    >
      <VStack
        borderStyle="solid"
        border={1}
        borderColor={colors.gray.regular}
        mt={10}
        w="100%"
      >
        <HStack
          _hover={{ cursor: 'pointer' }}
          onClick={() => router.back()}
          alignItems="center"
          px={5}
          bgColor={colors.secondary.light}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          h={90}
          w="100%"
        >
          <BsArrowLeftShort size={40} />
          <Text fontSize={20} fontWeight="700">
            {hasSucceeded ? confirmation : registration}
          </Text>
        </HStack>
        <Stack
          bgColor={colors.white}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          w="100%"
          minH="35rem"
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
            <ResubscribeForm
              student={student}
              token={token}
              setHasSucceeded={setHasSucceeded}
            />
          )}
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const { student } = query;

  const { role = null } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  // Fetch subscription details or plan data for resubscription.
  const studentDetails = await serverFetch({
    uri: routes.api_route.alazhar.get.students.detail.replace('%id', student),
    user_token: token,
  });

  return {
    props: {
      role,
      token,
      student: studentDetails,
    },
  };
};