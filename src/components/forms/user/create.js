import { Box, HStack, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { userCreationFormHandler } from '@handlers';
import { colors, forms } from '@theme';
import { userCreationSchema } from '@utils/schemas';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const CreateUserForm = ({
    schools,
    roles,
    setHasSucceeded,
    token,
    initialData = {},
    isEdit = false,
}) => {
    const router = useRouter();
    const t = useTranslations('components');

    const initialValues = mapFormInitialValues(
        userCreationSchema._nodes,
        initialData
    );

    const {
        inputs: {
            user: {
                creation: {
                    username,
                    firstname,
                    lastname,
                    email,
                    password,
                    role,
                    school,
                },
            },
        },
        messages: {
            user: {
                creation: { info: { generalInfoMessage } },
            },
        },
    } = forms;

    const schoolOptions = schools.data.map((school) => ({
        name: school.attributes.name,
        value: school.id,
    }));

    return (
        <Formik
            validationSchema={userCreationSchema}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
                userCreationFormHandler({
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
            }) => (
                <Stack px={10} py={10}>
                    {/* Personal Information Section */}
                    <Stack>
                        <Text color={colors.secondary.regular} fontWeight={'700'}>
                            {t(generalInfoMessage)}
                        </Text>
                        <HStack align={'center'} justifyContent={'space-between'}>
                            <WrapItem w={"49%"}>
                                <FormInput
                                    {...firstname}
                                    label={t(firstname.label)}
                                    placeholder={t(firstname.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.firstname}
                                />
                            </WrapItem>
                            <WrapItem w={"49%"}>
                                <FormInput
                                    {...lastname}
                                    label={t(lastname.label)}
                                    placeholder={t(lastname.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.lastname}
                                />
                            </WrapItem>
                        </HStack>
                        <HStack align={'center'} justifyContent={'space-between'} pt={5}>
                            <WrapItem w={"49%"}>
                                <FormInput
                                    {...username}
                                    label={t(username.label)}
                                    placeholder={t(username.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.username}
                                />
                            </WrapItem>
                            <WrapItem w={"49%"}>
                                <FormInput
                                    {...email}
                                    label={t(email.label)}
                                    placeholder={t(email.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.email}
                                />
                            </WrapItem>
                            {/* If you want to show password field, uncomment below
                            <WrapItem w={370}>
                                <FormInput
                                    {...password}
                                    type="password"
                                    label={t(password.label)}
                                    placeholder={t(password.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.password}
                                />
                            </WrapItem>
                            */}
                        </HStack>
                        {/* Adding Role and School fields */}
                        <HStack align={'center'} justifyContent={'space-between'} pt={5}>
                            <WrapItem w={"49%"}>
                                <FormInput
                                    {...role}
                                    label={t(role.label)}
                                    placeholder={t(role.placeholder)}
                                    options={roles}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.role}
                                />
                            </WrapItem>
                            <WrapItem w={'49%'}>
                                <FormInput
                                    select={true}
                                    options={schoolOptions}
                                    {...school}
                                    label={t(school.label)}
                                    placeholder={t(school.placeholder)}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.school}
                                />
                            </WrapItem>
                        </HStack>
                    </Stack>

                    {/* Actions */}
                    <HStack alignItems={'flex-start'} justifyContent={'flex-end'} pt={10}>
                        <Box w={'15%'} mr={5}>
                            <SecondaryButton
                                h={50}
                                message={t('forms.actions.user.cancel')}
                                onClick={() => router.back()}
                            />
                        </Box>
                        <Box w={'20%'}>
                            <FormSubmit
                                uid={'userCreation'}
                                submit_message={t('forms.actions.user.create')}
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