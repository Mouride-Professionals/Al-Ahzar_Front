'use client';

import { Button, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { AuthenticationLayout } from '@components/layout/authentication';
import { colors, routes } from '@theme';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from 'src/lib/api';

export default function ConfirmEmail() {
  const t = useTranslations('components.authentication.email_confirmation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmation = searchParams.get('confirmation');
  const [status, setStatus] = useState(t('form.verification.verifying'));
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const toast = useToast({
    position: 'top-right',
    duration: 5000,
    isClosable: true,
  });

  useEffect(() => {
    const verifyEmail = async () => {
      // Handle missing confirmation token
      if (!confirmation) {
        setStatus(t('form.verification.error_token'));
        setIsLoading(false);
        setIsSuccess(false);
        toast({
          title: t('form.verification.error'),
          description: t('form.verification.error_no_token'),
          status: 'error',
        });
        setTimeout(() => router.push(routes.page_route.auth.initial), 3000);
        return;
      }

      try {
        const response = await fetcher({
          uri: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/email-confirmation`,
          options: {
            method: 'POST',
            body: JSON.stringify({ confirmation }),
          },
        });

        if (response.error) {
          throw new Error(
            response.error.message || t('form.verification.error_description')
          );
        }

        setStatus(t('form.verification.success_description'));
        setIsSuccess(true);
        toast({
          title: t('form.verification.success'),
          description: t('form.verification.success_description'),
          status: 'success',
        });
        setTimeout(() => router.push(routes.page_route.auth.initial), 3000);
      } catch (error) {
        const errorMessage =
          error.message || t('form.verification.error_description');
        setStatus(t('form.verification.error_description'));
        setIsSuccess(false);
        toast({
          title: t('form.verification.error'),
          description: errorMessage,
          status: 'error',
        });
        setTimeout(() => router.push(routes.page_route.auth.initial), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [confirmation, router, toast, t]);

  return (
    <AuthenticationLayout>
      <VStack
        spacing={{ base: 4, md: 6 }}
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="md"
        boxShadow="md"
        textAlign="center"
        maxW="400px"
        w="full"
      >
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="bold"
          color="gray.800"
        >
          {t('heading.title')}
        </Text>

        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
          {t('heading.subtitle')}
        </Text>

        {isLoading ? (
          <VStack spacing={4}>
            <Spinner size="xl" color={colors.primary.regular} thickness="4px" />
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
              {status}
            </Text>
          </VStack>
        ) : (
          <VStack spacing={4}>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="medium"
              color={isSuccess ? 'green.600' : 'red.600'}
            >
              {status}
            </Text>
            <Button
              colorScheme="orange"
              bg={colors.primary.regular}
              color="white"
              onClick={() => router.push(routes.page_route.auth.initial)}
              isDisabled={isLoading}
              _hover={{ bg: colors.primary.dark }}
              size={{ base: 'md', md: 'lg' }}
              w={{ base: 'full', md: 'auto' }}
            >
              {t('form.submit')}
            </Button>

            <Text
              fontSize="sm"
              color="gray.500"
              cursor="pointer"
              onClick={() => router.push(routes.page_route.auth.initial)}
              _hover={{ textDecoration: 'underline' }}
            >
              {t('specifics.forgotten_password')}{' '}
              <Text
                as="span"
                color={colors.primary.regular}
                fontWeight="medium"
              >
                {t('specifics.highlight')}
              </Text>
            </Text>
          </VStack>
        )}
      </VStack>
    </AuthenticationLayout>
  );
}
