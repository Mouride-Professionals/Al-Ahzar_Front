import { Box, HStack, Stack, Text, WrapItem } from "@chakra-ui/react";
import { SecondaryButton } from "@components/common/button";
import { FormInput, FormSubmit } from "@components/common/input/FormInput";
import { expenseCreationFormHandler } from "@handlers"; // You'll need to create this
import { colors, forms } from "@theme";
import { expenseSchema } from "@utils/schemas"; // You'll need to create this
import { mapFormInitialValues } from "@utils/tools/mappers";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

export const CreateExpenseForm = ({
    action,
    token,
    setHasSucceeded,
    school, // Array of school options for dropdown
    schoolYear, // Array of school year options for dropdown
}) => {
    const router = useRouter();

    const {
        inputs: {
            expense: {
                creation: { expenseDate, amount, category, description },
            },
        },
        messages: {
            expense: {
                creation: { info: { generalInfoMessage } },
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
                        <Text color={colors.secondary.regular} fontWeight="700">
                            {generalInfoMessage}
                        </Text>
                        <HStack align="center" justifyContent="space-between">
                            <WrapItem w={370}>
                                <FormInput
                                    {...expenseDate}
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
                            <SecondaryButton h={50} message="Annuler" onClick={() => action(false)} />
                        </Box>
                        <Box >
                            <FormSubmit
                                uid="expenseCreation"
                                submit_message="Créer une dépense"
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