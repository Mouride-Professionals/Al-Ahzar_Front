import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { teacherRecruitmentFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { teacherRecruitmentSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

export const CreateTeacherForm = ({ setHasSucceeded, token }) => {
    const router = useRouter();


    const {
        inputs: {
            teacher: {
                recruitment: {
                    firstname,
                    lastname,
                    sex,
                    phoneNumber,
                    email
                },
            },
        },
        messages: {
            teacher: {

                recruitment: {
                    info: {
                        personalInfoMessage,
                        contactInfoMessage,
                        additionalInfoMessage
                    }
                },
            },
        },
    } = forms;

    return (
        <Formik
            validationSchema={teacherRecruitmentSchema}
            initialValues={mapFormInitialValues(teacherRecruitmentSchema._nodes)}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
                teacherRecruitmentFormHandler({
                    token,
                    data: values,
                    setSubmitting,
                    setFieldError,
                    hasSucceeded: setHasSucceeded,
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
                            {personalInfoMessage}
                        </Text>
                        <HStack align={'center'} justifyContent={'space-between'}>
                            <WrapItem w={370}>
                                <FormInput
                                    {...firstname}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.firstname}
                                />
                            </WrapItem>

                            <WrapItem w={370}>
                                <FormInput
                                    {...lastname}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.lastname}
                                />
                            </WrapItem>

                            <WrapItem w={370}>
                                <FormInput
                                    {...sex}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.sex}
                                />
                            </WrapItem>
                        </HStack>
                    </Stack>



                    <Stack py={10}>
                        <Text color={colors.secondary.regular} fontWeight={'700'}>
                            {contactInfoMessage}
                        </Text>

                        <HStack align={'center'} justifyContent={'space-between'}>
                            <WrapItem w={'50%'}>
                                <FormInput
                                    {...email}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.email}
                                />
                            </WrapItem>

                            <WrapItem w={'50%'}>
                                <FormInput
                                    {...phoneNumber}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.phoneNumber}
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
                                uid={'recruitment'}
                                submit_message={"Valider la demande"}
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