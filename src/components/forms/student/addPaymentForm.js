import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';

const PAYMENT_TYPES = [
  { name: 'Enrollment', value: 'enrollment' },
  { name: 'Monthly', value: 'monthly' },
  { name: 'Exam', value: 'exam' },
  { name: 'Blouse', value: 'blouse' },
  { name: 'Parent Contribution', value: 'parentContribution' },
  { name: 'Other', value: 'other' },
];

export default function AddPaymentModal({
  isOpen,
  onClose,
  enrollmentId,
  token,
  handleAddPayment,
  alreadyPaidMonths = [],
  allowedMonths = [],
}) {
  const t = useTranslations('components.forms.student.addPayment');
  const toast = useToast();

  const initialValues = {
    paymentType: 'monthly',
    monthOf: '',
    amount: '',
    comment: '',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered zIndex={1500}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validate={(values) => {
              const errors = {};
              if (!values.amount || Number(values.amount) <= 0) {
                errors.amount = t('amountRequired') || 'Amount is required';
              }

              if (values.paymentType === 'monthly') {
                if (!values.monthOf) {
                  errors.monthOf = t('monthRequired') || 'Month is required';
                } else {
                  const selectedMonth = values.monthOf.slice(0, 7);
                  if (
                    Array.isArray(alreadyPaidMonths) &&
                    alreadyPaidMonths.includes(selectedMonth)
                  ) {
                    errors.monthOf =
                      t('monthAlreadyPaid') || 'This month is already paid';
                  }
                  if (
                    Array.isArray(allowedMonths) &&
                    allowedMonths.length &&
                    !allowedMonths.includes(selectedMonth)
                  ) {
                    errors.monthOf =
                      t('monthNotInSchoolYear') ||
                      'Month is outside current school year';
                  }
                }
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setFieldError && setFieldError('payment', null);

              if (
                values.paymentType === 'monthly' &&
                values.monthOf &&
                Array.isArray(alreadyPaidMonths)
              ) {
                const selectedMonth = values.monthOf.slice(0, 7);
                if (alreadyPaidMonths.includes(selectedMonth)) {
                  setFieldError(
                    'monthOf',
                    t('monthAlreadyPaid') || 'This month is already paid'
                  );
                  setSubmitting(false);
                  return;
                }
              }

              try {
                await handleAddPayment(
                  {
                    enrollmentId,
                    paymentType: values.paymentType,
                    amount: Number(values.amount),
                    comment: values.comment,
                    monthOf:
                      values.paymentType === 'monthly' ? values.monthOf : null,
                  },
                  setSubmitting,
                  setFieldError
                );

                toast({
                  title: t('success'),
                  status: 'success',
                  duration: 3000,
                });
                onClose();
              } catch (err) {
                const message = err?.message || t('error');
                toast({ title: message, status: 'error', duration: 3000 });
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
              handleSubmit,
            }) => (
              <Form>
                <FormInput
                  uid="paymentType"
                  select
                  label={t('typeLabel')}
                  options={PAYMENT_TYPES.map((p) => ({
                    name: t(`types.${p.value}`) || p.name,
                    value: p.value,
                  }))}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  value={values.paymentType}
                />

                {values.paymentType === 'monthly' && (
                  <FormInput
                    uid="monthOf"
                    type="date"
                    label={t('monthLabel')}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    value={values.monthOf}
                  />
                )}

                <FormInput
                  uid="amount"
                  type="number"
                  label={t('amountLabel')}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  value={values.amount}
                  placeholder={t('amountPlaceholder')}
                />

                <FormInput
                  uid="comment"
                  textArea
                  label={t('commentLabel')}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  value={values.comment}
                  placeholder={t('commentPlaceholder')}
                />

                {errors.payment && touched.payment && (
                  <div style={{ color: 'red', marginTop: 8 }}>
                    {errors.payment}
                  </div>
                )}

                <FormSubmit
                  uid={'payment'}
                  submit_message={t('submit')}
                  touched={touched}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray" mr={3}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
