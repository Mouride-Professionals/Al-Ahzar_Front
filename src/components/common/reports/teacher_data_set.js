import {
  Box,
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
import {
  FormExport,
  FormFilter,
  FormSearch,
} from '@components/common/input/FormInput';
import { assignTeacher } from '@services/teacher';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { reportingFilter } from '@utils/mappers/kpi';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PiUserDuotone } from 'react-icons/pi';
import Select from 'react-select';
import { BoxZone } from '../cards/boxZone';
// import { colors, routes } from '@theme';

const ExpandedComponent = ({ data, schools, token }) => {
  const router = useRouter();
  const toast = useToast(
    {
      position: 'top-right',
      duration: 3000,
      isClosable: true,
    }
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);


  const handleAssign = async () => {
    if (!selectedSchool) {
      toast({
        title: 'No school selected',
        description: 'Please select a school to assign the teacher.',
        status: 'warning',
      })
      return;
    }
    try {
      const response = await assignTeacher({
        teacher: data.id,
        school: selectedSchool,

        token: token,
      });


      if (response) {
        console.log('response', response);


        toast({
          title: 'Assignment Successful',
          description: `Teacher has been successfully assigned to ${schools.find(school => school.id === parseInt(selectedSchool))?.name}.`,
          status: 'success',

        });
        router.refresh();
      } else {
        toast({
          title: 'Assignment Failed',
          description: 'Failed to assign the teacher. Please try again.',
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Error assigning teacher:', error);
      toast({
        title: 'Error Occurred',
        description: 'An error occurred while assigning the teacher.',
        status: 'error',
      })
    }
    closeDialog();
  };
  const {
    dashboard: {
      direction: {
        teachers: { edit },
      },
    },
  } = routes.page_route;
  const {
    firstname,
    lastname,
    phoneNumber,
    email,
    gender,
    address,
    birthDate,
    birthPlace,
    maritalStatus,
    academicDegree,
    professionalDegrees,
    disciplines,
    language,
    subjects,
    contractType,
    level,
    salary,
    registrationNumber,
    generation,
    salaryPerHour,
    hoursNumber,
    additionalResponsibilities,
    countryFrom,
    arrivalDate,
    previousInstitutes,
    createdAt,
    etablissement,
  } = data;
  const schoolOptions = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  // const selectStyles
  //   = {
  //   control: (base, state) => ({
  //     ...base,
  //     backgroundColor: state.isFocused ? '#f7f7f7' : 'white',
  //     borderColor: state.isFocused ? '#3182ce' : '#e2e8f0',
  //     boxShadow: state.isFocused ? '0 0 0 1px orange' : 'none',
  //     '&:hover': {
  //       borderColor: '#3182ce',
  //     },
  //   }),
  //   option: (base, state) => ({
  //     ...base,
  //     backgroundColor: state.isFocused ? '#e2e8f0' : 'white',
  //     color: state.isFocused ? '#1a202c' : '#4a5568',
  //     '&:active': {
  //       backgroundColor: '#cbd5e0',
  //     },
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     borderRadius: '8px',
  //     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  //     zIndex: 9999,
  //   }),


  // };

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
                borderRightColor={colors.gray.thin}
              >
                <HStack spacing={5}>
                  <VStack
                    justifyContent={'center'}
                    w={50}
                    h={50}
                    borderRadius={100}
                    borderColor={colors.secondary.regular}
                    borderWidth={1}
                  >
                    <PiUserDuotone color={colors.secondary.regular} size={25} />
                  </VStack>
                  <Stack>
                    <Text fontWeight={'bold'} fontSize={'lg'}>
                      {firstname} {lastname}
                    </Text>
                    <Text color={colors.secondary.light}>
                      Gender: {gender || 'N/A'}
                    </Text>
                    <Text color={colors.secondary.light}>
                      Joined On: {new Date(createdAt).toLocaleDateString()}
                    </Text>
                  </Stack>
                </HStack>
              </GridItem>

              {/* Contact Information */}
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={colors.gray.thin}
              >
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Contact Details</Text>
                  <Text>Email: {email || 'N/A'}</Text>
                  <Text>Phone: {phoneNumber || 'N/A'}</Text>
                  <Text>Address: {address || 'N/A'}</Text>
                </Stack>
              </GridItem>
              {/* Personal Information */}

              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Personal Details</Text>
                  <Text>Birth Date: {birthDate || 'N/A'}</Text>
                  <Text>Birth Place: {birthPlace || 'N/A'}</Text>
                  <Text>Marital Status: {maritalStatus || 'N/A'}</Text>
                  <Text>Language: {language || 'N/A'}</Text>
                  <Text>Subjects: {subjects || 'N/A'}</Text>
                </Stack>
              </GridItem>
            </Grid>

            {/* Additional Details */}
            <Grid templateColumns={'repeat(3, 1fr)'} columnGap={5} pt={5}>
              {/* Professional Information */}
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={colors.gray.thin}
              >
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Professional Details</Text>
                  <Text>Institution: {etablissement || 'N/A'}</Text>
                  <Text>Disciplines: {disciplines || 'N/A'}</Text>
                  <Text>Academic Degree: {academicDegree || 'N/A'}</Text>
                  <Text>
                    Professional Degrees: {professionalDegrees || 'N/A'}
                  </Text>
                  <Text>Contract Type: {contractType || 'N/A'}</Text>
                  <Text>Level: {level || 'N/A'}</Text>
                </Stack>
              </GridItem>

              {/* Salary and Responsibilities */}
              <GridItem
                pr={2}
                borderRight={1}
                borderRightStyle={'solid'}
                borderRightColor={colors.gray.thin}
              >
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Work Details</Text>
                  <Text>Salary: {salary || 'N/A'}</Text>
                  <Text>Salary Per Hour: {salaryPerHour || 'N/A'}</Text>
                  <Text>Hours Per Week: {hoursNumber || 'N/A'}</Text>
                  <Text>
                    Additional Responsibilities:{' '}
                    {additionalResponsibilities || 'N/A'}
                  </Text>
                </Stack>
              </GridItem>
              {/* Other Details */}

              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Additional Information</Text>
                  <Text>
                    Registration Number: {registrationNumber || 'N/A'}
                  </Text>
                  <Text>Generation: {generation || 'N/A'}</Text>
                  <Text>Country of Origin: {countryFrom || 'N/A'}</Text>
                  <Text>Arrival Date: {arrivalDate || 'N/A'}</Text>
                  <Text>
                    Previous Institutes: {previousInstitutes || 'N/A'}
                  </Text>
                </Stack>
              </GridItem>
            </Grid>
            {/* Modify Button */}
            <HStack justifyContent={'flex-end'} mt={6}>
              <Button
                onClick={() => router.push(`${edit.replace('%id', data.id)}`)}
                colorScheme="orange"
                variant="outline"
              >
                {'Modifier'}
              </Button>
              <Button
                onClick={openDialog}
                colorScheme={colors.secondary.regular}
                variant="outline"
              >
                {'Affecter'}
              </Button>
              ,


            </HStack>
            {/* Modal */}
            <Modal isOpen={isDialogOpen} onClose={closeDialog} zIndex={1500}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Assign {firstname || ''} {lastname || ''} to a New School</ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    <strong>Current School:</strong> {etablissement || 'Not Assigned'}
                  </Text>

                  <Select
                    options={schoolOptions}
                    value={schoolOptions.find((option) => option.value === selectedSchool)}
                    onChange={(selectedOption) => setSelectedSchool(selectedOption.value)}
                    placeholder="Select a school"
                    isSearchable
                  />
                </ModalBody>
                <ModalFooter>
                  <Button onClick={closeDialog} colorScheme="gray" mr={3}>
                    Cancel
                  </Button>

                  <Button onClick={handleAssign} colorScheme="orange" isDisabled={!selectedSchool}>
                    Confirm
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

export const TeacherDataSet = ({
  role,
  data = [],
  schools,
  columns,
  selectedIndex = 0,
  token,
}) => {
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null); // To track the currently expanded row

  let filtered = [];
  filtered.length = data.length;

  filtered = useMemo(() =>
    reportingFilter({
      data,
      position: selectedIndex,
      needle: filterText,
    })
  );

  const router = useRouter();
  const subHeaderComponentMemo = useMemo(() => {
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
              placeholder={'Rechercher un enseignant'}
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          {/* onExport={() => downloadCSV(filtered[selectedIndex])} */}
          <HStack pl={4}>
            <FormFilter onExport={() => { }} />
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>

        {role?.name != '' && (
          <Button
            onClick={() =>
              router.push(routes.page_route.dashboard.direction.teachers.create)
            }
            colorScheme={'orange'}
            bgColor={colors.primary.regular}
            px={10}
          >
            {'Recruter un enseignant'}
          </Button>


        )}
      </HStack>
    );
  }, [filterText, selectedIndex]);
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
      initialState={{ sortBy: [{ id: 'createdAt', desc: true }] }}
      subHeader
      expandOnRowClicked
      expandableRowsHideExpander
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id} // Expand only the selected row
      onRowClicked={handleRowExpandToggle} // Handle row click to expand/collapse
      expandableRowsComponent={
        (data) => ExpandedComponent({ ...data, schools, token })
      }
      pagination
    />
  );
};
