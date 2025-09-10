'use client';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { usePasswordType } from '@hooks';
import { changePasswordSchema } from '@schemas';
import { updateUser } from '@services/user';
import { colors, forms } from '@theme';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { Formik } from 'formik';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { VscEye } from 'react-icons/vsc';
import { fetcher } from 'src/lib/api';

export const ChangePasswordForm = () => {
    const { passwordType, passwordTypeToggler } = usePasswordType();
    const { data: session } = useSession();
    const router = useRouter();
    const { forcePasswordChange } = router.query;
    const toast = useToast({
        position: 'top',
        duration: 5000,
        isClosable: true,
        variant: 'solid'
    });
    const t = useTranslations('components.forms.inputs.change_password');

    const handleChangePassword = async (values, { setSubmitting, setFieldError }) => {
        if (!session?.user?.accessToken) {
            toast({
                title: t('toast.errorTitle'),
                description: t('toast.notAuthenticated'),
                status: 'error',
            });
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetcher({
                uri: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/auth/change-password`,
                options: {
                    method: 'POST',
                    body: JSON.stringify({
                        currentPassword: values.currentPassword,
                        password: values.newPassword,
                        passwordConfirmation: values.confirmPassword,
                    }),
                },
                user_token: session.user.accessToken,
            });

            if (response.error ) {
                const errorText = response.text();
                throw new Error(errorText || t('toast.failed'));
            } else {
                // update user forcePasswordChange to false
                const user = session.user;
                const userResponse = await updateUser({
                    user: user.id,
                    payload: {
                        forcePasswordChange: false,
                    },
                    token: session.user.accessToken
                });
                if (userResponse.error) {
                    const errorText = userResponse.text();
                    throw new Error(errorText || t('toast.failedUpdate'));
                }
            }

            toast({
                title: t('toast.successTitle'),
                description: t('toast.success'),
                status: 'success',
            });
            signOut();

        } catch (error) {
            toast({
                title: t('toast.errorTitle'),
                description: error.message || t('toast.failed'),
                status: 'error',
            });
            setFieldError('authentication', error.message || t('toast.failed'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box pt={3} w={'100%'}>
            <Formik
                initialValues={mapFormInitialValues(changePasswordSchema._nodes)}
                validationSchema={changePasswordSchema}
                onSubmit={handleChangePassword}
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
                    <Fragment>
                        {/* Current Password */}
                        <FormControl isInvalid={errors.currentPassword && touched.currentPassword} pb={5}>
                            <FormLabel fontWeight={'bold'}>
                                {t('current_password.label')}
                            </FormLabel>
                            <Box pos={'relative'}>
                                <Input
                                    bgColor={colors.white}
                                    name={'currentPassword'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    borderColor={colors.gray.regular}
                                    placeholder={(forms.inputs.change_password.current_password.placeholder)}
                                    type={passwordType}
                                    value={values.currentPassword}
                                    h={50}
                                    w={'100%'}
                                />
                                <Box
                                    onClick={passwordTypeToggler}
                                    _hover={{ cursor: 'pointer' }}
                                    pos={'absolute'}
                                    right={'2.5%'}
                                    top={'30%'}
                                >
                                    <VscEye size={20} />
                                </Box>
                            </Box>
                            {errors.currentPassword && touched.currentPassword && (
                                <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                            )}
                        </FormControl>

                        {/* New Password */}
                        <FormControl isInvalid={errors.newPassword && touched.newPassword} pb={5}>
                            <FormLabel fontWeight={'bold'}>
                                {t('new_password.label')}
                            </FormLabel>
                            <Box pos={'relative'}>
                                <Input
                                    bgColor={colors.white}
                                    name={'newPassword'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    borderColor={colors.gray.regular}
                                    placeholder={forms.inputs.change_password.new_password.placeholder}
                                    type={passwordType}
                                    value={values.newPassword}
                                    h={50}
                                    w={'100%'}
                                />
                                <Box
                                    onClick={passwordTypeToggler}
                                    _hover={{ cursor: 'pointer' }}
                                    pos={'absolute'}
                                    right={'2.5%'}
                                    top={'30%'}
                                >
                                    <VscEye size={20} />
                                </Box>
                            </Box>
                            {errors.newPassword && touched.newPassword && (
                                <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                            )}
                        </FormControl>

                        {/* Confirm Password */}
                        <FormControl isInvalid={errors.confirmPassword && touched.confirmPassword} pb={5}>
                            <FormLabel fontWeight={'bold'}>
                                {t('confirm_password.label')}
                            </FormLabel>
                            <Box pos={'relative'}>
                                <Input
                                    bgColor={colors.white}
                                    name={'confirmPassword'}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    borderColor={colors.gray.regular}
                                    placeholder={forms.inputs.change_password.confirm_password.placeholder}
                                    type={passwordType}
                                    value={values.confirmPassword}
                                    h={50}
                                    w={'100%'}
                                />
                                <Box
                                    onClick={passwordTypeToggler}
                                    _hover={{ cursor: 'pointer' }}
                                    pos={'absolute'}
                                    right={'2.5%'}
                                    top={'30%'}
                                >
                                    <VscEye size={20} />
                                </Box>
                            </Box>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                            )}
                        </FormControl>

                        {/* Submit Button */}
                        <FormControl pb={5}>
                            <Button
                                mb={3}
                                onClick={handleSubmit}
                                colorScheme={'orange'}
                                bgColor={colors.primary.regular}
                                h={50}
                                w={'100%'}
                                type={'submit'}
                                isDisabled={isSubmitting}
                            >
                                {t('submit')}
                            </Button>
                            {errors.authentication && touched.authentication && (
                                <VStack>
                                    <Text color={colors.error}>{errors.authentication}</Text>
                                </VStack>
                            )}
                        </FormControl>
                    </Fragment>
                )}
            </Formik>
        </Box>
    );
};