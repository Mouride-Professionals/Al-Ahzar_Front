import {
    ArrowBackIcon
} from '@chakra-ui/icons';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
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
import { FaClock, FaPause, FaPlay, FaStop, FaUsers } from 'react-icons/fa';
import { startBulkImport } from 'src/lib/services/bulkImport';

export default function ImportProgressStep({
    file,
    validationResults,
    onImportStart,
    onImportProgress,
    onImportComplete,
    onImportError,
    onBack,
    progress,
    status
}) {
    const t = useTranslations('bulkImport.steps.import');
    const { data: session } = useSession();
    const [importStarted, setImportStarted] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [processedCount, setProcessedCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [importProgress, setImportProgress] = useState(0);
    const [importResults, setImportResults] = useState(null);
    const toast = useToast();

    const totalStudents = validationResults?.validRows || 0;

    // Auto-start import when component loads
    useEffect(() => {
        if (!importStarted && file && validationResults) {
            startImport();
        }
    }, [file, validationResults, importStarted]);

    const startImport = async () => {
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

        setImportStarted(true);
        setIsImporting(true);
        setStartTime(Date.now());
        setCurrentStep('Démarrage de l\'importation...');
        setImportProgress(10);
        onImportStart?.();

        try {
            // Call the real import API with options
            setCurrentStep('Envoi des données au serveur...');
            setImportProgress(20);

            const response = await startBulkImport({
                file: file.file,
                token: session.user.accessToken,
                options: {
                    skipErrors: false,
                    generateIdentifiers: true
                }
            });

            setImportProgress(50);
            setCurrentStep('Traitement des étudiants...');

            // Simulate processing progress for better UX
            const progressInterval = setInterval(() => {
                setImportProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 5;
                });
            }, 300);

            // Handle the API response
            const apiData = response.data || response;

            clearInterval(progressInterval);
            setImportProgress(100);
            setCurrentStep('Import terminé!');

            const results = {
                total: apiData.total || totalStudents,
                success: apiData.success || 0,
                errors: apiData.errors || 0,
                warnings: apiData.warnings || 0,
                details: apiData.details || [],
                errorDetails: apiData.errorDetails || []
            };

            setImportResults(results);
            setSuccessCount(results.success);
            setErrorCount(results.errors);
            setProcessedCount(results.total);
            setIsImporting(false);

            onImportComplete?.(results);

            toast({
                title: 'Import terminé!',
                description: `${results.success} étudiants importés avec succès${results.errors > 0 ? ` (${results.errors} erreurs)` : ''}`,
                status: results.errors === 0 ? 'success' : 'warning',
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            console.error('Import error:', error);
            setIsImporting(false);
            setCurrentStep('Erreur lors de l\'import');

            const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'importation';

            onImportError?.(error);

            toast({
                title: 'Erreur d\'importation',
                description: errorMessage,
                status: 'error',
                duration: 7000,
                isClosable: true,
            });
        }
    };

    const calculateElapsedTime = () => {
        if (!startTime) return '0:00';
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getStatusColor = () => {
        switch (status) {
            case 'importing': return 'blue';
            case 'completed': return 'green';
            case 'error': return 'red';
            default: return 'gray';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'importing': return 'Importation en cours...';
            case 'completed': return 'Importation terminée';
            case 'error': return 'Erreur d\'importation';
            default: return 'Prêt à importer';
        }
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Import Header */}
            <Card>
                <CardBody>
                    <VStack spacing={4}>
                        <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                                <Heading size="md">Importation des étudiants</Heading>
                                <Text color="gray.600" fontSize="sm">
                                    {totalStudents} étudiants prêts à être importés
                                </Text>
                            </VStack>

                            <HStack>
                                <Icon as={FaUsers} color="orange.500" />
                                <Text fontSize="lg" fontWeight="semibold" color="orange.500">
                                    {totalStudents}
                                </Text>
                            </HStack>
                        </HStack>

                        {!importStarted && (
                            <Button
                                leftIcon={<FaPlay />}
                                colorScheme="orange"
                                size="lg"
                                onClick={startImport}
                                w="full"
                            >
                                Commencer l'importation
                            </Button>
                        )}
                    </VStack>
                </CardBody>
            </Card>

            {/* Progress Display */}
            {importStarted && (
                <VStack spacing={4}>
                    {/* Main Progress */}
                    <Card w="full">
                        <CardBody>
                            <VStack spacing={6}>
                                <HStack justify="space-between" w="full">
                                    <Text fontSize="lg" fontWeight="semibold">
                                        {getStatusText()}
                                    </Text>
                                    <Text fontSize="lg" color="orange.500" fontWeight="bold">
                                        {Math.round(progress)}%
                                    </Text>
                                </HStack>

                                <Progress
                                    value={progress}
                                    colorScheme={getStatusColor()}
                                    size="lg"
                                    borderRadius="md"
                                    w="full"
                                />

                                {status === 'importing' && (
                                    <VStack spacing={2}>
                                        <HStack>
                                            <Spinner size="sm" color="orange.500" />
                                            <Text fontSize="sm" color="gray.600">
                                                {currentStep}
                                            </Text>
                                        </HStack>

                                        {estimatedTimeRemaining > 0 && (
                                            <Text fontSize="xs" color="gray.500">
                                                Temps restant estimé: {formatTime(estimatedTimeRemaining)}
                                            </Text>
                                        )}
                                    </VStack>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Statistics */}
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} w="full">
                        <GridItem>
                            <Card>
                                <CardBody textAlign="center">
                                    <Stat>
                                        <StatLabel>Traités</StatLabel>
                                        <StatNumber color="blue.500">{processedCount}</StatNumber>
                                        <StatHelpText>sur {totalStudents}</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody textAlign="center">
                                    <Stat>
                                        <StatLabel>Réussis</StatLabel>
                                        <StatNumber color="green.500">{successCount}</StatNumber>
                                        <StatHelpText>importés</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody textAlign="center">
                                    <Stat>
                                        <StatLabel>Erreurs</StatLabel>
                                        <StatNumber color="red.500">{errorCount}</StatNumber>
                                        <StatHelpText>échecs</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridItem>
                            <Card>
                                <CardBody textAlign="center">
                                    <Stat>
                                        <StatLabel>Taux de réussite</StatLabel>
                                        <StatNumber color="orange.500">
                                            {processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0}%
                                        </StatNumber>
                                        <StatHelpText>performance</StatHelpText>
                                    </Stat>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>
                </VStack>
            )}

            {/* Real-time Updates */}
            {status === 'importing' && (
                <Card>
                    <CardBody>
                        <VStack align="start" spacing={2}>
                            <HStack>
                                <Icon as={FaClock} color="gray.500" />
                                <Heading size="sm">Activité en temps réel</Heading>
                            </HStack>

                            <Box
                                bg="gray.50"
                                p={4}
                                borderRadius="md"
                                w="full"
                                fontSize="sm"
                                fontFamily="mono"
                                maxH="120px"
                                overflowY="auto"
                            >
                                <Text color="green.600">✓ Ligne {processedCount}: Étudiant importé avec succès</Text>
                                {errorCount > 0 && (
                                    <Text color="red.600">✗ Ligne {processedCount - 1}: Erreur lors de l'importation</Text>
                                )}
                                <Text color="blue.600">ℹ {currentStep}</Text>
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>
            )}

            {/* Status Alerts */}
            {status === 'completed' && (
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Importation terminée avec succès!</AlertTitle>
                        <AlertDescription>
                            {successCount} étudiants ont été importés. {errorCount > 0 && `${errorCount} erreurs détectées.`}
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {status === 'error' && (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Erreur pendant l'importation</AlertTitle>
                        <AlertDescription>
                            L'importation a été interrompue. Veuillez réessayer ou contacter le support.
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Navigation */}
            <HStack justify="space-between">
                <Button
                    leftIcon={<ArrowBackIcon />}
                    variant="outline"
                    onClick={onBack}
                    isDisabled={status === 'importing'}
                >
                    Retour
                </Button>

                {status === 'importing' && (
                    <HStack spacing={2}>
                        <Button
                            leftIcon={<FaPause />}
                            variant="outline"
                            colorScheme="yellow"
                            size="sm"
                            onClick={() => toast({
                                title: 'Pause',
                                description: 'Fonctionnalité à implémenter',
                                status: 'info',
                                duration: 2000,
                                isClosable: true,
                            })}
                        >
                            Pause
                        </Button>

                        <Button
                            leftIcon={<FaStop />}
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            onClick={() => toast({
                                title: 'Arrêt',
                                description: 'Fonctionnalité à implémenter',
                                status: 'info',
                                duration: 2000,
                                isClosable: true,
                            })}
                        >
                            Arrêter
                        </Button>
                    </HStack>
                )}
            </HStack>
        </VStack>
    );
}
