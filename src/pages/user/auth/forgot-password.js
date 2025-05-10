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
    useToast
} from '@chakra-ui/react';
import { AuthenticationLayout, AuthenticationLayoutForm } from '@components/layout/authentication';
import { colors, forms, messages, routes } from '@theme';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { fetcher } from 'src/lib/api';
import * as Yup from 'yup';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const toast = useToast(
        {
            position: 'top',
            duration: 5000,
            isClosable: true
        }
    );

    // Validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Veuillez entrer une adresse email valide')
            .required('L`adresse email est requise'),
        authentication: Yup.string().trim(),
    });

    const handleForgotPassword = async (values, { setSubmitting, setFieldError }) => {
        try {
            const response = await fetcher({
                uri: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/auth/forgot-password`,
                options: {
                    method: 'POST',
                    body: JSON.stringify({ email: values.email }),
                },
            });

            if (response.error) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to send reset email');
            }

            toast({
                title: 'Success',
                description: 'Password reset email sent successfully',
                status: 'success'
            });
            // Redirect to login page
            setTimeout(() => {
                router.push(routes.page_route.auth.initial);
            }, 3000);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to send reset email',
                status: 'error'
            });
            setFieldError('authentication', error.message || 'Failed to send reset email');

            // setFieldError('email', error.message || 'Failed to send reset email');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthenticationLayout title={'Login'}>
            <AuthenticationLayoutForm
                redirection_route={routes.page_route.auth.initial}
                title={messages.components.authentication.forgot_password.heading.title}
                subtitle={messages.components.authentication.forgot_password.heading.subtitle}
                specifics={messages.components.authentication.forgot_password.specifics}
            >
                <Box pt={10} w={'100%'} maxW={'400px'} mx={'auto'}>

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleForgotPassword}
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
                                {/* Email Field */}
                                <FormControl isInvalid={errors.email && touched.email}>
                                    <FormLabel fontWeight={'bold'}>
                                        {forms.inputs.forgot_password.email.label || 'Email Address'}
                                    </FormLabel>
                                    <Input
                                        bgColor={colors.white}
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        borderColor={colors.gray.regular}
                                        placeholder={forms.inputs.forgot_password.email.placeholder || 'Enter your email'}
                                        type="email"
                                        value={values.email}
                                        h={50}
                                        w={'100%'}
                                    />
                                    {errors.email && touched.email && (
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                                    {forms.inputs.forgot_password.submit || 'Send Reset Email'}
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