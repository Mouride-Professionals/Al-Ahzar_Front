import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { confirmStudentFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { studentConfirmationchema } from '@utils/schemas';
import { Formik } from 'formik';

export const StudentConfirmationForm = ({
  student,
  setHasSucceeded,
  token,
}) => {
  const {
    inputs: {
      student: { confirm },
    },
  } = forms;

  return (
    <Formik
      validationSchema={studentConfirmationchema}
      initialValues={{
        studentType: '',
        socialCategory: '',
        comment: '',
      }}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        confirmStudentFormHandler({
          student,
          token,
          data: values,
          setSubmitting,
          setFieldError,
          setHasSucceeded,
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
              Informations personnelles
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...confirm.studentType}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.studentType}
                />
              </WrapItem>

              <WrapItem w={370}>
                <FormInput
                  {...confirm.socialCategory}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.socialCategory}
                />
              </WrapItem>

              <WrapItem w={370}>
                <FormInput
                  {...confirm.comment}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.comment}
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
                touched={touched}
                errors={errors}
                submit_message={'Valider le paiement'}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </Box>
          </HStack>
        </Stack>
      )}
    </Formik>
  );
};
