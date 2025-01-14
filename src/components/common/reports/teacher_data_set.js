import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  ScaleFade,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FormExport,
  FormFilter,
  FormSearch,
} from '@components/common/input/FormInput';
import { colors, routes } from '@theme';
import { downloadCSV } from '@utils/csv';
import { reportingFilter } from '@utils/mappers/kpi';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PiUserDuotone } from 'react-icons/pi';
import { BoxZone } from '../cards/boxZone';

// import { colors, routes } from '@theme';

const ExpandedComponent = ({ data }) => {
  const router = useRouter();
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
            </HStack>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

export const TeacherDataSet = ({
  role,
  data = [],
  columns,
  selectedIndex = 0,
  token,
}) => {
  const [filterText, setFilterText] = useState('');

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
            <FormFilter onExport={() => {}} />
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
            {'Ajouter un enseignant'}
          </Button>
        )}
      </HStack>
    );
  }, [filterText, selectedIndex]);

  return (
    <DataTable
      style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: 'createdAt', desc: true }] }}
      subHeader
      // selectableRows
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowsComponent={
        (data) => ExpandedComponent({ ...data, role, user_token: token })
        // expandableRowsComponent={(row) => <ExpandedComponent data={row} />}
      }
      pagination
    />
  );
};
