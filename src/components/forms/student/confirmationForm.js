import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { confirmEnrollmentFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { studentConfirmationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export const StudentConfirmationForm = ({
  enrollment,
  student,
  setHasSucceeded,
  token,
}) => {
  const router = useRouter();
  const t = useTranslations('components');
  const {
    id,
    attributes: {
      student: {
        data: {
          id: studentId,
          attributes: { firstname, lastname, type },
        },
      },
      class: {
        data: {
          attributes: { level, letter },
        },
      },
    },
  } = student;
  const {
    inputs: {
      student: { confirm: {
        amount,
        monthOf,
        paymentDetail: {
          monthlyFee,
          enrollmentFee,
          blouseFee,
          examFee,
          parentContributionFee
        }
      } },
    },
    messages: {
      confirmation: {
        info: {
          studentInfoMessage,
          paymentDetailsMessage,
        },
        labels: {
          name: nameLabel,
          type: typeLabel,
          class: classLabel,
          cancel: cancelLabel,
          validatePayment: validatePaymentLabel,
        },
      },
    },
  } = forms;

  return (
    <Formik
      validationSchema={studentConfirmationSchema}
      initialValues={mapFormInitialValues(
        studentConfirmationSchema._nodes
      )}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        confirmEnrollmentFormHandler({
          enrollment: enrollment,
          student: studentId,
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
      }) => (
        <Stack px={10} py={10}>
          <Stack>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(studentInfoMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <Text fontSize="md">
                  <strong>{t(nameLabel)}:</strong> {firstname} {lastname}
                </Text>
              </WrapItem>
              <WrapItem w={370}>
                <Text fontSize="md">
                  <strong>{t(typeLabel)}:</strong> {type}
                </Text>
              </WrapItem>
              <WrapItem w={370}>
                <Text fontSize="md">
                  <strong>{t(classLabel)}:</strong> {level} {letter}
                </Text>
              </WrapItem>
            </HStack>
          </Stack>
          <Stack mt={5}>
            <Text color={colors.secondary.regular} fontWeight={'700'}>
              {t(paymentDetailsMessage)}
            </Text>
            <HStack align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...amount}
                  label={t(amount.label)}
                  placeholder={t(amount.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.amount}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...enrollmentFee}
                  label={t(enrollmentFee.label)}
                  placeholder={t(enrollmentFee.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.enrollmentFee}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...monthOf}
                  label={t(monthOf.label)}
                  placeholder={t(monthOf.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.monthOf}
                />
              </WrapItem>
            </HStack>
            <HStack mt={5} align={'center'} justifyContent={'space-between'}>
              <WrapItem w={370}>
                <FormInput
                  {...monthlyFee}
                  label={t(monthlyFee.label)}
                  placeholder={t(monthlyFee.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.monthlyFee}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...examFee}
                  label={t(examFee.label)}
                  placeholder={t(examFee.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.examFee}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...blouseFee}
                  label={t(blouseFee.label)}
                  placeholder={t(blouseFee.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.blouseFee}
                />
              </WrapItem>
              <WrapItem w={370}>
                <FormInput
                  {...parentContributionFee}
                  label={t(parentContributionFee.label)}
                  placeholder={t(parentContributionFee.placeholder)}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  value={values.parentContributionFee}
                />
              </WrapItem>
            </HStack>
          </Stack>
          <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
            <Box w={'15%'} mr={5}>
              <SecondaryButton
                h={50}
                message={t(cancelLabel)}
                onClick={() => router.back()}
              />
            </Box>
            <Box w={'20%'}>
              <FormSubmit
                uid={'registration'}
                touched={touched}
                errors={errors}
                submit_message={t(validatePaymentLabel)}
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
