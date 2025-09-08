import { Box, HStack, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
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
        <Stack px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }}>
          <Stack spacing={{ base: 4, md: 6 }}>
            <Text 
              color={colors.secondary.regular} 
              fontWeight={'700'}
              fontSize={{ base: 'md', md: 'lg' }}
            >
              {t(studentInfoMessage)}
            </Text>
            <Wrap 
              spacing={{ base: 4, md: 6 }}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <WrapItem w={{ base: '100%', md: '45%', lg: '30%' }}>
                <Text fontSize={{ base: 'sm', md: 'md' }} w="100%">
                  <strong>{t(nameLabel)}:</strong> {firstname} {lastname}
                </Text>
              </WrapItem>
              <WrapItem w={{ base: '100%', md: '45%', lg: '30%' }}>
                <Text fontSize={{ base: 'sm', md: 'md' }} w="100%">
                  <strong>{t(typeLabel)}:</strong> {type}
                </Text>
              </WrapItem>
              <WrapItem w={{ base: '100%', md: '45%', lg: '30%' }}>
                <Text fontSize={{ base: 'sm', md: 'md' }} w="100%">
                  <strong>{t(classLabel)}:</strong> {level} {letter}
                </Text>
              </WrapItem>
            </Wrap>
          </Stack>
          <Stack mt={{ base: 6, md: 8 }} spacing={{ base: 4, md: 6 }}>
            <Text 
              color={colors.secondary.regular} 
              fontWeight={'700'}
              fontSize={{ base: 'md', md: 'lg' }}
            >
              {t(paymentDetailsMessage)}
            </Text>
            <Wrap 
              spacing={{ base: 4, md: 6 }}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <WrapItem w={{ base: '100%', md: '48%', lg: '30%' }}>
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
              <WrapItem w={{ base: '100%', md: '48%', lg: '30%' }}>
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
              <WrapItem w={{ base: '100%', md: '48%', lg: '30%' }}>
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
            </Wrap>
            
            <Wrap 
              spacing={{ base: 4, md: 6 }}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <WrapItem w={{ base: '100%', md: '48%', lg: '22%' }}>
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
              <WrapItem w={{ base: '100%', md: '48%', lg: '22%' }}>
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
              <WrapItem w={{ base: '100%', md: '48%', lg: '22%' }}>
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
              <WrapItem w={{ base: '100%', md: '48%', lg: '22%' }}>
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
            </Wrap>
          </Stack>
          <HStack 
            alignItems={'flex-start'} 
            justifyContent={{ base: 'center', md: 'flex-end' }} 
            pt={{ base: 8, md: 10 }}
            spacing={{ base: 4, md: 5 }}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            <Box w={{ base: '100%', sm: '40%', md: '15%' }}>
              <SecondaryButton
                h={{ base: 45, md: 50 }}
                message={t(cancelLabel)}
                onClick={() => router.back()}
              />
            </Box>
            <Box w={{ base: '100%', sm: '60%', md: '20%' }}>
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
