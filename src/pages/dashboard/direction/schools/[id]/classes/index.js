import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BackButton } from '@components/common/navigation/BackButton';
import { DashboardLayout } from '@components/layout/dashboard';
import { colors, routes } from '@theme';
import { ensureActiveSchoolYear } from '@utils/helpers/serverSchoolYear';
import { mapClassesByLevel } from '@utils/mappers/student';
import { getToken } from 'next-auth/jwt';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { SiGoogleclassroom } from 'react-icons/si';
import { serverFetch } from 'src/lib/api';

const ClassFormFallback = () => (
  <Stack spacing={4} p={4}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} height="60px" />
    ))}
  </Stack>
);

const ClassListFallback = () => (
  <Stack spacing={4} w="100%">
    <Skeleton height="40px" />
    <Skeleton height="200px" />
  </Stack>
);

const ClassCreationForm = dynamic(
  () =>
    import('@components/forms/class/create').then(
      (mod) => mod.ClassCreationForm
    ),
  { ssr: false, loading: () => <ClassFormFallback /> }
);

const ClassesList = dynamic(
  () => import('@components/func/lists/Classes').then((mod) => mod.ClassesList),
  { ssr: false, loading: () => <ClassListFallback /> }
);

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
      <BackButton mb={4} />
      <Modal
        size={{ base: 'full', md: '2xl' }}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
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
              token={token}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <ClassesList
        schoolId={schoolId}
        groupName={t('components.classList.grade')}
        classes={classes}
        listOf={'grade'}
        role={role}
        withCreation
        action={onOpen}
      />

      <ClassesList
        schoolId={schoolId}
        groupName={t('components.classList.intermediate')}
        classes={classes}
        listOf={'intermediate'}
        role={role}
      />

      <ClassesList
        schoolId={schoolId}
        groupName={t('components.classList.upperIntermediate')}
        classes={classes}
        listOf={'upperIntermediate'}
        role={role}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ req, res, query }) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req, secret });
  const token = session?.accessToken;
  const { id: idSchool } = query;
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

  const { role } = await serverFetch({
    uri: me,
    user_token: token,
  });

  const classesData = await serverFetch({
    uri: classrooms
      .replace('%schoolId', idSchool)
      .replace('%activeSchoolYear', activeSchoolYear),
    user_token: token,
    cacheTtl: 5 * 60 * 1000,
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
