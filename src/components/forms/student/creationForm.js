import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { registrationFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { mapClassesAndLetters, mapToOptions } from '@utils/mappers/student';
import { studentRegistrationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

export const CreateStudentForm = ({ classes, setHasSucceeded, token, schoolYear }) => {
  const router = useRouter();
  const cycles_options = mapToOptions({
    data: mapClassesAndLetters({ classes }).cycles,
  });
  const classes_options = mapToOptions({
    data: mapClassesAndLetters({ classes }).classes,
  });
  const sections_options = mapToOptions({
    data: mapClassesAndLetters({ classes }).sections,
  });


  const {
    inputs: {
      student: {
        registration: {
          firstname,
          lastname,
          sex,
          date,
          month,
          year,
          birthplace,
          parent_lastname,
          parent_firstname,
          parent_phone,
          level,
          classroom,
          class_letter,
        },
      },
    },
    messages: {
      registration: {
        info: {
          birthPlaceMessage,
          classInfoMessage,
          personalInfoMessage,
          tutorInfoMessage,
        },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={studentRegistrationSchema}
      initialValues={mapFormInitialValues(studentRegistrationSchema._nodes)}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        registrationFormHandler({
          token,
          data: {
            ...values, schoolYear
          },
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
        /* and other goodies */
      }) => (
        <Stack px={10} py={10}>
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
                  {...sex}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.sex}
                />
              </WrapItem>
            </HStack>
          </Stack>

          <Stack pt={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {birthPlaceMessage}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={230}>
                <FormInput
                  {...date}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.date}
                />
              </WrapItem>

              <WrapItem w={230}>
                <FormInput
                  {...month}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.month}
                />
              </WrapItem>

              <WrapItem w={230}>
                <FormInput
                  {...year}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.year}
                />
              </WrapItem>

              <WrapItem w={370}>
                <FormInput
                  {...birthplace}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.birthplace}
                />
              </WrapItem>
            </HStack>
          </Stack>

          <Stack py={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {tutorInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...parent_firstname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.parent_firstname}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...parent_lastname}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.parent_lastname}
                />
              </WrapItem>


              <WrapItem w={370}>
                <FormInput
                  {...parent_phone}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.parent_phone}
                />
              </WrapItem>
            </HStack>
          </Stack>

          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {classInfoMessage}
            </Text>

            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  select
                  options={cycles_options}
                  {...level}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.level}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  select
                  options={classes_options}
                  {...classroom}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.classroom}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  select
                  options={sections_options}
                  {...class_letter}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.class_letter}
                />
              </WrapItem>
            </HStack>
          </Stack>

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
                uid={'registration'}
                submit_message={"Valider l'inscription"}
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
