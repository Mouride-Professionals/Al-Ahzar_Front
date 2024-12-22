import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { createClassromFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { classCreationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { ErrorMessage, Formik } from 'formik';

export const ClassCreationForm = ({ school, token, action }) => {
  console.log('classCreationSchema', school, token, action);

  const {
    inputs: {
      class: {
        creation: { grade, level, letter },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={classCreationSchema}
      initialValues={mapFormInitialValues(classCreationSchema._nodes)}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        createClassromFormHandler({
          token,
          school,
          data: values,
          setSubmitting,
          setFieldError,
          action,
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
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...grade}
                  value={values.grade}
                  {...{
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                  }}
                />
              </WrapItem>
            </HStack>
            <HStack py={5} align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...level}
                  value={values.level}
                  {...{
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                  }}
                />
              </WrapItem>
            </HStack>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...letter}
                  {...{
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                  }}
                  value={values.letter}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {errors.schoolCreation && (
            <ErrorMessage
              style={{ color: colors.error }}
              render={(schoolCreation) => (
                <Text color={colors.error}>
                  {schoolCreation.schoolCreation}
                </Text>
              )}
            />
          )}

          <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
            <Box w={'20%'} mr={5}>
              <SecondaryButton h={50} message={'Annuler'} onClick={action} />
            </Box>
            <Box w={'40%'}>
              <FormSubmit
                uid={'registration'}
                submit_message={'Créer la classe'}
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
