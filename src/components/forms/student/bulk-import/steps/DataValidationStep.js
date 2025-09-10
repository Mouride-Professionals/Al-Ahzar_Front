import {
    ArrowBackIcon,
    ArrowForwardIcon,
    InfoIcon,
    WarningIcon
} from '@chakra-ui/icons';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    List,
    ListItem,
    Progress,
    Spinner,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useToast,
    VStack
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { validateBulkImport } from 'src/lib/services/bulkImport';

export default function DataValidationStep({
    file,
    onValidationComplete,
    onBack,
    onNext,
    validationResults
}) {
    const t = useTranslations('bulkImport.steps.validate');
    const [isValidating, setIsValidating] = useState(false);
    const [validationProgress, setValidationProgress] = useState(0);
    const [currentValidation, setCurrentValidation] = useState('');
    const toast = useToast();
    const { data: session } = useSession();

    useEffect(() => {
        if (file && file.file && !validationResults) {
            startValidation();
        }
    }, [file, validationResults]);

    const startValidation = async () => {
        if (!session?.user?.accessToken) {
            toast({
                title: 'Erreur',
                description: 'Session expirée. Veuillez vous reconnecter.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsValidating(true);
        setValidationProgress(0);
        setCurrentValidation('Envoi du fichier au serveur...');

        try {
            // Call the real API validation endpoint
            setValidationProgress(20);
            setCurrentValidation('Analyse du fichier...');

            const response = await validateBulkImport({
                file: file.file,
                token: session.user.accessToken
            });

            setValidationProgress(80);
            setCurrentValidation('Traitement des résultats...');

            // Handle the response based on the backend structure from the guide
            const apiData = response.data || response;

            // Transform the API response to match our expected format
            const validationResults = {
                totalRows: apiData.total || 0,
                validRows: apiData.success || 0,
                errors: apiData.errorDetails || [],
                warnings: apiData.details || [],
                duplicates: apiData.duplicates || [],
                missingClasses: apiData.missingClasses || [],
                summary: {
                    canProceed: (apiData.errors || 0) === 0,
                    readyToImport: apiData.success || 0,
                    needsAttention: (apiData.errors || 0) + (apiData.warnings || 0)
                },
                // Additional backend data
                errorCount: apiData.errors || 0,
                warningCount: apiData.warnings || 0,
                rawResponse: apiData // Keep original response for debugging
            };

            setValidationProgress(100);
            setCurrentValidation('Validation terminée');
            setIsValidating(false);

            onValidationComplete(validationResults);

            // Show appropriate toast based on results
            if (validationResults.errorCount === 0) {
                toast({
                    title: 'Validation réussie!',
                    description: `${validationResults.validRows} étudiants prêts à être importés`,
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Erreurs détectées',
                    description: `${validationResults.errorCount} erreurs trouvées. Veuillez corriger le fichier.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Validation error:', error);
            setIsValidating(false);
            setValidationProgress(0);
            setCurrentValidation('');

            // Handle different types of API errors
            let errorMessage = 'Erreur lors de la validation du fichier';
            let errorDetails = [];

            if (error.status) {
                // Direct fetch error with our custom format
                errorMessage = error.message || errorMessage;

                // If the server returns validation errors in a specific format
                if (error.data && error.data.errorDetails) {
                    errorDetails = error.data.errorDetails;
                }
            } else if (error.response) {
                // Axios-style error (fallback)
                const serverError = error.response.data;
                errorMessage = serverError.message || serverError.error?.message || errorMessage;

                if (serverError.data && serverError.data.errorDetails) {
                    errorDetails = serverError.data.errorDetails;
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
            } else {
                // Other error
                errorMessage = error.message || errorMessage;
            }

            // Create error results matching the expected format
            const errorResults = {
                totalRows: 0,
                validRows: 0,
                errors: errorDetails.length > 0 ? errorDetails : [{
                    row: 0,
                    student: 'Fichier',
                    errors: [errorMessage]
                }],
                warnings: [],
                duplicates: [],
                missingClasses: [],
                summary: {
                    canProceed: false,
                    readyToImport: 0,
                    needsAttention: 1
                },
                errorCount: 1,
                warningCount: 0,
                isSystemError: true
            };

            onValidationComplete(errorResults);

            toast({
                title: 'Erreur de validation',
                description: errorMessage,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        }
    };

    // Function to force re-validation
    const forceReValidation = () => {
        onValidationComplete(null); // Clear previous results
        setTimeout(() => startValidation(), 100); // Start new validation
    };



    const getValidationStatusColor = () => {
        if (!validationResults) return 'gray';
        if (validationResults.isSystemError) return 'red';
        if (validationResults.errorCount === 0) return 'green';
        if (validationResults.warningCount > 0) return 'yellow';
        return 'red';
    };

    const getValidationStatusText = () => {
        if (!validationResults) return 'En attente';
        if (validationResults.isSystemError) return 'Erreur système';
        if (validationResults.errorCount === 0 && validationResults.warningCount === 0) return 'Validation réussie';
        if (validationResults.errorCount === 0) return 'Validation avec avertissements';
        return 'Erreurs détectées';
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Validation Status Header */}
            <Card>
                <CardBody>
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <Heading size="md">Validation des données</Heading>
                            <Text color="gray.600" fontSize="sm">
                                Vérification de la conformité de vos données
                            </Text>
                        </VStack>

                        <HStack spacing={3}>
                            {validationResults && !isValidating && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    colorScheme="blue"
                                    onClick={forceReValidation}
                                >
                                    Re-valider
                                </Button>
                            )}
                            <Badge
                                colorScheme={getValidationStatusColor()}
                                fontSize="md"
                                p={2}
                                borderRadius="md"
                            >
                                {getValidationStatusText()}
                            </Badge>
                        </HStack>
                    </HStack>
                </CardBody>
            </Card>

            {/* Validation Progress */}
            {isValidating && (
                <Card>
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack w="full" justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    {currentValidation}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {Math.round(validationProgress)}%
                                </Text>
                            </HStack>

                            <Progress
                                value={validationProgress}
                                colorScheme="orange"
                                size="lg"
                                borderRadius="md"
                                w="full"
                            />

                            <HStack>
                                <Spinner size="sm" color="orange.500" />
                                <Text fontSize="sm" color="gray.600">
                                    Validation en cours...
                                </Text>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            )}

            {/* Validation Results */}
            {validationResults && !isValidating && (
                <VStack spacing={4} align="stretch">
                    {/* Summary Stats */}
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                        <GridItem>
                            <Stat>
                                <StatLabel>Total des lignes</StatLabel>
                                <StatNumber color="blue.500">{validationResults.totalRows}</StatNumber>
                                <StatHelpText>Dans le fichier</StatHelpText>
                            </Stat>
                        </GridItem>

                        <GridItem>
                            <Stat>
                                <StatLabel>Prêtes à importer</StatLabel>
                                <StatNumber color="green.500">{validationResults.validRows}</StatNumber>
                                <StatHelpText>Sans erreur</StatHelpText>
                            </Stat>
                        </GridItem>

                        <GridItem>
                            <Stat>
                                <StatLabel>Nécessitent attention</StatLabel>
                                <StatNumber color="red.500">{validationResults.errorCount || 0}</StatNumber>
                                <StatHelpText>Erreurs critiques</StatHelpText>
                            </Stat>
                        </GridItem>

                        <GridItem>
                            <Stat>
                                <StatLabel>Avertissements</StatLabel>
                                <StatNumber color="yellow.500">{validationResults.warningCount || 0}</StatNumber>
                                <StatHelpText>À vérifier</StatHelpText>
                            </Stat>
                        </GridItem>
                    </Grid>

                    {/* Validation Status Alert */}
                    {validationResults.isSystemError ? (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>Erreur système</AlertTitle>
                                <AlertDescription>
                                    Une erreur s&apos;est produite lors de la validation. Veuillez réessayer ou contacter le support.
                                </AlertDescription>
                            </Box>
                        </Alert>
                    ) : validationResults.errorCount === 0 ? (
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>Validation réussie!</AlertTitle>
                                <AlertDescription>
                                    {validationResults.warningCount > 0
                                        ? `${validationResults.validRows} étudiants prêts à être importés avec ${validationResults.warningCount} avertissement(s).`
                                        : `Toutes les données sont conformes. ${validationResults.validRows} étudiants prêts à être importés.`
                                    }
                                </AlertDescription>
                            </Box>
                        </Alert>
                    ) : (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>Erreurs détectées</AlertTitle>
                                <AlertDescription>
                                    {validationResults.errorCount} erreur(s) doivent être corrigées avant l&apos;importation.
                                </AlertDescription>
                            </Box>
                        </Alert>
                    )}

                    {/* Detailed Issues */}
                    <Accordion allowToggle>
                        {/* Errors */}
                        {validationResults.errors.length > 0 && (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <HStack>
                                                <Icon as={FaExclamationTriangle} color="red.500" />
                                                <Text fontWeight="semibold">
                                                    Erreurs ({validationResults.errors.length})
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        {validationResults.errors.map((error, index) => (
                                            <ListItem key={index} p={3} bg="red.50" borderRadius="md">
                                                <VStack align="start" spacing={1}>
                                                    <HStack>
                                                        <Badge colorScheme="red">Ligne {error.row}</Badge>
                                                        <Text fontWeight="semibold" fontSize="sm">
                                                            {error.student || 'Erreur générale'}
                                                        </Text>
                                                    </HStack>
                                                    {error.errors && Array.isArray(error.errors) ? (
                                                        error.errors.map((err, errIndex) => (
                                                            <Text key={errIndex} fontSize="sm" color="red.600">
                                                                • {err}
                                                            </Text>
                                                        ))
                                                    ) : (
                                                        <Text fontSize="sm" color="red.600">
                                                            {error.error || error.message || 'Erreur inconnue'}
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>
                        )}

                        {/* Warnings */}
                        {validationResults.warnings.length > 0 && (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <HStack>
                                                <Icon as={WarningIcon} color="yellow.500" />
                                                <Text fontWeight="semibold">
                                                    Avertissements ({validationResults.warnings.length})
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        {validationResults.warnings.map((warning, index) => (
                                            <ListItem key={index} p={3} bg="yellow.50" borderRadius="md">
                                                <VStack align="start" spacing={1}>
                                                    <HStack>
                                                        <Badge colorScheme="yellow">Ligne {warning.row}</Badge>
                                                        <Text fontWeight="semibold" fontSize="sm">{warning.field}</Text>
                                                    </HStack>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Valeur: &ldquo;{warning.value}&rdquo;
                                                    </Text>
                                                    <Text fontSize="sm" color="yellow.600">
                                                        {warning.error}
                                                    </Text>
                                                </VStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>
                        )}

                        {/* Duplicates */}
                        {validationResults.duplicates.length > 0 && (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <HStack>
                                                <Icon as={InfoIcon} color="blue.500" />
                                                <Text fontWeight="semibold">
                                                    Doublons potentiels ({validationResults.duplicates.length})
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <List spacing={2}>
                                        {validationResults.duplicates.map((duplicate, index) => (
                                            <ListItem key={index} p={3} bg="blue.50" borderRadius="md">
                                                <VStack align="start" spacing={1}>
                                                    <HStack>
                                                        <Badge colorScheme="blue">
                                                            Lignes {duplicate.rows.join(', ')}
                                                        </Badge>
                                                        <Text fontWeight="semibold" fontSize="sm">{duplicate.field}</Text>
                                                    </HStack>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Valeur: &ldquo;{duplicate.value}&rdquo;
                                                    </Text>
                                                    <Text fontSize="sm" color="blue.600">
                                                        {duplicate.error}
                                                    </Text>
                                                </VStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionPanel>
                            </AccordionItem>
                        )}
                    </Accordion>
                </VStack>
            )}

            {/* Navigation Buttons */}
            <HStack justify="space-between">
                <Button
                    leftIcon={<ArrowBackIcon />}
                    variant="outline"
                    onClick={onBack}
                    isDisabled={isValidating}
                >
                    Retour
                </Button>

                <HStack spacing={2}>
                    {validationResults && validationResults.errors.length > 0 && (
                        <Button
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                                toast({
                                    title: 'Téléchargement du rapport d\'erreurs',
                                    description: 'Fonctionnalité à implémenter',
                                    status: 'info',
                                    duration: 3000,
                                    isClosable: true,
                                });
                            }}
                        >
                            Télécharger le rapport
                        </Button>
                    )}

                    <Button
                        rightIcon={<ArrowForwardIcon />}
                        colorScheme="orange"
                        onClick={onNext}
                        isDisabled={
                            isValidating ||
                            !validationResults ||
                            validationResults.errors.length > 0
                        }
                    >
                        Procéder à l&apos;importation
                    </Button>
                </HStack>
            </HStack>
        </VStack>
    );
}
