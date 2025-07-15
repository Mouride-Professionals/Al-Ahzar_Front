import {
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { DataTableLayout } from '@components/layout/data_table';
import { colors } from '@theme';
import { reportingFilter } from '@utils/mappers/kpi';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PiUserDuotone } from 'react-icons/pi';
import Select from 'react-select';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, schools, token }) => {
  const t = useTranslations('components.dataset.users');
  const router = useRouter();
  const toast = useToast({ position: 'top-right', duration: 3000, isClosable: true });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleAssign = async () => {
    if (!selectedSchool) {
      toast({
        title: t('noSchoolSelected'),
        description: t('pleaseSelectSchool'),
        status: 'warning',
      });
      return;
    }
    try {
      // Example: assign a user to a school.
      const response = await fetch('/api/users/assign', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: data.id, school: selectedSchool }),
      });
      if (response.ok) {
        toast({
          title: t('assignmentSuccess'),
          description: t('assignmentSuccessDesc', {
            school: schools.find((school) => school.id === parseInt(selectedSchool))?.name || '',
          }),
          status: 'success',
        });
        router.refresh();
      } else {
        toast({
          title: t('assignmentFailed'),
          description: t('assignmentFailedDesc'),
          status: 'error',
        });
      }
    } catch (error) {
      toast({
        title: t('errorOccurred'),
        description: t('errorOccurredDesc'),
        status: 'error',
      });
    }
    closeDialog();
  };

  const {
    username,
    firstname,
    lastname,
    email,
    confirmed,
    blocked,
    school,
    role,
  } = data;

  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant={'filled'} w={'100%'}>
          <CardBody>
            <Grid templateColumns={'repeat(3, 1fr)'} columnGap={5}>
              {/* General Information */}
              <GridItem pr={2} borderRight={1} borderRightStyle={'solid'} borderRightColor={'gray.200'}>
                <HStack spacing={5}>
                  <VStack justifyContent={'center'} w={50} h={50} borderRadius={100} borderColor={'orange.500'} borderWidth={1}>
                    <PiUserDuotone color={'orange.500'} size={25} />
                  </VStack>
                  <Stack>
                    <Text fontWeight={'bold'} fontSize={'lg'}>
                      {firstname || username} {lastname ? lastname : ''}
                    </Text>
                    {email && (
                      <Text color={'gray.600'} fontSize={'sm'}>
                        {email}
                      </Text>
                    )}
                    <Text color={'gray.600'} fontSize={'sm'}>
                      {confirmed ? t('confirmed') : t('notConfirmed')} {blocked && `| ${t('blocked')}`}
                    </Text>
                  </Stack>
                </HStack>
              </GridItem>

              {/* School Relations */}
              <GridItem pr={2} borderRight={1} borderRightStyle={'solid'} borderRightColor={'gray.200'}>
                <Stack spacing={4}>
                  {school && (
                    <Text>{t('school')}: {school.name}</Text>
                  )}
                  {!school && (
                    <Text>{t('notAssigned')}</Text>
                  )}
                </Stack>
              </GridItem>

              {/* Additional Account Details */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>{t('accountDetails')}</Text>
                  <Text>{t('username')}: {username}</Text>
                  <Text>{t('status')}: {confirmed ? t('active') : t('inactive')}</Text>
                  <Text>{t('role')}: {role?.name || t('na')}</Text>
                </Stack>
              </GridItem>
            </Grid>

            {/* Action Buttons */}
            <HStack justifyContent={'flex-end'} mt={6}>
              <Button
                onClick={null}
                colorScheme="orange"
                variant="outline"
              >
                {t('edit')}
              </Button>
              {!school && (
                <Button onClick={openDialog} colorScheme="orange" variant="outline">
                  {t('assignSchool')}
                </Button>
              )}
            </HStack>

            {/* Modal for school assignment */}
            <Modal isOpen={isDialogOpen} onClose={closeDialog} zIndex={1500}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  {t('assignToSchool', { name: firstname || username, lastname: lastname || '' })}
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    <strong>{t('currentAssociation')}:</strong> {school?.name || t('none')}
                  </Text>
                  <Select
                    options={schoolOptions}
                    value={schoolOptions.find((option) => option.value === selectedSchool)}
                    onChange={(selectedOption) => setSelectedSchool(selectedOption.value)}
                    placeholder={t('selectSchool')}
                    isSearchable
                  />
                </ModalBody>
                <ModalFooter>
                  <Button onClick={closeDialog} colorScheme="gray" mr={3}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleAssign} colorScheme="orange" isDisabled={!selectedSchool}>
                    {t('confirm')}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

export const UserDataSet = ({ role, data = [], schools, columns, selectedIndex = 0, token }) => {
  const t = useTranslations('components.dataset.users');
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const filtered = useMemo(
    () =>
      reportingFilter({
        data,
        position: selectedIndex,
        needle: filterText,
      }),
    [data, filterText, selectedIndex]
  );
  const router = useRouter();

  const filterFunction = ({ data, needle }) =>
    data.filter(
      (item) =>
        item.username && item.username.toLowerCase().includes(needle.toLowerCase())
    );

  const actionButton = role?.name && (
    <Button
      onClick={() => router.push('/dashboard/direction/users/create')}
      colorScheme={'orange'}
      bgColor={colors.primary.regular}
     
    >
      {t('createUser')}
    </Button>
  );

  return (
    <DataTableLayout
      columns={columns}
      data={filtered}
      role={role}
      token={token}
      translationNamespace="components.dataset.users"
      actionButton={actionButton}
      expandedComponent={(data) =>
        ExpandedComponent({ ...data, schools, token })
      }
      filterFunction={filterFunction}
      defaultSortFieldId="username"
      selectedIndex={selectedIndex}
      paginationProps={{
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 20],
      }}
    />
  );
};
