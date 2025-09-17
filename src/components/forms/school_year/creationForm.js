import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import {
  schoolYearCreationFormHandler,
  schoolYearUpdateFormHandler,
} from '@handlers';
import { colors, forms } from '@theme';
import { schoolYearSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Helper function to generate school year name from dates
const generateSchoolYearName = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();

  return `${startYear}-${endYear}`;
};

export const CreateSchoolYearForm = ({
  token,
  setHasSucceeded,
  isEdit = false,
  initialValues = null,
}) => {
  const t = useTranslations('components');
  const router = useRouter();
  const { id: schoolYearId = null, attributes: schoolYearAttributes = {} } =
    initialValues || {};

  const {
    inputs: {
      schoolYear: {
        creation: { name, startDate, endDate, description },
      },
    },
    messages: {
      schoolYear: {
        creation: {
          info: { generalInfoMessage },
        },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={schoolYearSchema}
      initialValues={
        isEdit
          ? schoolYearAttributes
          : mapFormInitialValues(schoolYearSchema._nodes)
      }
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        isEdit
          ? schoolYearUpdateFormHandler({
              schoolYear: schoolYearId,
              token,
              data: values,
              setSubmitting,
              setFieldError,
              hasSucceeded: setHasSucceeded,
            })
          : schoolYearCreationFormHandler({
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
        setFieldValue,
      }) => {
        // Auto-generate name when start or end date changes
        useEffect(() => {
          if (values.startDate && values.endDate && !isEdit) {
            const generatedName = generateSchoolYearName(
              values.startDate,
              values.endDate
            );
            if (generatedName !== values.name) {
              setFieldValue('name', generatedName);
            }
          }
        }, [values.startDate, values.endDate, isEdit, setFieldValue]);

        return (
          <Stack px={10} py={10}>
            <Stack>
              <Text color={colors.secondary.regular} fontWeight={'700'}>
                {t(generalInfoMessage)}
              </Text>

              {/* Display auto-generated name if not editing */}
              {!isEdit && values.name && (
                <HStack align={'center'} mb={4}>
                  <Text fontWeight={'600'} color={colors.secondary.regular}>
                    {t('forms.inputs.schoolYear.creation.name.label')}:
                  </Text>
                  <Text
                    fontWeight={'700'}
                    color={colors.primary.regular}
                    fontSize={'lg'}
                  >
                    {values.name}
                  </Text>
                </HStack>
              )}

              {/* Date inputs */}
              <HStack align={'center'} justifyContent={'space-between'}>
                <WrapItem w={'50%'}>
                  <FormInput
                    {...startDate}
                    label={t(startDate.label)}
                    placeholder={t(startDate.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.startDate}
                  />
                </WrapItem>
                <WrapItem w={'50%'}>
                  <FormInput
                    {...endDate}
                    label={t(endDate.label)}
                    placeholder={t(endDate.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.endDate}
                  />
                </WrapItem>
              </HStack>

              {/* Description input */}
              <HStack align={'center'} justifyContent={'space-between'}>
                <WrapItem w={'100%'}>
                  <FormInput
                    {...description}
                    textarea
                    label={t(description.label)}
                    placeholder={t(description.placeholder)}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    value={values.description}
                  />
                </WrapItem>
              </HStack>
            </Stack>
            <HStack alignItems={'flex-end'} justifyContent={'flex-end'} pt={10}>
              <Box w={'15%'} mr={5}>
                <SecondaryButton
                  h={50}
                  message={t('forms.actions.schoolYear.cancel')}
                  onClick={() => router.back()}
                />
              </Box>
              <Box w={'20%'}>
                <FormSubmit
                  uid={'schoolYearCreation'}
                  submit_message={
                    isEdit
                      ? t('forms.actions.schoolYear.edit')
                      : t('forms.actions.schoolYear.create')
                  }
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
        );
      }}
    </Formik>
  );
};
