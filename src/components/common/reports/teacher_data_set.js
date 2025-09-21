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
import { assignTeacher } from '@services/teacher';
import { colors, routes } from '@theme';
import { reportingFilter } from '@utils/mappers/kpi';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PiUserDuotone } from 'react-icons/pi';
import Select from 'react-select';
import { BoxZone } from '../cards/boxZone';

const ExpandedComponent = ({ data, schools, token }) => {
  const t = useTranslations('components.dataset.teachers');
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
        title: 'No school selected',
        description: 'Please select a school to assign the teacher.',
        status: 'warning',
      });
      return;
    }
    try {
      const response = await assignTeacher({
        teacher: data.id,
        school: selectedSchool,

        token: token,
      });
      if (response) {
        toast({
          title: 'Assignment Successful',
          description: `Teacher has been successfully assigned to ${schools.find((school) => school.id === parseInt(selectedSchool))?.name}.`,
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
      });
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
    school,
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
                    {gender && (
                      <Text color={colors.secondary.regular}>
                        {t('gender')}: {gender}
                      </Text>
                    )}
                    {createdAt && (
                      <Text color={colors.secondary.regular}>
                        {t('joinedOn')}:{' '}
                        {new Date(createdAt).toLocaleDateString()}
                      </Text>
                    )}
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
                  <Text fontWeight={'bold'}>{t('contactDetails')}</Text>
                  {email && (
                    <Text>
                      {t('email')}: {email}
                    </Text>
                  )}
                  {phoneNumber && (
                    <Text>
                      {t('phone')}:
                      <Text
                        as="span"
                        dir="ltr"
                        display="inline-block"
                        style={{ unicodeBidi: 'isolate-override' }}
                      >
                        {phoneNumber}
                      </Text>
                    </Text>
                  )}
                  {address && (
                    <Text>
                      {t('address')}: {address}
                    </Text>
                  )}
                </Stack>
              </GridItem>

              {/* Personal Information */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>{t('personalDetails')}</Text>
                  {birthDate && (
                    <Text>
                      {t('birthDate')}: {birthDate}
                    </Text>
                  )}
                  {birthPlace && (
                    <Text>
                      {t('birthPlace')}: {birthPlace}
                    </Text>
                  )}
                  {maritalStatus && (
                    <Text>
                      {t('maritalStatus')}: {maritalStatus}
                    </Text>
                  )}
                  {language && (
                    <Text>
                      {t('language')}: {language}
                    </Text>
                  )}
                  {subjects && (
                    <Text>
                      <strong>{t('subjects')}:</strong> {subjects.join(',  ')}
                    </Text>
                  )}
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
                  <Text fontWeight={'bold'}>{t('professionalDetails')}</Text>
                  {school && (
                    <Text>
                      {t('institution')}: {school}
                    </Text>
                  )}
                  {disciplines?.length > 0 && (
                    <Text>
                      <strong>{t('disciplines')}:</strong>{' '}
                      {disciplines.join(', ')}
                    </Text>
                  )}
                  {academicDegree && (
                    <Text>
                      {t('academicDegree')}: {academicDegree}
                    </Text>
                  )}
                  {professionalDegrees && (
                    <Text>
                      <strong>{t('professionalDegrees')}:</strong>{' '}
                      {professionalDegrees.join(', ')}
                    </Text>
                  )}
                  {contractType && (
                    <Text>
                      {t('contractType')}: {contractType}
                    </Text>
                  )}
                  {level && (
                    <Text>
                      {t('level')}: {level}
                    </Text>
                  )}
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
                  <Text fontWeight={'bold'}>{t('workDetails')}</Text>
                  {salary && (
                    <Text>
                      {t('salary')}: {salary}
                    </Text>
                  )}
                  {salaryPerHour && (
                    <Text>
                      {t('salaryPerHour')}: {salaryPerHour}
                    </Text>
                  )}
                  {hoursNumber && (
                    <Text>
                      {t('hoursPerWeek')}: {hoursNumber}
                    </Text>
                  )}
                  {additionalResponsibilities && (
                    <Text>
                      {t('additionalResponsibilities')}:{' '}
                      {additionalResponsibilities}
                    </Text>
                  )}
                </Stack>
              </GridItem>

              {/* Other Details */}
              <GridItem>
                <Stack spacing={4}>
                  <Text fontWeight={'bold'}>{t('additionalInformation')}</Text>
                  {registrationNumber && (
                    <Text>
                      {t('registrationNumber')}: {registrationNumber}
                    </Text>
                  )}
                  {generation && (
                    <Text>
                      {t('generation')}: {generation}
                    </Text>
                  )}
                  {countryFrom && (
                    <Text>
                      {t('countryOfOrigin')}: {countryFrom}
                    </Text>
                  )}
                  {arrivalDate && (
                    <Text>
                      {t('arrivalDate')}: {arrivalDate}
                    </Text>
                  )}
                  {previousInstitutes && (
                    <Text>
                      {t('previousInstitutes')}: {previousInstitutes}
                    </Text>
                  )}
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
                {t('edit')}
              </Button>
              <Button
                onClick={openDialog}
                colorScheme={colors.secondary.regular}
                variant="outline"
              >
                {t('assign')}
              </Button>
            </HStack>
            {/* Modal */}
            <Modal isOpen={isDialogOpen} onClose={closeDialog} zIndex={1500}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  {t('assignToSchool', {
                    firstname: firstname || '',
                    lastname: lastname || '',
                  })}
                </ModalHeader>
                <ModalBody>
                  <Text mb={4}>
                    <strong>{t('currentSchool')}:</strong>{' '}
                    {school || t('notAssigned')}
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

export const TeacherDataSet = ({
  role,
  data = [],
  schools,
  columns,
  selectedIndex = 0,
  token,
}) => {
  const t = useTranslations('components.dataset.teachers');
  const router = useRouter();

  const actionButton = (
    <Button
      onClick={() =>
        router.push(routes.page_route.dashboard.direction.teachers.create)
      }
      colorScheme="orange"
      bgColor={colors.primary.regular}
    >
      {t('recruitTeacher')}
    </Button>
  );

  return (
    <DataTableLayout
      columns={columns}
      data={data}
      role={role}
      token={token}
      translationNamespace="components.dataset.teachers"
      actionButton={actionButton}
      expandedComponent={(data) =>
        ExpandedComponent({ ...data, schools, token })
      }
      filterFunction={reportingFilter}
      selectedIndex={selectedIndex}
    />
  );
};
