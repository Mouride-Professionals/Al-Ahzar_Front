import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { registrationFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { mapClassesAndLetters, mapToOptions } from '@utils/mappers/student';
import { studentRegistrationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const CreateStudentForm = ({ classes, setHasSucceeded, token, schoolYear }) => {
  const router = useRouter();
  const t = useTranslations('components');
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
          socialCategory,
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
      }) => (
        <Stack px={10} py={10}>
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(personalInfoMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'} gap={8}>
              <WrapItem w={370}>
                <FormInput
                  {...firstname}
                  label={t(firstname.label)}
                  placeholder={t(firstname.placeholder)}
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
                  label={t(lastname.label)}
                  placeholder={t(lastname.placeholder)}
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
                  label={t(sex.label)}
                  placeholder={t(sex.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.sex}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...socialCategory}
                  label={t(socialCategory.label)}
                  placeholder={t(socialCategory.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.socialCategory}
                />
              </WrapItem>
            </HStack>
          </Stack>

          <Stack pt={10}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(birthPlaceMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={230}>
                <FormInput
                  {...date}
                  label={t(date.label)}
                  placeholder={t(date.placeholder)}
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
                  label={t(month.label)}
                  placeholder={t(month.placeholder)}
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
                  label={t(year.label)}
                  placeholder={t(year.placeholder)}
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
                  label={t(birthplace.label)}
                  placeholder={t(birthplace.placeholder)}
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
              {t(tutorInfoMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...parent_firstname}
                  label={t(parent_firstname.label)}
                  placeholder={t(parent_firstname.placeholder)}
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
                  label={t(parent_lastname.label)}
                  placeholder={t(parent_lastname.placeholder)}
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
                  label={t(parent_phone.label)}
                  placeholder={t(parent_phone.placeholder)}
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
              {t(classInfoMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  select
                  options={cycles_options}
                  {...level}
                  label={t(level.label)}
                  placeholder={t(level.placeholder)}
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
                  label={t(classroom.label)}
                  placeholder={t(classroom.placeholder)}
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
                  label={t(class_letter.label)}
                  placeholder={t(class_letter.placeholder)}
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
                message={t('forms.actions.student.cancel')}
                onClick={() => router.back()}
              />
            </Box>
            <Box w={'20%'}>
              <FormSubmit
                uid={'registration'}
                submit_message={t('forms.actions.student.create')}
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
