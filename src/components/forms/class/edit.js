import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { updateClassroomFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { classCreationSchema } from '@utils/schemas';
import { ErrorMessage, Formik } from 'formik';
import { useTranslations } from 'next-intl';

export const ClassEditForm = ({ classData, token, action }) => {
  const t = useTranslations('components');
  const {
    inputs: {
      class: {
        creation: { grade, level, letter, description },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={classCreationSchema}
      initialValues={{
        grade: classData?.cycle || '',
        level: classData?.level || '',
        letter: classData?.letter || '',
        description: classData?.description || '',
      }}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        updateClassroomFormHandler({
          token,
          classId: classData?.id,
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
      }) => (
        <Stack px={10} py={10}>
          <Stack>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...grade}
                  label={t(grade.label)}
                  placeholder={t(grade.placeholder)}
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
                  label={t(level.label)}
                  placeholder={t(level.placeholder)}
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
                  label={t(letter.label)}
                  placeholder={t(letter.placeholder)}
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
            <HStack py={5} align={'center'} justifyContent={'space-between'}>
              <WrapItem w={'100%'}>
                <FormInput
                  {...description}
                  label={t(description.label)}
                  placeholder={t(description.placeholder)}
                  {...{
                    errors,
                    handleChange,
                    handleBlur,
                    touched,
                  }}
                  value={values.description}
                />
              </WrapItem>
            </HStack>
          </Stack>

          {errors.schoolCreation && (
            <ErrorMessage
              style={{ color: colors.error }}
              render={(schoolCreation) => (
                <Text color={colors.error}>
                  {t('forms.messages.classroom.editing.errors.problem', {
                    error: schoolCreation.schoolCreation,
                  })}
                </Text>
              )}
            />
          )}

          <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
            <Box w={'20%'} mr={5}>
              <SecondaryButton
                h={50}
                message={t('forms.actions.class.cancel')}
                onClick={action}
              />
            </Box>
            <Box w={'40%'}>
              <FormSubmit
                uid={'classEdit'}
                submit_message={t('forms.actions.class.edit')}
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
