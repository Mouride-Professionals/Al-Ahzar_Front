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
import { AuthenticationLayout, AuthenticationLayoutForm } from '@components/layout/authentication';
import { usePasswordType } from '@hooks';
import { colors, forms, messages, routes } from '@theme';
import { Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { VscEye } from 'react-icons/vsc';
import { fetcher } from 'src/lib/api';
import * as Yup from 'yup';

export default function SetPasswordPage() {
    const toast = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const setPasswordToken = searchParams.get('token'); // Get the token from the URL query params
    const { passwordType, passwordTypeToggler } = usePasswordType(); // Hook for toggling password visibility

    // Validation schema using Yup
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
        authentication: Yup.string().trim(),
    });

    const handleSetPassword = async (values, { setSubmitting, setFieldError }) => {
        // if (!setPasswordToken) {
        //     toast({
        //         title: 'Error',
        //         description: 'Invalid or missing token',
        //         status: 'error',
        //         duration: 5000,
        //     });
        //     setSubmitting(false);
        //     return;
        // }

        try {
            const response = await fetcher({
                uri: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/auth/set-password`,
                options: {
                    method: 'POST',
                    body: JSON.stringify({
                        password: values.password,
                        passwordConfirmation: values.confirmPassword,
                        token: setPasswordToken, // Pass the token to the backend
                    }),
                },
            });

            if (response.error) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to set password');
            }

            toast({
                title: 'Success',
                description: 'Password set successfully',
                status: 'success',
                duration: 5000,
            });

            // Redirect to login page after successful password setup
            router.push(routes.page_route.auth.initial);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to set password',
                status: 'error',
                duration: 5000,
            });
            setFieldError('authentication', error.message || 'Failed to set password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthenticationLayout title={'Set Password'}>
            <AuthenticationLayoutForm
                redirection_route={routes.page_route.auth.initial}
                title={messages.components.authentication.set_password.heading.title}
                subtitle={messages.components.authentication.set_password.heading.subtitle}
                specifics={messages.components.authentication.set_password.specifics}
            >
                <Box pt={10} w={'100%'} maxW={'400px'} mx={'auto'}>
                    <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSetPassword}
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
                            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
                                {/* New Password Field */}
                                <FormControl isInvalid={errors.password && touched.password}>
                                    <FormLabel fontWeight={'bold'}>
                                        {forms.inputs.change_password.password.label || 'New Password'}
                                    </FormLabel>
                                    <Box pos={'relative'}>
                                        <Input
                                            bgColor={colors.white}
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            borderColor={colors.gray.regular}
                                            placeholder={
                                                forms.inputs.change_password.password.placeholder ||
                                                'Enter new password'
                                            }
                                            type={passwordType}
                                            value={values.password}
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
                                    {errors.password && touched.password && (
                                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                                    )}
                                </FormControl>

                                {/* Confirm Password Field */}
                                <FormControl isInvalid={errors.confirmPassword && touched.confirmPassword}>
                                    <FormLabel fontWeight={'bold'}>
                                        {'Confirm Password'}
                                    </FormLabel>
                                    <Box pos={'relative'}>
                                        <Input
                                            bgColor={colors.white}
                                            name="confirmPassword"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            borderColor={colors.gray.regular}
                                            placeholder={
                                                forms.inputs.change_password.confirm_password.placeholder ||
                                                'Confirm new password'
                                            }
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
                                <Button
                                    type="submit"
                                    colorScheme="orange"
                                    bgColor={colors.primary.regular}
                                    h={50}
                                    w={'100%'}
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    { 'Set Password'}
                                </Button>
                                {errors.authentication && touched.authentication && (
                                    <VStack>
                                        <Text color={colors.error}>{errors.authentication}</Text>
                                    </VStack>
                                )}
                            </VStack>
                        )}
                    </Formik>
                </Box>
            </AuthenticationLayoutForm>
        </AuthenticationLayout>
    );
}