import { Box, HStack, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { SecondaryButton } from "@components/common/button";
import { FormInput, FormSubmit } from "@components/common/input/FormInput";
import { expenseCreationFormHandler } from "@handlers";
import { forms } from "@theme";
import { expenseSchema } from "@utils/schemas";
import { mapFormInitialValues } from "@utils/tools/mappers";
import { Formik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export const CreateExpenseForm = ({
    action,
    token,
    setHasSucceeded,
    school,
    schoolYear,
}) => {
    const router = useRouter();
    const t = useTranslations('components');

    const {
        inputs: {
            expense: {
                creation: { expenseDate, amount, category, description },
            },
        },
    } = forms;

    return (
        <Formik
            validationSchema={expenseSchema}
            initialValues={mapFormInitialValues(expenseSchema._nodes)}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
                expenseCreationFormHandler({
                    token,
                    data: {
                        ...values,
                        school: school,
                        schoolYear: schoolYear,
                    },
                    setSubmitting,
                    setFieldError,
                    hasSucceeded: () => {
                        setHasSucceeded(true);
                        action(true);
                    },
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

                        <Wrap spacing={{ base: 4, md: 5 }} justify="space-between">
                            <WrapItem w={{ base: '100%', md: '48%', lg: '30%' }}>
                                <FormInput
                                    {...expenseDate}
                                    label={t(expenseDate.label)}
                                    placeholder={t(expenseDate.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.expenseDate}
                                />
                            </WrapItem>
                            <WrapItem w={{ base: '100%', md: '48%', lg: '30%' }}>
                                <FormInput
                                    {...amount}
                                    type="number"
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
                                    {...category}
                                    label={t(category.label)}
                                    placeholder={t(category.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.category}
                                />
                            </WrapItem>
                        </Wrap>

                        <Wrap spacing={{ base: 4, md: 5 }}>
                            <WrapItem w="100%">
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
                        </Wrap>
                    </Stack>

                    <HStack
                        alignItems="flex-end"
                        justifyContent={{ base: 'center', md: 'flex-end' }}
                        pt={{ base: 6, md: 10 }}
                        spacing={{ base: 4, md: 5 }}
                        flexDirection={{ base: 'column', sm: 'row' }}
                    >
                        <Box w={{ base: '100%', sm: '40%', md: '15%' }}>
                            <SecondaryButton
                                h={{ base: 45, md: 50 }}
                                message={t('forms.actions.expense.cancel')}
                                onClick={() => action(false)}
                            />
                        </Box>
                        <Box w={{ base: '100%', sm: '60%', md: '20%' }}>
                            <FormSubmit
                                uid="expenseCreation"
                                submit_message={t('forms.actions.expense.create')}
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