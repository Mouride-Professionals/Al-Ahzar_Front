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
} from '@chakra-ui/react';
import { loginFormHandler } from '@handlers';
import { usePasswordType } from '@hooks';
import { authenticationSchema } from '@schemas';
import { colors, forms } from '@theme';
import { mapFormInitialValues } from '@utils/tools/mappers';
import { ErrorMessage, Formik } from 'formik';
import { Fragment, useEffect } from 'react';
import { VscEye } from 'react-icons/vsc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useCustomRedirect from 'src/lib/auth/redirect';

export const LoginForm = () => {
  const { passwordType, passwordTypeToggler } = usePasswordType();
  const { status } = useSession();
  const router = useRouter();

  // Use custom redirect for authenticated users
  useCustomRedirect();

  

  return (
    <Box pt={3} w={'100%'}>
      <Formik
        initialValues={mapFormInitialValues(authenticationSchema._nodes)}
        validationSchema={authenticationSchema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          loginFormHandler({
            data: values,
            setSubmitting,
            setFieldError,
            redirectOnSuccess: '/dashboard/direction', // Updated to dashboard
          })
          // .then((result) => {
          //   if (result.success) {
          //     router.push(result.callbackUrl);
          //   }
          // });
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
          <Fragment>
            <FormControl isInvalid={errors.identifier}>
              <FormLabel fontWeight={'bold'}>
                {forms.inputs.login.identifier.label}
              </FormLabel>
              <Input
                bgColor={colors.white}
                name={'identifier'}
                onChange={handleChange}
                onBlur={handleBlur}
                borderColor={colors.gray.regular}
                placeholder={forms.inputs.login.identifier.placeholder}
                type={'text'}
                value={values.identifier}
                h={50}
                w={'100%'}
              />
              {errors.identifier && touched.identifier && (
                <FormErrorMessage>{errors.identifier}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.password} py={5}>
              <FormLabel fontWeight={'bold'}>
                {forms.inputs.login.password.label}
              </FormLabel>
              <Box pos={'relative'}>
                <Input
                  bgColor={colors.white}
                  name={'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  borderColor={colors.gray.regular}
                  placeholder={forms.inputs.login.password.placeholder}
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

            <FormControl py={5}>
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
                {forms.inputs.login.submit}
              </Button>
              {errors.authentication && touched.authentication && (
                <VStack>
                  <ErrorMessage
                    style={{ color: colors.error }}
                    render={(authentication) => (
                      <Text color={colors.error}>{authentication}</Text>
                    )}
                    name={'authentication'}
                  />
                </VStack>
              )}
            </FormControl>
          </Fragment>
        )}
      </Formik>
    </Box>
  );
};