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
  VStack,
} from '@chakra-ui/react';
import { DataTableLayout } from '@components/layout/data_table';
import { colors } from '@theme';
import { mapUsersDataTable } from '@utils/mappers/user';
import { hasPermission } from '@utils/roles';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { PiUserDuotone } from 'react-icons/pi';
import Select from 'react-select';
import { BoxZone } from '../cards/boxZone';
import { fetcher, serverFetch } from 'src/lib/api';
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '@constants/pagination';

const ExpandedComponent = ({ data, schools, token, role: userRole }) => {
  const t = useTranslations('components.dataset.users');
  const router = useRouter();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
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
          title: 'Assignement effectué',
          description:
            "L'utilisateur a bien été assigné à l'ecole" +
            {
              school:
                schools.find((school) => school.id === parseInt(selectedSchool))
                  ?.name || '',
            },
          status: 'success',
        });
        router.refresh();
      } else {
        toast({
          title: 'Assignement echoué',
          description: "Une erreur s'est produite lors de l'assignement",
          status: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Assignement echoué',
        description: 'Une erreur s\'est produite lors de l\'assignement',
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
  const onEdit = () => {
    router.push(`/dashboard/direction/users/${data.id}/edit`);
  };

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant={'filled'} w={'100%'}>
          <CardBody>
            <Grid templateColumns={'repeat(3, 1fr)'} columnGap={5}>
              {/* General Information */}
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={'gray.200'}
              >
                <HStack spacing={5}>
                  <VStack
                    justifyContent={'center'}
                    w={50}
                    h={50}
                    borderRadius={100}
                    borderColor={'orange.500'}
                    borderWidth={1}
                  >
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
                      {confirmed ? t('confirmed') : t('notConfirmed')}{' '}
                      {blocked && `| ${t('blocked')}`}
                    </Text>
                  </Stack>
                </HStack>
              </GridItem>

              {/* School Relations */}
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={'gray.200'}
              >
                <Stack spacing={4}>
                  {school && (
                    <Text>
                      {t('school')}: {school.name}
                    </Text>
                  )}
                  {!school && <Text>{t('notAssigned')}</Text>}
                </Stack>
              </GridItem>

              {/* Additional Account Details */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>{t('accountDetails')}</Text>
                  <Text>
                    {t('username')}: {username}
                  </Text>
                  <Text>
                    {t('status')}: {confirmed ? t('active') : t('inactive')}
                  </Text>
                  <Text>
                    {t('role')}: {role?.name || t('na')}
                  </Text>
                </Stack>
              </GridItem>
            </Grid>

            {/* Action Buttons */}
            <HStack justifyContent={'flex-end'} mt={6}>
              {hasPermission(userRole.name, 'manageUsers') &&
                data.role?.name !== userRole.name && (
                  <Button onClick={onEdit} colorScheme="orange" variant="outline">
                    {t('edit')}
                  </Button>
                )}
              {!school && hasPermission(userRole.name, 'manageUsers') && (
                <Button
                  onClick={openDialog}
                  colorScheme="orange"
                  variant="outline"
                >
                  {t('assignSchool')}
                </Button>
              )}
            </HStack>

            {/* Modal for school assignment */}
            <Modal isOpen={isDialogOpen} onClose={closeDialog} zIndex={1500}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  {t('assignToSchool', {
                    name: firstname || username,
                    lastname: lastname || '',
                  })}
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    <strong>{t('currentAssociation')}:</strong>{' '}
                    {school?.name || t('none')}
                  </Text>
                  <Select
                    options={schoolOptions}
                    value={schoolOptions.find(
                      (option) => option.value === selectedSchool
                    )}
                    onChange={(selectedOption) =>
                      setSelectedSchool(selectedOption.value)
                    }
                    placeholder={t('selectSchool')}
                    isSearchable
                  />
                </ModalBody>
                <ModalFooter>
                  <Button onClick={closeDialog} colorScheme="gray" mr={3}>
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleAssign}
                    colorScheme="orange"
                    isDisabled={!selectedSchool}
                  >
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

export const UserDataSet = ({
  role,
  data = [],
  schools,
  columns,
  selectedIndex = 0,
  token,
  initialPagination = null,
  baseRoute = '/users?populate=*&sort=createdAt:desc',
}) => {
  const t = useTranslations('components.dataset.users');
  const fallbackPageSize = initialPagination?.pageSize || DEFAULT_ROWS_PER_PAGE;

  const [users, setUsers] = useState(data ?? []);
  const [paginationState, setPaginationState] = useState(
    initialPagination || {
      page: 1,
      pageSize: fallbackPageSize,
      pageCount: 1,
      total: data?.length || 0,
    }
  );
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const router = useRouter();

  const filterFunction = ({ data, needle }) =>
    data.filter(
      (item) =>
        item.username &&
        item.username.toLowerCase().includes(needle.toLowerCase())
    );

  const goToPage = useCallback(
    async (targetPage, pageSizeOverride) => {
      const pageSize = pageSizeOverride || paginationState?.pageSize || fallbackPageSize;
      
      setIsLoadingPage(true);
      try {
        const response = await serverFetch({
          uri: `${baseRoute}&pagination[page]=${targetPage}&pagination[pageSize]=${pageSize}`,
          user_token: token,
        });

        const mapped = mapUsersDataTable({ users: response });
        setUsers(mapped);
        setPaginationState(
          response.meta?.pagination || {
            page: targetPage,
            pageSize,
            pageCount: paginationState?.pageCount,
            total: paginationState?.total,
          }
        );
      } catch (error) {
        console.error('Error loading users page:', error);
      } finally {
        setIsLoadingPage(false);
      }
    },
    [baseRoute, token, paginationState?.pageCount, paginationState?.total, paginationState?.pageSize, fallbackPageSize]
  );

  const actionButton =
    role?.name &&
    hasPermission(role.name, 'manageUsers') && (
      <Button
        onClick={() => router.push('/dashboard/direction/users/create')}
        colorScheme={'orange'}
        bgColor={colors.primary.regular}
      >
        {t('createUser')}
      </Button>
    );

  const paginationConfig = useMemo(
    () => ({
      rowsPerPage: paginationState?.pageSize || fallbackPageSize,
      rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
      currentPage: paginationState?.page || 1,
      totalRows: paginationState?.total || users.length,
      onChangePage: (page) => goToPage(page),
      onRowsPerPageChange: (newSize) => goToPage(1, newSize),
      isServerSide: true,
      isLoadingPage,
    }),
    [paginationState?.page, paginationState?.pageSize, paginationState?.total, users.length, goToPage, fallbackPageSize, isLoadingPage]
  );

  return (
    <DataTableLayout
      columns={columns}
      data={users}
      role={role}
      token={token}
      translationNamespace="components.dataset.users"
      actionButton={actionButton}
      expandedComponent={(data) =>
        ExpandedComponent({ ...data, schools, token, role })
      }
      filterFunction={filterFunction}
      defaultSortFieldId="username"
      selectedIndex={selectedIndex}
      paginationProps={paginationConfig}
    />
  );
};
