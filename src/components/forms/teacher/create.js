import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import {
  teacherRecruitmentFormHandler,
  teacherUpdateFormHandler,
} from '@handlers';
import { colors, forms } from '@theme';
import { teacherRecruitmentSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

export const CreateTeacherForm = ({
  schools,
  setHasSucceeded,
  token,
  initialData = {},
  isEdit = false,
}) => {
  const router = useRouter();
  const { id, attributes: teacherData } = initialData;
  const schoolOptions = schools.data.map((school) => ({
    name: school.attributes.name,
    value: school.id,
  }));

  // Set default initial values based on the mode
  const initialValues = mapFormInitialValues(
    teacherRecruitmentSchema._nodes,
    teacherData
  );

  //initialize the etablissement field with the school of the teacher
  if (isEdit) {
    initialValues.etablissement = teacherData.etablissement.data.id;
  }

  const {
    inputs: {
      teacher: {
        recruitment: {
          firstname,
          lastname,
          gender,
          phoneNumber,
          email,
          etablissement,
          birthDate,
          birthPlace,
          address,
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
        },
      },
    },
    messages: {
      teacher: {
        recruitment: {
          info: {
            personalInfoMessage,
            contactInfoMessage,
            additionalInfoMessage,
            contractInfoMessage,
          },
        },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={teacherRecruitmentSchema}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        isEdit
          ? teacherUpdateFormHandler({
              teacher: id,
              data: values,
              setSubmitting,
              setFieldError,
              token,
              hasSucceeded: setHasSucceeded,
            })
          : teacherRecruitmentFormHandler({
              token,
              data: values,
              setSubmitting,
              setFieldError,
              hasSucceeded: setHasSucceeded,
            });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Stack px={10} py={10}>
          {/* Personal Information Section */}
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {personalInfoMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...firstname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.firstname}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...lastname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.lastname}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...gender}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.gender}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...maritalStatus}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.maritalStatus}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...language}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.language}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...birthDate}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthDate}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...birthPlace}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthPlace}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...address}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.address}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  grow={2}
                  {...email}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.email}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...phoneNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.phoneNumber}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...academicDegree}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.academicDegree}
                />
              </WrapItem>

              <WrapItem w={'70%'}>
                <FormInput
                  {...professionalDegrees}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.professionalDegrees}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {/* Contract Information Section */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {contactInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  select={true}
                  options={schoolOptions}
                  {...etablissement}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.etablissement}
                />
              </WrapItem>

              <WrapItem w={'100%'}>
                <FormInput
                  {...disciplines}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.disciplines}
                />
              </WrapItem>
            </HStack>

            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...level}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.level}
                />
              </WrapItem>

              <WrapItem w={'100%'}>
                <FormInput
                  {...subjects}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.subjects}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {/* additional information */}
          <Stack py={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {contractInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...contractType}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.contractType}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...salary}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.salary}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...hoursNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.hoursNumber}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...arrivalDate}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.arrivalDate}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={370}>
                <FormInput
                  {...registrationNumber}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.registrationNumber}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...generation}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.generation}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  defaultValue={0}
                  {...salaryPerHour}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.salaryPerHour}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...countryFrom}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.countryFrom}
                />
              </WrapItem>
            </HStack>

            <HStack align={'center'} justifyContent={'space-between'} pt={5}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...additionalResponsibilities}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.additionalResponsibilities}
                />
              </WrapItem>
              <WrapItem w={'100%'}>
                <FormInput
                  {...previousInstitutes}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.previousInstitutes}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {/* Actions */}
          <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
            <Box w={'15%'} mr={5}>
              <SecondaryButton
                h={50}
                message={'Annuler'}
                onClick={() => router.back()}
              />
            </Box>
            <Box w={'20%'}>
              <FormSubmit
                uid={'recruitment'}
                submit_message={'Valider la demande'}
                {...{
                  touched,
                  errors,
                  handleSubmit,
                  isSubmitting,
                }}
              />
            </Box>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};
