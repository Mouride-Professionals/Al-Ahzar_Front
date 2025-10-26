import { HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { CreateStudentForm } from '@components/forms/student/creationForm';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { serverFetch } from 'src/lib/api';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';

const {
  components: {
    cards: {
      student: { modification },
    },
  },
} = messages;

export default function Edit({ student, classes, role, token, schoolYear }) {
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const router = useRouter();
  // Redirect back to dashboard if successfully edited
  if (hasSucceeded) {
    router.back();
  }

  return (
    <DashboardLayout
      title={messages.pages.dashboard.students.title}
      currentPage={messages.components.menu.students.edit}
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
            {modification}
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
          <CreateStudentForm
            {...{
              classes,
              token,
              setHasSucceeded,
              schoolYear,
              initialData: student, // Pass preloaded student data
              isEdit: true, // Indicate edit mode
            }}
          />
        </Stack>
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res, params }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  // Get current school year from cookies or default
  const schoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const { role, school } = await serverFetch({
    uri: routes.api_route.alazhar.get.me,
    user_token: token,
  });

  // Fetch classes data
  const classes = await serverFetch({
    uri: routes.api_route.alazhar.get.classes.all
      .replace('%schoolId', school?.id)
      .replace('%activeSchoolYear', schoolYear),
    user_token: token,
  });

  // Fetch enrollment data by ID (which includes student data)
  const enrollment = await serverFetch({
    uri: routes.api_route.alazhar.get.students.detail.replace('%id', params.id),
    user_token: token,
  });
 

  return {
    props: {
      role: role,
      token: token,
      student: enrollment?.data || null, // Pass enrollment data as 'student' prop
      classes: classes || null,
      schoolYear,
    },
  };
};
