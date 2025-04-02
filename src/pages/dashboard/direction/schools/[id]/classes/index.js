import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ClassCreationForm } from '@components/forms/class/create';
import { ClassesList } from '@components/func/lists/Classes';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, messages, routes } from '@theme';
import { mapClassesByLevel } from '@utils/mappers/student';
import Cookies from 'cookies';
import { getToken } from 'next-auth/jwt';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const {
  pages: { dashboard },
  components: {
    menu,
    classList: { grade, intermediate, upperIntermediate, create },
  },
} = messages;

export default function Classes({ classes, role, schoolId, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <DashboardLayout
      title={dashboard.classes.title}
      currentPage={menu.classes}
      role={role}
      token={token}
    >
      <Modal size={'2xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={colors.secondary.light}>
            <HStack>
              <SiGoogleclassroom color={colors.secondary.regular} size={25} />
              <Text>{create}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ClassCreationForm
              action={onClose}
              school={schoolId}
              {...{
                token,
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      

      <ClassesList
        schoolId={schoolId}
        groupName={grade}
        classes={classes}
        listOf={'grade'}
        role={role}
        withCreation
        action={onOpen}
      />

      <ClassesList
        schoolId={schoolId}
        groupName={intermediate}
        classes={classes}
        listOf={'intermediate'}
        role={role}
      />

      <ClassesList
        schoolId={schoolId}
        groupName={upperIntermediate}
        classes={classes}
        listOf={'upperIntermediate'}
        role={role}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req,res, query }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const { id: idSchool } = query;
  const activeSchoolYear = new Cookies(req, res).get('selectedSchoolYear');

  const {
    alazhar: {
      get: {
        me,
        classes: {all: classrooms },
      },
    },
  } = routes.api_route;

  const { id, role } = await serverFetch({
    uri: me,
    user_token: token,
  });

  const classesData = await serverFetch({
    uri: classrooms.replace('%schoolId', idSchool).replace('%activeSchoolYear', activeSchoolYear),
    user_token: token,
  });

  const classes = mapClassesByLevel({
    classes: classesData,
  });

  return {
    props: {
      schoolId: idSchool || null,
      classes,
      role,
      token,
    },
  };
};
