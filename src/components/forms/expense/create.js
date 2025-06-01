import { Box, HStack, Stack, Text, WrapItem } from "@chakra-ui/react";
import { SecondaryButton } from "@components/common/button";
import { FormInput, FormSubmit } from "@components/common/input/FormInput";
import { expenseCreationFormHandler } from "@handlers";
import { colors, forms } from "@theme";
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
                <Stack px={10} py={10}>
                    <Stack>
                        
                        <HStack align="center" justifyContent="space-between">
                            <WrapItem w={370}>
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
                            <WrapItem w={370}>
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
                            <WrapItem w={370}>
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
                        </HStack>
                        <HStack align="center" justifyContent="space-between">
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
                        </HStack>
                    </Stack>

                    <HStack alignItems="flex-end" justifyContent="flex-end" pt={10}>
                        <Box mr={5}>
                            <SecondaryButton
                                h={50}
                                message={t('forms.actions.expense.cancel')}
                                onClick={() => action(false)}
                            />
                        </Box>
                        <Box>
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