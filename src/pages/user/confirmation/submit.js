'use client';

import { Box, Button, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { routes } from '@theme';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from 'src/lib/api';

export default function ConfirmEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const confirmation = searchParams.get('confirmation');
    const [status, setStatus] = useState('Vérification en cours...');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast(
        {
            position: 'top-right',
            duration: 5000,
            isClosable: true,
        }
    );

    useEffect(() => {
        const verifyEmail = async () => {
            // Handle missing confirmation token
            if (!confirmation) {
                setStatus('Lien de vérification invalide.');
                setIsLoading(false);
                toast({
                    title: 'Erreur',
                    description: 'Aucun jeton de confirmation fourni. Veuillez réessayer.',
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
                    throw new Error(response.error.message || 'Échec de la vérification.');
                }

                setStatus('E-mail vérifié avec succès ! Redirection vers la connexion...');
                toast({
                    title: 'Succès',
                    description: 'Votre e-mail a été vérifié. Vous allez être redirigé vers la page de connexion.',
                    status: 'success',

                });
                setTimeout(() => router.push(routes.page_route.auth.initial), 3000);
            } catch (error) {
                const errorMessage = error.message || 'Une erreur est survenue lors de la vérification.';
                setStatus('Échec de la vérification. Veuillez réessayer.');
                toast({
                    title: 'Erreur',
                    description: errorMessage,
                    status: 'error',

                });
                setTimeout(() => router.push(routes.page_route.auth.initial), 3000);
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [confirmation, router, toast]);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bg="gray.50"
            p={4}
            aria-live="polite"
        >
            <VStack
                spacing={6}
                bg="white"
                p={8}
                borderRadius="md"
                boxShadow="md"
                textAlign="center"
                maxW="400px"
                w="full"
            >
                {isLoading ? (
                    <VStack spacing={4}>
                        <Spinner size="xl" color="#fd6101" thickness="4px" />
                        <Text fontSize="lg" color="gray.700">
                            {status}
                        </Text>
                    </VStack>
                ) : (
                    <VStack spacing={4}>
                        <Text fontSize="xl" fontWeight="bold" color={status.includes('succès') ? 'green.600' : 'red.600'}>
                            {status}
                        </Text>
                        <Button
                            colorScheme="orange"
                            bg="#fd6101"
                            color="white"
                            onClick={() => router.push(routes.page_route.auth.initial)}
                            isDisabled={isLoading}
                            _hover={{ bg: '#e55a00' }}
                        >
                            Aller à la connexion
                        </Button>
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}
