import { Box, Stack, Text, WrapItem } from '@chakra-ui/react';
import { SecondaryButton } from '@components/common/button';
import { FormInput, FormSubmit } from '@components/common/input/FormInput';
import { userCreationFormHandler, userUpdateFormHandler } from '@handlers';
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
    const userId = initialData?.id;

    const sanitizedInitialData = { ...initialData };

    if (sanitizedInitialData.role && typeof sanitizedInitialData.role === 'object') {
        sanitizedInitialData.role =
            sanitizedInitialData.role?.id ??
            sanitizedInitialData.role?.value ??
            '';
    }

    if (sanitizedInitialData.role !== undefined && sanitizedInitialData.role !== null && sanitizedInitialData.role !== '') {
        sanitizedInitialData.role = String(sanitizedInitialData.role);
    }

    if (sanitizedInitialData.school && typeof sanitizedInitialData.school === 'object') {
        sanitizedInitialData.school =
            sanitizedInitialData.school?.id ??
            sanitizedInitialData.school?.data?.id ??
            '';
    }

    if (sanitizedInitialData.school !== undefined && sanitizedInitialData.school !== null && sanitizedInitialData.school !== '') {
        sanitizedInitialData.school = String(sanitizedInitialData.school);
    }

    const initialValues = mapFormInitialValues(
        userCreationSchema._nodes,
        sanitizedInitialData
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

    const schoolOptions = (schools?.data || []).map((school) => ({
        name: school.attributes.name,
        value: String(school.id),
    }));
    const roleOptions = (roles || []).map((option) => ({
        ...option,
        value: String(option.value),
    }));
    const isSingleSchool = schoolOptions.length === 1;

    if (!initialValues.school && isSingleSchool) {
        initialValues.school = schoolOptions[0].value;
    }

    const submitLabel = isEdit
        ? t('forms.actions.user.edit')
        : t('forms.actions.user.create');

    return (
        <Formik
            validationSchema={userCreationSchema}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
                const normalizeId = (value) => {
                    if (value === undefined || value === null || value === '') {
                        return value;
                    }
                    const parsed = Number(value);
                    return Number.isNaN(parsed) ? value : parsed;
                };

                const formattedValues = {
                    ...values,
                    role: normalizeId(values.role),
                    school: normalizeId(values.school),
                };

                if (isEdit && userId) {
                    userUpdateFormHandler({
                        token,
                        data: formattedValues,
                        userId,
                        setSubmitting,
                        setFieldError,
                        hasSucceeded: setHasSucceeded,
                    });
                } else {
                    userCreationFormHandler({
                        token,
                        data: formattedValues,
                        setSubmitting,
                        setFieldError,
                        hasSucceeded: setHasSucceeded,
                    });
                }
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
                <Stack px={{ base: 2, md: 10 }} py={{ base: 2, md: 10 }} spacing={{ base: 6, md: 10 }}>
                    {/* Personal Information Section */}
                    <Stack>
                        <Text color={colors.secondary.regular} fontWeight={'700'}>
                            {t(generalInfoMessage)}
                        </Text>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                            <WrapItem w="100%">
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
                            <WrapItem w="100%">
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
                        </Stack>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
                            <WrapItem w="100%">
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
                            <WrapItem w="100%">
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
                            <WrapItem w="100%">
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
                        </Stack>
                        {/* Adding Role and School fields */}
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} pt={5}>
                            <WrapItem w="100%">
                                <FormInput
                                    {...role}
                                    label={t(role.label)}
                                    placeholder={t(role.placeholder)}
                                    options={roleOptions}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    touched={touched}
                                    value={values.role}
                                />
                            </WrapItem>
                            <WrapItem w="100%">
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
                                    isDisabled={isSingleSchool}
                                />
                            </WrapItem>
                        </Stack>
                    </Stack>

                    {/* Actions */}
                    <Stack
                        alignItems={{ base: 'stretch', md: 'flex-end' }}
                        justifyContent="flex-end"
                        pt={10}
                        spacing={4}
                        direction={{ base: 'column', md: 'row' }}
                    >
                        <Box w={{ base: '100%', md: '15%' }} mr={{ md: 5 }}>
                            <SecondaryButton
                                h={50}
                                message={t('forms.actions.user.cancel')}
                                onClick={() => router.back()}
                                w="100%"
                            />
                        </Box>
                        <Box w={{ base: '100%', md: '20%' }}>
                            <FormSubmit
                                uid={'userCreation'}
                                submit_message={submitLabel}
                                {...{
                                    touched,
                                    errors,
                                    handleSubmit,
                                    isSubmitting,
                                }}
                                w="100%"
                            />
                        </Box>
                    </Stack>
                </Stack>
            )}
        </Formik>
    );
};
