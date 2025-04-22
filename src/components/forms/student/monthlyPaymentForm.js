import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { monthlyPaymentSchema } from '@utils/schemas';
import { Form, Formik } from 'formik';

const MonthlyPaymentModal = ({
    isOpen,
    onClose,
    handleMonthlyPayment,
    initialValues,
    alreadyPaidMonths, // e.g: ['2025-09', '2025-10']
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} zIndex={1500}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Effectuer un paiement mensuel</ModalHeader>
                <ModalBody>
                    <Formik
                        validationSchema={monthlyPaymentSchema}
                        initialValues={initialValues}
                        onSubmit={async (values, { setSubmitting, setFieldError }) => {
                            // Extract the year-month (YYYY-MM) from the selected date.
                            const selectedMonth = values.monthOf.slice(0, 7);
                            if (alreadyPaidMonths && alreadyPaidMonths.includes(selectedMonth)) {
                                setFieldError('monthOf', 'Ce mois est déjà payé');
                                setSubmitting(false);
                                return;
                            }

                            try {
                                // Await the payment handler; it should throw if an error occurs.
                                await handleMonthlyPayment(values, setSubmitting, setFieldError);
                                // Optionally close the modal only on successful payment:
                                onClose();
                            } catch (error) {
                                // Do not close the modal. Error handling is assumed to be done in handleMonthlyPayment.
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({
                            values,
                            isSubmitting,
                            handleSubmit,
                            handleBlur,
                            handleChange,
                            errors,
                            touched,
                        }) => (
                            <Form>
                                <VStack spacing={4}>
                                    <FormInput
                                        uid="monthOf"
                                        type="date"
                                        label="Mois de paiement"
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                        value={values.monthOf}
                                    />
                                    <FormInput
                                        uid="amount"
                                        type="number"
                                        label="Montant"
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        errors={errors}
                                        touched={touched}
                                        value={values.amount}
                                    />
                                    {errors.payment && (
                                        <Text color="red.500">{errors.payment}</Text>
                                    )}
                                    <FormSubmit
                                        uid={'payment'}
                                        submit_message={"Enregistrer le paiement"}
                                        {...{
                                            touched,
                                            errors,
                                            handleSubmit,
                                            isSubmitting,
                                        }}
                                    />
                                </VStack>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} colorScheme="gray" mr={3}>
                        Annuler
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MonthlyPaymentModal;