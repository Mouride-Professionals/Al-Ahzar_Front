import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { schoolYearCreationFormHandler, schoolYearUpdateFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { schoolYearSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

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
        creation: { info: { generalInfoMessage } },
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
      }) => (
        <Stack px={10} py={10}>
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(generalInfoMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...name}
                  label={t(name.label)}
                  placeholder={t(name.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.name}
                />
              </WrapItem>
              <WrapItem w={370}>
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
              <WrapItem w={370}>
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
      )}
    </Formik>
  );
};