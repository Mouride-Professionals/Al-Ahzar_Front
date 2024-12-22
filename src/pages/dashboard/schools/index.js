import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { CreateSchoolForm } from '@components/forms/school/create';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { SiGooglescholar } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const {
  pages: { dashboard },
  components: {
    menu,
    schoolList: { createSchool, viewDetails },
  },
} = messages;

export default function Schools({ schools, role, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const handleSchoolClick = (schoolId) => {
    router.push(
      routes.page_route.dashboard.schools.classes.replace('%id', schoolId)
    );
  };

  return (
    <DashboardLayout
      title={dashboard.schools.title}
      currentPage={menu.schools}
      role={role}
    >
      {/* Modal for creating a school */}
      <Modal size={'2xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={colors.secondary.light}>
            <HStack>
              <SiGooglescholar color={colors.secondary.regular} size={25} />
              <Text>{createSchool}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateSchoolForm
              token={token}
              onSuccess={() => {
                onClose();
                // Reload or fetch schools again to update the list
              }}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* School list */}
      <VStack spacing={6} align="stretch">
        {schools.map((school) => (
          <Box
            key={school.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={colors.white}
            p={6}
            shadow="sm"
            cursor="pointer"
            onClick={() => handleSchoolClick(school.id)}
          >
            <HStack justifyContent="space-between">
              <HStack>
                <SiGooglescholar size={30} color={colors.primary.regular} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold">
                    {school.name}
                  </Text>
                  <Text fontSize="sm" color={colors.secondary.regular}>
                    Catégorie: {school.type || 'N/A'}
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => alert(`View details for ${school.name}`)}
              >
                {viewDetails}
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Button
        mt={8}
        size="lg"
        colorScheme="teal"
        onClick={onOpen}
        alignSelf="flex-end"
      >
        {createSchool}
      </Button>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;

  const {
    alazhar: {
      get: {
        me,
        schools: { all },
      },
    },
  } = routes.api_route;

  const { role } = await serverFetch({
    uri: me,
    user_token: token,
  });

  const { data: schools } = await serverFetch({
    // uri: `${all}?filters[responsible][id][$eq]=${id}&populate=responsible,classes`,
    uri: all,
    user_token: token,
  });

  return {
    props: {
      schools: schools.map((school) => ({
        id: school.id,
        name: school.attributes?.name,
        type: school.attributes?.type,
        // responsible: school.attributes?.responsible,
      })),
      role,
      token,
    },
  };
};
