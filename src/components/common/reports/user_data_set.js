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
import { FormExport, FormFilter, FormSearch } from '@components/common/input/FormInput';
import { downloadCSV } from '@utils/csv';
import { reportingFilter } from '@utils/mappers/kpi';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PiUserDuotone } from 'react-icons/pi';
import Select from 'react-select';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, schools, token }) => {
  const router = useRouter();
  const toast = useToast({ position: 'top-right', duration: 3000, isClosable: true });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleAssign = async () => {
    if (!selectedSchool) {
      toast({
        title: 'No school selected',
        description: 'Please select a school to assign the user.',
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
          title: 'Assignment Successful',
          description: `User has been successfully assigned to ${schools.find((school) => school.id === parseInt(selectedSchool))?.name
            }.`,
          status: 'success',
        });
        router.refresh();
      } else {
        toast({
          title: 'Assignment Failed',
          description: 'Failed to assign the user. Please try again.',
          status: 'error',
        });
      }
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        title: 'Error Occurred',
        description: 'An error occurred while assigning the user.',
        status: 'error',
      });
    }
    closeDialog();
  };

  // Destructure fields from the user data.
  const {
    username,
    firstname,
    lastname,
    email,
    confirmed,
    blocked,
    school,
  } = data;


  // Create school options (if the user can be assigned to one of the available schools).
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
                      {confirmed ? 'Confirmed' : 'Not Confirmed'}{' '}
                      {blocked && '| Blocked'}
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
                    <Text>Etablissement: {school.name}</Text>
                  )}
                  {!school && (
                    <Text>{'Pas encore assigné'}</Text>
                  )}
                </Stack>
              </GridItem>

              {/* Additional Account Details */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>Account Details</Text>
                  <Text>Username: {username}</Text>
                  <Text>Status: {confirmed ? 'Active' : 'Inactive'}</Text>
                  <Text>Role: {data.role?.name || 'N/A'}</Text>
                </Stack>
              </GridItem>
            </Grid>

            {/* Action Buttons */}
            <HStack justifyContent={'flex-end'} mt={6}>
              <Button
                onClick={null}//{() => router.push(`/dashboard/direction/users/${data.id}/edit`)}
                colorScheme="orange"
                variant="outline"
              >
                Edit
              </Button>
              {school && (<Button onClick={school && openDialog} colorScheme="orange" variant="outline">
                Assign School
              </Button>)}
            </HStack>

            {/* Modal for school assignment */}

            <Modal isOpen={isDialogOpen} onClose={closeDialog} zIndex={1500}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  Assign {firstname || username} {lastname || ''} to a School
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    <strong>Current Association:</strong>{' '}
                    {school?.name || 'None'}
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

export const UserDataSet = ({ role, data = [], schools, columns, selectedIndex = 0, token }) => {
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
              placeholder={'Search for a user'}
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          <HStack pl={4}>
            <FormFilter onExport={() => { }} />
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>
        {role?.name != '' && (
          <Button
            onClick={() => router.push('/dashboard/direction/users/create')}
            colorScheme={'orange'}
            bgColor={'orange.500'}
            px={10}
          >
            Create User
          </Button>
        )}
      </HStack>
    );
  }, [filterText, selectedIndex, filtered, role]);
  const handleRowExpandToggle = (row) => {
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  return (
    <DataTable
      style={{ width: '100%', backgroundColor: 'white', borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: 'createdAt', desc: true }] }}
      subHeader
      expandOnRowClicked
      expandableRowsHideExpander
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id}
      onRowClicked={handleRowExpandToggle}
      expandableRowsComponent={(data) => ExpandedComponent({ ...data, schools, token })}
      pagination
    />
  );
};
