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
import { colors, routes } from '@theme';
import { mapClassesByLevel } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';

export default function Classes({ classes, role, schoolId, token }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations();

  return (
    <DashboardLayout
      title={t('pages.dashboard.classes.title')}
      currentPage={t('components.menu.classes')}
      role={role}
      token={token}
    >
      <Modal size={'2xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={colors.secondary.light}>
            <HStack>
              <SiGoogleclassroom color={colors.secondary.regular} size={25} />
              <Text>{t('components.classList.create')}</Text>
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
        groupName={t('components.classList.grade')}
        classes={classes}
        listOf={'grade'}
        role={role}
        withCreation
        action={onOpen}
      />

      <ClassesList
        groupName={t('components.classList.intermediate')}
        classes={classes}
        listOf={'intermediate'}
        role={role}
      />

      <ClassesList
        groupName={t('components.classList.upperIntermediate')}
        classes={classes}
        listOf={'upperIntermediate'}
        role={role}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const activeSchoolYear =
    (await ensureActiveSchoolYear({ req, res, token })) || '';

  const {
    alazhar: {
      get: {
        me,
        classes: { all: classrooms },
      },
    },
  } = routes.api_route;

  const classroomsPageSize = 100;

  const userResponse = await serverFetch({
    uri: me,
    user_token: token,
  });

  const { role, school: { id: schoolId } } = userResponse;

  const classesResponse = await serverFetch({
    uri: `${classrooms
      .replace('%schoolId', schoolId)
      .replace(
        '%activeSchoolYear',
        activeSchoolYear
      )}&pagination[page]=1&pagination[pageSize]=${classroomsPageSize}`,
    user_token: token,
  });

  const classes = mapClassesByLevel({
    classes: classesResponse,
  });

  return {
    props: {
      schoolId: schoolId,
      classes,
      role,
      token,
    },
  };
};
