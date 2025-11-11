import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  ScaleFade,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { StudentFilter } from '@components/common/input/FormInput';
import AddPaymentModal from '@components/forms/student/addPaymentForm';
import MonthlyPaymentModal from '@components/forms/student/monthlyPaymentForm';
import { DataTableLayout } from '@components/layout/data_table';
import ReEnrollmentModal from '@components/modals/enrollmentModal';
import { addPaymentFormHandler, monthlyPaymentFormHandler } from '@handlers';
import { colors, routes } from '@theme';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { hasPermission } from '@utils/roles';
import { dateFormatter, mapPaymentType } from '@utils/tools/mappers';
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '@constants/pagination';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { PiUserDuotone, PiUsersDuotone } from 'react-icons/pi';
import { SlClose } from 'react-icons/sl';
import { fetcher, serverFetch } from 'src/lib/api';
import { BoxZone } from '../cards/boxZone';

// simple in-memory cache to avoid refetching school year months repeatedly
const schoolYearMonthsCache = {};

const ExpandedComponent = ({ data, classrooms, role, user_token }) => {
  const t = useTranslations('components.dataset.students');
  const tPayments = useTranslations('components.dataset.payments');
  const {
    dashboard: {
      cashier: {
        students: { confirm },
      },
    },
  } = routes.page_route;

  const {
    firstname,
    lastname,
    level,
    schoolYear,
    enrollment_date,
    enrollment_id,
    parent_firstname,
    parent_lastname,
    parent_phone,
    type,
    socialStatus,
    registrationComment,
    payments: { data: payment_history },
  } = data;

  const router = useRouter();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isAddPaymentOpen, setAddPaymentOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  const openPaymentModal = () => setPaymentModalOpen(true);
  const closePaymentModal = () => setPaymentModalOpen(false);
  const openAddPaymentModal = () => setAddPaymentOpen(true);
  const closeAddPaymentModal = () => setAddPaymentOpen(false);
  const activeSchoolYear = Cookies.get('selectedSchoolYear');
  const [allowedMonths, setAllowedMonths] = useState([]);

  const handleMonthlyPayment = async (values, setSubmitting, setFieldError) => {
    try {
      await monthlyPaymentFormHandler({
        data: {
          enrollmentId: enrollment_id,
          ...values,
        },
        setSubmitting,
        setFieldError,
        hasSucceeded: setHasSucceeded,
        token: user_token,
      });
      if (hasSucceeded) {
        toast({
          title: 'Paiement mensuel réussi',
          description: 'Le paiement mensuel a été enregistré avec succès.',
          status: 'success',
        });
        router.refresh();
      } else if (fieldError) {
        toast({
          title: 'Paiement mensuel échoué',
          description: fieldError,
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating monthly payment:', error);
      setFieldError(
        'payment',
        "Une erreur est survenue lors de l'enregistrement du paiement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPayment = async (values, setSubmitting, setFieldError) => {
    try {
      await addPaymentFormHandler({
        data: values,
        setSubmitting,
        setFieldError,
        token: user_token,
        hasSucceeded: setHasSucceeded,
      });
      if (hasSucceeded) {
        toast({
          title: 'Paiement ajouté',
          description: 'Le paiement a été ajouté avec succès.',
          status: 'success',
        });
        router.refresh();
      } else if (fieldError) {
        toast({ title: 'Erreur', description: fieldError, status: 'error' });
      }
    } catch (err) {
      console.error('Error adding payment:', err);
      setFieldError(
        'payment',
        "Une erreur est survenue lors de l'ajout du paiement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const classroomOptions = classrooms.map((classroom) => ({
    value: classroom.id,
    label: `${classroom.level} ${classroom.letter}`,
  }));

  const sortedPaymentHistory = [...(payment_history || [])].sort((a, b) => {
    const aDate = new Date(a.attributes.monthOf ?? a.attributes.createdAt);
    const bDate = new Date(b.attributes.monthOf ?? b.attributes.createdAt);
    return +bDate - +aDate;
  });

  // compute already paid months for monthly payments (YYYY-MM)
  const alreadyPaidMonthsList = sortedPaymentHistory
    .filter((item) => item.attributes.paymentType === 'monthly')
    .map((item) => item.attributes.monthOf?.slice(0, 7));

  useEffect(() => {
    const fetchSchoolYear = async () => {
      if (!activeSchoolYear) return;
      // reuse cached months if present
      if (schoolYearMonthsCache[activeSchoolYear]) {
        const cached = schoolYearMonthsCache[activeSchoolYear];
        // if cached is a promise, await it; otherwise set directly
        if (cached.then) {
          try {
            const months = await cached;
            setAllowedMonths(months);
            return;
          } catch (err) {
            // fall through to refetch
          }
        } else {
          setAllowedMonths(cached);
          return;
        }
      }
      try {
        // store in-flight promise to dedupe concurrent requests
        const promise = serverFetch({
          uri: routes.api_route.alazhar.get.school_years.detail.replace(
            '%id',
            activeSchoolYear
          ),
          user_token,
        }).then((resp) => {
          const sy =
            resp?.data?.data?.attributes ||
            resp?.data?.attributes ||
            resp?.data;
          const start = sy?.startDate;
          const end = sy?.endDate;
          if (!start || !end) return [];

          const startDate = new Date(start);
          const endDate = new Date(end);
          const months = [];
          const cur = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1
          );
          const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
          while (cur <= last) {
            const y = cur.getFullYear();
            const m = String(cur.getMonth() + 1).padStart(2, '0');
            months.push(`${y}-${m}`);
            cur.setMonth(cur.getMonth() + 1);
          }
          // cache resolved months
          schoolYearMonthsCache[activeSchoolYear] = months;
          return months;
        });

        schoolYearMonthsCache[activeSchoolYear] = promise;
        const months = await promise;
        setAllowedMonths(months);
      } catch (err) {
        console.error('Failed to fetch school year for months', err);
        setAllowedMonths([]);
      }
    };

    fetchSchoolYear();
  }, [activeSchoolYear, user_token]);

  return (
    <ScaleFade px={{ base: 3, md: 5 }} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant={'filled'} w={'100%'}>
          <CardBody p={{ base: 4, md: 6 }}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={{ base: 4, md: 5 }}
            >
              {/* Student Information */}
              <GridItem
                pr={{ base: 0, lg: 2 }}
                borderRight={{ base: 'none', lg: '1px solid' }}
                borderRightColor={{ base: 'transparent', lg: 'gray.200' }}
                borderBottom={{ base: '1px solid', lg: 'none' }}
                borderBottomColor={{ base: 'gray.200', lg: 'transparent' }}
                pb={{ base: 4, lg: 0 }}
              >
                <HStack
                  spacing={{ base: 2, md: 3 }}
                  flexDirection={{ base: 'column', sm: 'row' }}
                >
                  <VStack
                    justifyContent={'center'}
                    w={{ base: 35, md: 35 }}
                    h={{ base: 35, md: 35 }}
                    borderRadius={100}
                    borderColor={'orange.500'}
                    borderWidth={1}
                    flexShrink={0}
                  >
                    <PiUserDuotone color={'orange.500'} size={18} />
                  </VStack>
                  <Stack
                    spacing={0.5}
                    textAlign={{ base: 'center', sm: 'left' }}
                  >
                    <Text
                      fontWeight={'bold'}
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      {firstname} {lastname}
                    </Text>
                    <Text
                      color={'gray.600'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {level}
                    </Text>
                    <Text
                      color={'gray.600'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {t('enrolledOn')}: {enrollment_date}
                    </Text>
                  </Stack>
                </HStack>

                <Stack spacing={{ base: 2, md: 3 }} mt={{ base: 2, md: 3 }}>
                  <Stack spacing={0.5}>
                    <Text
                      fontWeight={'bold'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {t('socialStatus')}
                    </Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {socialStatus || '...'}
                    </Text>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Text
                      fontWeight={'bold'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {t('bio')}
                    </Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }}>
                      {registrationComment || '...'}
                    </Text>
                  </Stack>
                </Stack>
              </GridItem>

              {/* Parent Information */}
              <GridItem
                pr={{ base: 0, lg: 2 }}
                borderRight={{ base: 'none', lg: '1px solid' }}
                borderRightColor={{ base: 'transparent', lg: 'gray.200' }}
                borderBottom={{ base: '1px solid', md: 'none' }}
                borderBottomColor={{ base: 'gray.200', md: 'transparent' }}
                pb={{ base: 4, md: 0 }}
              >
                <HStack
                  spacing={{ base: 2, md: 3 }}
                  flexDirection={{ base: 'column', sm: 'row' }}
                >
                  <VStack
                    justifyContent={'center'}
                    w={{ base: 35, md: 35 }}
                    h={{ base: 35, md: 35 }}
                    borderRadius={100}
                    borderColor={'orange.500'}
                    borderWidth={1}
                    flexShrink={0}
                  >
                    <PiUsersDuotone color={'orange.500'} size={18} />
                  </VStack>
                  <Stack
                    spacing={0.5}
                    textAlign={{ base: 'center', sm: 'left' }}
                  >
                    <Text
                      fontWeight={'bold'}
                      fontSize={{ base: 'sm', md: 'md' }}
                    >
                      {parent_firstname} {parent_lastname}
                    </Text>
                    <Text
                      color={'gray.600'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {t('tutor')}
                    </Text>
                    <Text
                      color={'gray.600'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                    >
                      {t('phone')}:{' '}
                      <Text
                        as="span"
                        dir="ltr"
                        display="inline-block"
                        style={{ unicodeBidi: 'isolate-override' }}
                      >
                        {parent_phone}
                      </Text>
                    </Text>
                  </Stack>
                </HStack>
              </GridItem>

              {/* Payment Status */}
              <GridItem>
                <Stack spacing={{ base: 3, md: 4 }}>
                  <Text fontWeight={'bold'} fontSize={{ base: 'sm', md: 'md' }}>
                    {t('paymentStatus')}
                  </Text>

                  {payment_history.length === 0 && (
                    <Stack spacing={3}>
                      {ACCESS_ROUTES.isCashier(role.name) ? (
                        <Button
                          onClick={() =>
                            router.push(
                              confirm.replace('{student}', enrollment_id)
                            )
                          }
                          colorScheme={'green'}
                          variant={'outline'}
                          size={{ base: 'sm', md: 'md' }}
                          w={{ base: '100%', sm: 'auto' }}
                        >
                          {t('validateEnrollment')}
                        </Button>
                      ) : (
                        <Text fontSize={{ base: 'sm', md: 'md' }}>
                          {t('waitingForFinance')}
                        </Text>
                      )}
                    </Stack>
                  )}

                  {type && payment_history.length > 0 && (
                    <>
                      {!showAllPayments ? (
                        <SimpleGrid columns={1} spacing={2}>
                          {sortedPaymentHistory.slice(0, 3).map((item) => {
                            const {
                              attributes: {
                                monthOf,
                                isPaid,
                                createdAt,
                                amount,
                                paymentType,
                                status,
                                cancelledAt,
                              },
                            } = item;
                            const paymentDate = new Date(monthOf ?? createdAt);
                            const cancelledAtDate = cancelledAt
                              ? new Date(cancelledAt)
                              : null;
                            const cancelled =
                              status === 'cancelled' ||
                              (cancelledAtDate instanceof Date &&
                                !isNaN(+cancelledAtDate));

                            return (
                              <HStack
                                justifyContent={'space-between'}
                                bg={colors.white}
                                borderRadius={8}
                                py={{ base: 1.5, md: 2 }}
                                px={{ base: 2, md: 3 }}
                                border="1px solid"
                                borderColor="gray.200"
                                key={`payment-${createdAt}`}
                                flexDirection={{ base: 'column', sm: 'row' }}
                                align={{ base: 'flex-start', sm: 'center' }}
                                spacing={{ base: 1, sm: 0 }}
                              >
                                <VStack
                                  align={{ base: 'center', sm: 'flex-start' }}
                                  spacing={0}
                                  w={{ base: '100%', sm: 'auto' }}
                                >
                                  <Text
                                    fontSize={{ base: 'xs', md: 'sm' }}
                                    fontWeight="medium"
                                  >
                                    {dateFormatter(paymentDate)}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {mapPaymentType[paymentType]}
                                  </Text>
                                </VStack>
                                <HStack
                                  justify={{ base: 'center', sm: 'flex-end' }}
                                  w={{ base: '100%', sm: 'auto' }}
                                  spacing={2}
                                >
                                  <Text
                                    fontSize={{ base: 'xs', md: 'sm' }}
                                    fontWeight="semibold"
                                    textDecoration={
                                      cancelled ? 'line-through' : 'none'
                                    }
                                    color={cancelled ? 'gray.400' : 'inherit'}
                                  >
                                    {amount} FCFA
                                  </Text>
                                  {cancelled ? (
                                    <HStack spacing={1}>
                                      <SlClose color={'red.500'} size={14} />
                                      <Text fontSize="xs" color="red.500">
                                        {tPayments('cancelled')}
                                      </Text>
                                    </HStack>
                                  ) : isPaid ? (
                                    <BsCheck2Circle
                                      color={'green.500'}
                                      size={16}
                                    />
                                  ) : (
                                    <SlClose color={'red.500'} size={16} />
                                  )}
                                </HStack>
                              </HStack>
                            );
                          })}

                          {payment_history.length > 3 && (
                            <Text
                              as="button"
                              onClick={() => setShowAllPayments(true)}
                              fontSize="xs"
                              color="gray.500"
                              textAlign="center"
                              _hover={{ color: 'gray.700' }}
                            >
                              {`+${payment_history.length - 3} more payments`}
                            </Text>
                          )}
                        </SimpleGrid>
                      ) : (
                        <>
                          <Box
                            mt={2}
                            maxH="220px"
                            overflowY="auto"
                            border="1px solid"
                            borderColor="gray.100"
                            borderRadius={6}
                            p={2}
                          >
                            <VStack spacing={2} align="stretch">
                              {sortedPaymentHistory.map((item) => {
                                const {
                                  attributes: {
                                    monthOf,
                                    isPaid,
                                    createdAt,
                                    amount,
                                    paymentType,
                                    status,
                                    isCancelled,
                                  },
                                } = item;
                                const paymentDate = new Date(
                                  monthOf ?? createdAt
                                );
                                const cancelledAtRaw =
                                  item.attributes.cancelledAt;
                                const cancelledAtDate = cancelledAtRaw
                                  ? new Date(cancelledAtRaw)
                                  : null;
                                const cancelled =
                                  status === 'cancelled' ||
                                  (cancelledAtDate instanceof Date &&
                                    !isNaN(+cancelledAtDate));

                                return (
                                  <HStack
                                    justifyContent={'space-between'}
                                    bg={colors.white}
                                    borderRadius={8}
                                    py={{ base: 1.5, md: 2 }}
                                    px={{ base: 2, md: 3 }}
                                    border="1px solid"
                                    borderColor="gray.200"
                                    key={`payment-expanded-${createdAt}`}
                                    flexDirection={{
                                      base: 'column',
                                      sm: 'row',
                                    }}
                                    align={{ base: 'flex-start', sm: 'center' }}
                                    spacing={{ base: 1, sm: 0 }}
                                  >
                                    <VStack
                                      align={{
                                        base: 'center',
                                        sm: 'flex-start',
                                      }}
                                      spacing={0}
                                      w={{ base: '100%', sm: 'auto' }}
                                    >
                                      <Text
                                        fontSize={{ base: 'xs', md: 'sm' }}
                                        fontWeight="medium"
                                      >
                                        {dateFormatter(paymentDate)}
                                      </Text>
                                      <Text fontSize="xs" color="gray.600">
                                        {mapPaymentType[paymentType]}
                                      </Text>
                                    </VStack>
                                    <HStack
                                      justify={{
                                        base: 'center',
                                        sm: 'flex-end',
                                      }}
                                      w={{ base: '100%', sm: 'auto' }}
                                      spacing={2}
                                    >
                                      <Text
                                        fontSize={{ base: 'xs', md: 'sm' }}
                                        fontWeight="semibold"
                                        textDecoration={
                                          cancelled ? 'line-through' : 'none'
                                        }
                                        color={
                                          cancelled ? 'gray.400' : 'inherit'
                                        }
                                      >
                                        {amount} FCFA
                                      </Text>
                                      {cancelled ? (
                                        <HStack spacing={1}>
                                          <SlClose
                                            color={'red.500'}
                                            size={14}
                                          />
                                          <Text fontSize="xs" color="red.500">
                                            {tPayments('cancelled')}
                                          </Text>
                                        </HStack>
                                      ) : isPaid ? (
                                        <BsCheck2Circle
                                          color={'green.500'}
                                          size={16}
                                        />
                                      ) : (
                                        <SlClose color={'red.500'} size={16} />
                                      )}
                                    </HStack>
                                  </HStack>
                                );
                              })}
                            </VStack>
                          </Box>

                          <Text
                            as="button"
                            onClick={() => setShowAllPayments(false)}
                            display="block"
                            w="100%"
                            textAlign="center"
                            mt={2}
                            fontSize="xs"
                            color="gray.500"
                            _hover={{ color: 'gray.700' }}
                          >
                            Show less
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </Stack>
              </GridItem>
            </Grid>

            {/* Action Buttons */}
            <Wrap
              justify={{ base: 'center', md: 'flex-end' }}
              mt={{ base: 4, md: 6 }}
              spacing={{ base: 2, md: 3 }}
            >
              {/* {payment_history.length > 0 &&
                ACCESS_ROUTES.isCashier(role.name) && (
                  <WrapItem w={{ base: '100%', sm: 'auto' }}>
                    <Button
                      onClick={openPaymentModal}
                      colorScheme="orange"
                      variant="outline"
                      size={{ base: 'sm', md: 'md' }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      {t('validateMonthlyPayment')}
                    </Button>
                  </WrapItem>
                )} */}
              {payment_history.length > 0 &&
                ACCESS_ROUTES.isCashier(role.name) && (
                  <WrapItem w={{ base: '100%', sm: 'auto' }}>
                    <Button
                      onClick={openAddPaymentModal}
                      colorScheme="green"
                      variant="outline"
                      size={{ base: 'sm', md: 'md' }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      {t('addPayment')}
                    </Button>
                  </WrapItem>
                )}

              {ACCESS_ROUTES.isSurveillant(role.name) &&
                schoolYear != activeSchoolYear && (
                  <WrapItem w={{ base: '100%', sm: 'auto' }}>
                    <Button
                      onClick={openDialog}
                      colorScheme="orange"
                      variant="outline"
                      size={{ base: 'sm', md: 'md' }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      {t('reEnroll')}
                    </Button>
                  </WrapItem>
                )}

              {ACCESS_ROUTES.isSurveillant(role.name) && (
                <WrapItem w={{ base: '100%', sm: 'auto' }}>
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/surveillant/students/${enrollment_id}/edit`
                      )
                    }
                    colorScheme="orange"
                    variant="outline"
                    size={{ base: 'sm', md: 'md' }}
                    w={{ base: '100%', sm: 'auto' }}
                  >
                    {t('updateStudent')}
                  </Button>
                </WrapItem>
              )}
            </Wrap>

            {/* Modals */}
            <ReEnrollmentModal
              token={user_token}
              isOpen={isDialogOpen}
              onClose={closeDialog}
              firstname={firstname}
              lastname={lastname}
              level={level}
              student={data.id}
              classroomOptions={classroomOptions}
              selectedClassroom={selectedClassroom}
              setSelectedClassroom={setSelectedClassroom}
            />

            <MonthlyPaymentModal
              isOpen={isPaymentModalOpen}
              onClose={closePaymentModal}
              handleMonthlyPayment={handleMonthlyPayment}
              initialValues={{ monthOf: '', amount: '' }}
              alreadyPaidMonths={sortedPaymentHistory
                .filter((item) => item.attributes.paymentType === 'monthly')
                .map((item) => item.attributes.monthOf)}
            />
            <AddPaymentModal
              isOpen={isAddPaymentOpen}
              onClose={closeAddPaymentModal}
              enrollmentId={enrollment_id}
              token={user_token}
              handleAddPayment={handleAddPayment}
              alreadyPaidMonths={alreadyPaidMonthsList}
              allowedMonths={allowedMonths}
            />
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

export const DataSet = ({
  role,
  data = [],
  initialPagination = null,
  schoolId = '',
  classrooms = [],
  columns,
  selectedIndex = 0,
  token,
  additionalFilters = '',
}) => {
  const fallbackPageSize = initialPagination?.pageSize || DEFAULT_ROWS_PER_PAGE;

  const defaultPagination = initialPagination || {
    page: 1,
    pageSize: fallbackPageSize,
    pageCount: 1,
    total: data?.length || 0,
  };
  console.log('initialpagination', initialPagination);

  const [students, setStudents] = useState(data ?? []);
  const [paginationState, setPaginationState] = useState(defaultPagination);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [filterByOldStudents, setFilterByOldStudents] = useState(false);
  const t = useTranslations('components.dataset.students');
  const router = useRouter();
  const schoolYear = Cookies.get('selectedSchoolYear');
  const pageSizeFallback = fallbackPageSize;

  const resetToInitialData = () => {
    setStudents(data ?? []);
    setPaginationState(
      initialPagination || {
        page: 1,
        pageSize: pageSizeFallback,
        pageCount: 1,
        total: data?.length || 0,
      }
    );
  };

  const handleFilter = async () => {
    if (filterByOldStudents) {
      setFilterByOldStudents(false);
      resetToInitialData();
      return;
    }
    const pageSize = paginationState?.pageSize || pageSizeFallback;
    const response = await serverFetch({
      uri:
        routes.api_route.alazhar.get.students.allWithoutSchoolYear
          .replace('%schoolId', schoolId)
          .replace('%activeSchoolYear', schoolYear) +
        `&pagination[page]=1&pagination[pageSize]=${pageSize}` +
        additionalFilters,
      user_token: token,
    });

    const studentsList = mapStudentsDataTableForEnrollments({
      enrollments: response,
    });

    setStudents(studentsList);
    setPaginationState(
      response.meta?.pagination || {
        page: 1,
        pageSize,
        pageCount: 1,
        total: studentsList.length,
      }
    );
    setFilterByOldStudents(true);
  };

  const getFilterLabel = useMemo(() => {
    return t('filterLabel');
  }, [filterByOldStudents, t]);

  // Custom filter for students dataset: search firstname, lastname and student identifier (matricule)
  const studentFilterFunction = ({ data, needle }) => {
    if (!needle || !data) return data;
    const q = String(needle).toLowerCase();
    return data.filter((item) => {
      const first = String(item.firstname || '').toLowerCase();
      const last = String(item.lastname || '').toLowerCase();
      const sid = String(item.student_identifier || '').toLowerCase();
      return (
        (first && first.includes(q)) ||
        (last && last.includes(q)) ||
        (sid && sid.includes(q))
      );
    });
  };

  const extraSubHeaderComponents = hasPermission(
    role.name,
    'manageStudents'
  ) && (
    <StudentFilter
      onFilter={handleFilter}
      label={getFilterLabel}
      bgColor={filterByOldStudents ? colors.primary.regular : colors.white}
      color={filterByOldStudents ? colors.white : colors.primary.regular}
    />
  );

  const actionButton = hasPermission(role.name, 'manageStudents') && (
    <Button
      onClick={() =>
        router.push(routes.page_route.dashboard.surveillant.students.create)
      }
      colorScheme={'orange'}
      bgColor={colors.primary.regular}
    >
      {t('enrollNewStudent')}
    </Button>
  );

  const getBaseRoute = () =>
    ((filterByOldStudents
      ? routes.api_route.alazhar.get.students.allWithoutSchoolYear
      : routes.api_route.alazhar.get.students.all)
      .replace('%schoolId', schoolId)
      .replace('%activeSchoolYear', schoolYear || '')) +
    additionalFilters;

  const currentPageSize = paginationState?.pageSize || pageSizeFallback;

  const goToPage = useCallback(
    async (targetPage, pageSizeOverride) => {
      if (!token) return;
      const pageSize = pageSizeOverride || currentPageSize;

      setIsLoadingPage(true);
      try {
        const response = await fetcher({
          uri: `${getBaseRoute()}&pagination[page]=${targetPage}&pagination[pageSize]=${pageSize}`,
          user_token: token,
        });

        const studentsList = mapStudentsDataTableForEnrollments({
          enrollments: response,
        });

        setStudents(studentsList);
        setPaginationState((prev) => response.meta?.pagination || { ...prev, page: targetPage, pageSize });
      } catch (error) {
        console.error('Error loading students page:', error);
      } finally {
        setIsLoadingPage(false);
      }
    },
    [token, filterByOldStudents, schoolId, schoolYear, currentPageSize, additionalFilters]
  );

  const paginationConfig = useMemo(
    () => ({
      rowsPerPage: currentPageSize,
      rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
      currentPage: paginationState?.page || 1,
      totalRows: paginationState?.total || students.length,
      onChangePage: (page) => goToPage(page),
      onRowsPerPageChange: (newSize, page) => goToPage(page || 1, newSize),
      isServerSide: true,
      isLoadingPage,
    }),
    [currentPageSize, paginationState?.page, paginationState?.total, students.length, goToPage, isLoadingPage]
  );

  return (
    <DataTableLayout
      columns={columns}
      data={students}
      role={role}
      token={token}
      translationNamespace="components.dataset.students"
      actionButton={actionButton}
      expandedComponent={(data) =>
        ExpandedComponent({ ...data, classrooms, role, user_token: token })
      }
      filterFunction={studentFilterFunction}
      defaultSortFieldId="registered_at"
      extraSubHeaderComponents={extraSubHeaderComponents}
      selectedIndex={selectedIndex}
      paginationProps={paginationConfig}
    />
  );
};
