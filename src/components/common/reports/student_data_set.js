import {
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
  VStack
} from '@chakra-ui/react';
import { StudentFilter } from '@components/common/input/FormInput';
import MonthlyPaymentModal from '@components/forms/student/monthlyPaymentForm';
import { DataTableLayout } from '@components/layout/data_table';
import ReEnrollmentModal from '@components/modals/enrollmentModal';
import { monthlyPaymentFormHandler, studentEnrollmentFormHandler } from '@handlers';
import { colors, routes } from '@theme';
import { ACCESS_STUDENT_VALIDATION } from '@utils/mappers/classes';
import { reportingFilter } from '@utils/mappers/kpi';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { dateFormatter, mapPaymentType } from '@utils/tools/mappers';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { PiUserDuotone, PiUsersDuotone } from 'react-icons/pi';
import { SlClose } from 'react-icons/sl';
import { serverFetch } from 'src/lib/api';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, classrooms, role, user_token }) => {
  const t = useTranslations('components.dataset.students');
  const {
    dashboard: {
      cashier: {
        students: { confirm },
      },
      surveillant: {
        students: { resubscribe },
      },
    },
  } = routes.page_route;

  const {
    id,
    firstname,
    lastname,
    level,
    registered_at,
    birthplace,
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
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);
  const openPaymentModal = () => setPaymentModalOpen(true);
  const closePaymentModal = () => setPaymentModalOpen(false);
  const activeSchoolYear = Cookies.get('selectedSchoolYear');

  const handleReEnrollment = async () => {
    if (!selectedClassroom) {
      toast({
        title: 'Aucune classe sélectionnée',
        description: 'Veuillez sélectionner une classe pour la réinscription.',
        status: 'warning',
      });
      return;
    }
    try {
      await studentEnrollmentFormHandler({
        data: {
          studentId: data.id,
          classId: selectedClassroom,
          schoolYearId: activeSchoolYear,
        },
        setSubmitting,
        setFieldError,
        hasSucceeded: setHasSucceeded,
        token: user_token,
      });
      if (hasSucceeded) {
        toast({
          title: 'Réinscription réussie',
          description: `L'étudiant a été réinscrit avec succès dans la classe ${classrooms.find(
            (classroom) => classroom.id === parseInt(selectedClassroom)
          )?.name}.`,
          status: 'success',
        });
        router.refresh();
      } else if (fieldError) {
        toast({
          title: 'Réinscription échouée',
          description: fieldError,
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Error re-enrolling student:', error);
      toast({
        title: 'Error Occurred',
        description: 'An error occurred while re-enrolling the student.',
        status: 'error',
      });
    }
    closeDialog();
  };

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
      })
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
      setFieldError('payment', 'Une erreur est survenue lors de l\'enregistrement du paiement.');
    } finally {
      setSubmitting(false);
    }
  };

  const classroomOptions = classrooms.map((classroom) => ({
    value: classroom.id,
    label: `${classroom.level} ${classroom.letter}`,
  }));

  const sortedPaymentHistory = payment_history.sort((a, b) => {
    const dateA = new Date(a.attributes.monthOf);
    const dateB = new Date(b.attributes.monthOf);
    return dateB - dateA;
  });

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant={'filled'} w={'100%'}>
          <CardBody>
            <Grid templateColumns={'repeat(3, 1fr)'} columnGap={5}>
              {/* Student Information */}
              <GridItem pr={2} borderRight={1} borderRightStyle={'solid'} borderRightColor={'gray.200'}>
                <HStack spacing={5}>
                  <VStack justifyContent={'center'} w={50} h={50} borderRadius={100} borderColor={'orange.500'} borderWidth={1}>
                    <PiUserDuotone color={'orange.500'} size={25} />
                  </VStack>
                  <Stack>
                    <Text fontWeight={'bold'} fontSize={'lg'}>
                      {firstname} {lastname}
                    </Text>
                    <Text color={'gray.600'} fontSize={'sm'}>
                      {level}
                    </Text>
                    <Text color={'gray.600'} fontSize={'sm'}>
                      {t('enrolledOn')}: {enrollment_date}
                    </Text>
                  </Stack>
                </HStack>

                <Stack spacing={4} mt={4}>
                  <Stack>
                    <Text fontWeight={'bold'}>{t('socialStatus')}</Text>
                    <Text>{socialStatus || '...'}</Text>
                  </Stack>
                  <Stack>
                    <Text fontWeight={'bold'}>{t('bio')}</Text>
                    <Text>{registrationComment || '...'}</Text>
                  </Stack>
                </Stack>
              </GridItem>

              {/* Parent Information */}
              <GridItem pr={2} borderRight={1} borderRightStyle={'solid'} borderRightColor={'gray.200'}>
                <HStack spacing={5}>
                  <VStack justifyContent={'center'} w={50} h={50} borderRadius={100} borderColor={'orange.500'} borderWidth={1}>
                    <PiUsersDuotone color={'orange.500'} size={25} />
                  </VStack>
                  <Stack>
                    <Text fontWeight={'bold'} fontSize={'lg'}>
                      {parent_firstname} {parent_lastname}
                    </Text>
                    <Text color={'gray.600'} fontSize={'sm'}>
                      {t('tutor')}
                    </Text>
                    <Text color={'gray.600'} fontSize={'sm'}>
                      {t('phone')}: {parent_phone}
                    </Text>
                  </Stack>
                </HStack>
              </GridItem>

              {/* Payment Status */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>{t('paymentStatus')}</Text>

                  {payment_history.length === 0 && (
                    <Stack spacing={3}>
                      {ACCESS_STUDENT_VALIDATION.includes(role.type) ? (
                        <Button
                          onClick={() =>
                            router.push(confirm.replace('{student}', enrollment_id))
                          }
                          colorScheme={'green'}
                          variant={'outline'}
                        >
                          {t('validateEnrollment')}
                        </Button>
                      ) : (
                        <Text>{t('waitingForFinance')}</Text>
                      )}
                    </Stack>
                  )}

                  {type && payment_history.length > 0 && (
                    <SimpleGrid columns={1} spacing={2}>
                      {sortedPaymentHistory.slice(0, 3).map((item) => {
                        const {
                          attributes: { monthOf, isPaid, createdAt, amount, paymentType },
                        } = item;
                        const paymentDate = new Date(monthOf ?? createdAt);

                        return (
                          <HStack
                            justifyContent={'space-between'}
                            bg={colors.white}
                            borderRadius={8}
                            py={2}
                            px={3}
                            border="1px solid"
                            borderColor="gray.200"
                            key={`payment-${createdAt}`}
                          >
                            <VStack align="flex-start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">
                                {dateFormatter(paymentDate)}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {mapPaymentType[paymentType]}
                              </Text>
                            </VStack>
                            <HStack>
                              <Text fontSize="sm" fontWeight="semibold">{amount} FCFA</Text>
                              {isPaid ? (
                                <BsCheck2Circle color={'green.500'} size={16} />
                              ) : (
                                <SlClose color={'red.500'} size={16} />
                              )}
                            </HStack>
                          </HStack>
                        );
                      })}
                      {payment_history.length > 3 && (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          +{payment_history.length - 3} more payments
                        </Text>
                      )}
                    </SimpleGrid>
                  )}
                </Stack>
              </GridItem>
            </Grid>

            {/* Action Buttons */}
            <HStack justifyContent={'flex-end'} mt={6}>
              {payment_history.length > 0 && ACCESS_STUDENT_VALIDATION.includes(role.type) && (
                <Button
                  onClick={openPaymentModal}
                  colorScheme="orange"
                  variant="outline"
                >
                  {t('validateMonthlyPayment')}
                </Button>
              )}

              {ACCESS_ROUTES.isSurveillant(role.name) && schoolYear != activeSchoolYear && (
                <Button onClick={openDialog} colorScheme="orange" variant="outline">
                  {t('reEnroll')}
                </Button>
              )}
            </HStack>

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
                .filter(item => item.attributes.paymentType === 'monthly')
                .map(item => item.attributes.monthOf)}
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
  schoolId = '',
  classrooms = [],
  columns,
  selectedIndex = 0,
  token,
}) => {
  const [students, setStudents] = useState(data ?? []);
  const [filterByOldStudents, setFilterByOldStudents] = useState(false);
  const t = useTranslations('components.dataset.students');
  const router = useRouter();
  const schoolYear = Cookies.get('selectedSchoolYear');

  const handleFilter = async () => {
    if (filterByOldStudents) {
      setFilterByOldStudents(false);
      setStudents(data);
      return;
    }
    const response = await serverFetch({
      uri: routes.api_route.alazhar.get.students.allWithoutSchoolYear
        .replace('%schoolId', schoolId)
        .replace('%activeSchoolYear', schoolYear),
      user_token: token,
    });

    const studentsList = mapStudentsDataTableForEnrollments({
      enrollments: response,
    });
    setStudents(studentsList);
    setFilterByOldStudents(true);
  };

  const getFilterLabel = useMemo(() => {
    return t('filterLabel');
  }, [filterByOldStudents, t]);

  const filterFunction = ({ data, needle }) =>
    reportingFilter({
      data,
      position: selectedIndex,
      needle,
    });

  const extraSubHeaderComponents = role?.name !== 'Caissier' && (
    <StudentFilter
      onFilter={handleFilter}
      label={getFilterLabel}
      bgColor={filterByOldStudents ? colors.primary.regular : colors.white}
      color={filterByOldStudents ? colors.white : colors.primary.regular}
    />
  );

  const actionButton = role?.name !== 'Caissier' && (
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
      filterFunction={filterFunction}
      defaultSortFieldId="registered_at"
      extraSubHeaderComponents={extraSubHeaderComponents}
      selectedIndex={selectedIndex}
      paginationProps={{
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 20, 50],
      }}
    />
  );
};
