import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Highlight,
  ScaleFade,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  FormExport,
  FormSearch,
  StudentFilter
} from '@components/common/input/FormInput';
import MonthlyPaymentModal from '@components/forms/student/monthlyPaymentForm';
import ReEnrollmentModal from '@components/modals/enrollmentModal';
import { monthlyPaymentFormHandler, studentEnrollmentFormHandler } from '@handlers';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { ACCESS_STUDENT_VALIDATION } from '@utils/mappers/classes';
import { reportingFilter } from '@utils/mappers/kpi';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { mapStudentsDataTableForEnrollments } from '@utils/mappers/student';
import { dateFormatter, mapPaymentType } from '@utils/tools/mappers';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsCheck2Circle } from 'react-icons/bs';
import { FaCashRegister } from 'react-icons/fa';
import { PiUserDuotone, PiUsersDuotone } from 'react-icons/pi';
import { SlClose } from 'react-icons/sl';
import { serverFetch } from 'src/lib/api';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, classrooms, role, user_token }) => {
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
        title: 'Aucune classe sélectionnée',
        description: 'Veuillez sélectionner une classe pour la réinscription.',
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
          title: 'Réinscription réussie',
          description: `L'étudiant a été réinscrit avec succès dans la classe ${classrooms.find(
            (classroom) => classroom.id === parseInt(selectedClassroom)
          )?.name}.`,
          status: 'success',
        });
        router.refresh();
      } else if (fieldError) {
        toast({
          title: 'Réinscription échouée',
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
      // Handle the monthly payment logic here
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
          title: 'Paiement mensuel réussi',
          description: 'Le paiement mensuel a été enregistré avec succès.',
          status: 'success',
        });
        router.refresh();
      } else if (fieldError) {
        toast({
          title: 'Paiement mensuel échoué',
          description: fieldError,
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating monthly payment:', error);
      setFieldError('payment', 'Une erreur est survenue lors de l\'enregistrement du paiement.');
    } finally {
      setSubmitting(false);
      // closePaymentModal();
    }
  };



  const classroomOptions = classrooms.map((classroom) => ({
    value: classroom.id,
    label: `${classroom.level} ${classroom.letter}`,
  }));

  // Sort the payment history by the latest payment date
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
            <Grid templateColumns={'repeat(2, 1fr)'} columnGap={5}>
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={colors.gray.thin}
              >
                <HStack
                  justifyContent={'space-between'}
                  borderStyle={'solid'}
                  w={'100%'}
                >
                  <HStack>
                    <VStack
                      justifyContent={'center'}
                      w={50}
                      h={50}
                      borderRadius={100}
                      borderColor={colors.secondary.regular}
                      borderWidth={1}
                    >
                      <PiUserDuotone
                        color={colors.secondary.regular}
                        size={25}
                      />
                    </VStack>

                    <Stack>
                      <Text fontWeight={'bold'}>
                        {firstname} {lastname}
                      </Text>
                      <Text fontSize={15}>{level}</Text>
                    </Stack>
                  </HStack>

                  {payment_history.length > 0 && ACCESS_STUDENT_VALIDATION.includes(role.type) && (
                    <Box justifySelf={'flex-end'}>
                      <Button
                        onClick={openPaymentModal}
                        colorScheme={'orange'}
                        variant={'outline'}
                        leftIcon={
                          <FaCashRegister
                            color={colors.primary.regular}
                            size={25}
                          />
                        }
                      >
                        Valider une mensualité
                      </Button>
                    </Box>
                  )}
                </HStack>
                <Stack divider={<StackDivider />} spacing={4} pt={2}>
                  <Text>
                    <Highlight
                      query={enrollment_date}
                      styles={{ fontWeight: 700 }}
                    >
                      {`Inscrit le: ${enrollment_date}`}
                    </Highlight>
                  </Text>

                  <Stack>
                    <Text fontWeight={700}>{'Prise en charge'}</Text>
                    <Text>{socialStatus || '...'}</Text>
                  </Stack>

                  <Stack>
                    <Text fontWeight={700}>{'BIO'}</Text>
                    <Text>{registrationComment || '...'}</Text>
                  </Stack>

                  <Stack>
                    <Text fontWeight={700} fontSize={15}>
                      {'État des paiements'}
                    </Text>
                    {payment_history.length === 0 && (
                      <Stack>
                        {ACCESS_STUDENT_VALIDATION.includes(role.type) ? (
                          <Button
                            onClick={() =>
                              router.push(confirm.replace('{student}', enrollment_id))
                            }
                            colorScheme={'green'}
                            variant={'outline'}
                          >
                            {"Valider l'inscription"}
                          </Button>
                        ) : (
                          <Text fontSize={15}>
                            {'En attente du service financier'}
                          </Text>
                        )}
                      </Stack>
                    )}

                    <SimpleGrid columns={[1, null, 1]} spacing={5}>
                      {type &&
                        sortedPaymentHistory.map((item) => {
                          const {
                            attributes: { monthOf, isPaid, createdAt, amount, paymentType, motive },
                          } = item;
                          const paymentDate = new Date(monthOf ?? createdAt);

                          return (
                            <HStack
                              alignItem={'center'}
                              justifyContent={'space-between'}
                              bg={colors.white}
                              borderRadius={8}
                              py={2}
                              px={4}
                              key={`payment-${createdAt}`}
                            >
                              <Text>{dateFormatter(paymentDate)}</Text>
                              <Text>{mapPaymentType[paymentType]}</Text>
                              <Text>{amount} FCFA</Text>
                              {isPaid ? (
                                <BsCheck2Circle
                                  color={colors.secondary.regular}
                                  size={20}
                                />
                              ) : (
                                <SlClose color={colors.error} size={20} />
                              )}
                            </HStack>
                          );
                        })}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem>
                <HStack borderStyle={'solid'}>
                  <VStack
                    justifyContent={'center'}
                    w={50}
                    h={50}
                    borderRadius={100}
                    bgColor={colors.secondary.light}
                    borderColor={colors.secondary.regular}
                    borderWidth={1}
                  >
                    <PiUsersDuotone
                      color={colors.secondary.regular}
                      size={25}
                    />
                  </VStack>

                  <Stack>
                    <Text fontWeight={'bold'}>
                      {parent_firstname} {parent_lastname}
                    </Text>
                    <Text fontSize={15}>{'Tuteur'}</Text>
                  </Stack>
                </HStack>
                <Stack divider={<StackDivider />} spacing={4} pt={2}>
                  <Text>
                    <Highlight
                      query={parent_phone}
                      styles={{ fontWeight: 700 }}
                    >
                      {`Téléphone: ${parent_phone}`}
                    </Highlight>
                  </Text>
                </Stack>
              </GridItem>
            </Grid>

            {/* re_enrollment button */}
            {ACCESS_ROUTES.isSurveillant(role.name) && schoolYear != activeSchoolYear && (
              <Box justifySelf={'flex-end'}>
                <Button
                  onClick={openDialog}
                  colorScheme={'orange'}
                  variant={'outline'}
                  leftIcon={
                    <FaCashRegister
                      color={colors.primary.regular}
                      size={25}
                    />
                  }
                >
                  Re-inscrire
                </Button>
              </Box>
            )}

            {/* re_enrollment modal */}
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

            {/* monthly payment modal */}
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
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null); // To track the currently expanded row
  const [students, setStudents] = useState(data ?? []);
  const [filterByOldStudents, setFilterByOldStudents] = useState(false);

  const router = useRouter();
  const schoolYear = Cookies.get('selectedSchoolYear');

  const filtered = useMemo(
    () =>
      reportingFilter({
        data: students,
        position: selectedIndex,
        needle: filterText,
      }),
    [students, selectedIndex, filterText]
  );

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
    // return filterByOldStudents ? 'Elèves inscrits' : 'Elèves non inscrits';
    return 'Elèves non inscrits';
  }, [filterByOldStudents]);

  const subHeaderComponentMemo = useMemo(() => {
    const { bgColor, color } = {
      bgColor: filterByOldStudents ? colors.primary.regular : colors.white,
      color: filterByOldStudents ? colors.white : colors.primary.regular,
    };

    return (
      <HStack
        alignItems={'center'}
        justifyContent={'space-between'}
        my={3}
        w={'100%'}
        borderRadius={10}
      >
        <HStack>
          <Box w={'60%'}>
            <FormSearch
              placeholder={'Rechercher un élève'}
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          {/* onExport={() => downloadCSV(filtered[selectedIndex])} */}
          <HStack pl={4}>
            {/* <FormFilter onExport={() => { }} /> */}
            {role?.name != 'Caissier' && <StudentFilter
              onFilter={handleFilter}
              label={getFilterLabel}
              bgColor={bgColor}
              color={color}
            />}
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>

        {role?.name != 'Caissier' && (
          <HStack>
            <Button
              onClick={() =>
                router.push(routes.page_route.dashboard.surveillant.students.create)
              }
              colorScheme={'orange'}
              bgColor={colors.primary.regular}
              px={10}
            >
              {'Inscrire nouveau un élève'}
            </Button>
          </HStack>
        )}
      </HStack>
    );
  }, [filterText, selectedIndex, filterByOldStudents, getFilterLabel, router, role]);

  const handleRowExpandToggle = (row) => {
    // If the row is already expanded, collapse it. Otherwise, expand it.
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  return (
    <DataTable
      style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: 'registered_at', desc: true }] }}
      subHeader
      // selectableRows
      expandOnRowClicked
      expandableRowsHideExpander
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id} // Expand only the selected row
      onRowClicked={handleRowExpandToggle} // Handle row click to expand/collapse
      expandableRowsComponent={(data) =>
        ExpandedComponent({ ...data, classrooms, role, user_token: token })
      }
      pagination
    />
  );
};




