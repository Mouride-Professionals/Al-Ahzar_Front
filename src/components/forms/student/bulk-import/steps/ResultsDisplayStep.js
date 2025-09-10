import {
    DownloadIcon,
    RepeatIcon,
    ViewIcon
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
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    List,
    ListItem,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    VStack
} from '@chakra-ui/react';
import { routes } from '@theme';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import {
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaFileExport,
    FaUsers
} from 'react-icons/fa';

export default function ResultsDisplayStep({ importData, onStartOver }) {
    const t = useTranslations('bulkImport.steps.results');
    const [showAllStudents, setShowAllStudents] = useState(false);
    const [showAllErrors, setShowAllErrors] = useState(false);
    const toast = useToast();

    if (!importData) {
        return null;
    }

    const {
        totalProcessed,
        successCount,
        errorCount,
        duration,
        importedStudents,
        errors
    } = importData;

    const successRate = totalProcessed > 0 ? Math.round((successCount / totalProcessed) * 100) : 0;

    const downloadErrorReport = () => {
        // Create CSV content for error report
        const csvContent = [
            ['Ligne', 'Erreur', 'Détails'],
            ...errors.map(error => [error.row, error.error, error.details])
        ];

        const csvString = csvContent.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `rapport_erreurs_import_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        toast({
            title: 'Rapport téléchargé',
            description: 'Le rapport d\'erreurs a été téléchargé avec succès',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const downloadSuccessReport = () => {
        // Create CSV content for success report
        const csvContent = [
            ['ID Étudiant', 'Prénom', 'Nom', 'Classe', 'Numéro d\'inscription'],
            ...importedStudents.map(student => [
                student.id,
                student.firstName,
                student.lastName,
                student.class,
                student.enrollmentNumber
            ])
        ];

        const csvString = csvContent.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `etudiants_importes_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        toast({
            title: 'Rapport téléchargé',
            description: 'La liste des étudiants importés a été téléchargée',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const formatDuration = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Success Header */}
            <Card
                borderWidth={2}
                borderColor={successCount > 0 ? "green.200" : "red.200"}
                bg={successCount > 0 ? "green.50" : "red.50"}
            >
                <CardBody p={8}>
                    <VStack spacing={4} align="center">
                        <Icon
                            as={successCount > 0 ? FaCheckCircle : FaExclamationTriangle}
                            boxSize={16}
                            color={successCount > 0 ? "green.500" : "red.500"}
                        />

                        <VStack spacing={2} textAlign="center">
                            <Heading size="lg" color={successCount > 0 ? "green.600" : "red.600"}>
                                {successCount > 0 ? 'Importation réussie!' : 'Importation terminée avec des erreurs'}
                            </Heading>
                            <Text color="gray.600" fontSize="lg">
                                {successCount > 0
                                    ? `${successCount} étudiants ont été importés avec succès`
                                    : `${errorCount} erreurs ont été détectées lors de l'importation`
                                }
                            </Text>
                        </VStack>

                        <HStack spacing={8} color="gray.500">
                            <HStack>
                                <Icon as={FaClock} />
                                <Text fontSize="sm">Durée: {formatDuration(duration)}</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FaUsers} />
                                <Text fontSize="sm">Taux de réussite: {successRate}%</Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>

            {/* Summary Statistics */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                <GridItem>
                    <Card>
                        <CardBody textAlign="center">
                            <Stat>
                                <StatLabel>Total traité</StatLabel>
                                <StatNumber color="blue.500">{totalProcessed}</StatNumber>
                                <StatHelpText>étudiants</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card>
                        <CardBody textAlign="center">
                            <Stat>
                                <StatLabel>Importés</StatLabel>
                                <StatNumber color="green.500">{successCount}</StatNumber>
                                <StatHelpText>avec succès</StatHelpText>
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
                                <StatLabel>Performance</StatLabel>
                                <StatNumber color="orange.500">{successRate}%</StatNumber>
                                <StatHelpText>réussite</StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>

            {/* Detailed Results */}
            <Accordion allowToggle>
                {/* Successful Imports */}
                {successCount > 0 && (
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <HStack>
                                        <Icon as={FaCheckCircle} color="green.500" />
                                        <Text fontWeight="semibold">
                                            Étudiants importés avec succès ({successCount})
                                        </Text>
                                    </HStack>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.600">
                                        Affichage des {Math.min(5, importedStudents.length)} premiers étudiants
                                    </Text>
                                    <Button
                                        size="sm"
                                        leftIcon={<DownloadIcon />}
                                        variant="outline"
                                        colorScheme="green"
                                        onClick={downloadSuccessReport}
                                    >
                                        Télécharger la liste
                                    </Button>
                                </HStack>

                                <Box overflowX="auto">
                                    <Table size="sm" variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th>Prénom</Th>
                                                <Th>Nom</Th>
                                                <Th>Classe</Th>
                                                <Th>N° Inscription</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {importedStudents.slice(0, showAllStudents ? undefined : 5).map((student, index) => (
                                                <Tr key={index}>
                                                    <Td fontFamily="mono" fontSize="xs">{student.id}</Td>
                                                    <Td>{student.firstName}</Td>
                                                    <Td>{student.lastName}</Td>
                                                    <Td>
                                                        <Badge colorScheme="blue">{student.class}</Badge>
                                                    </Td>
                                                    <Td fontFamily="mono" fontSize="xs">{student.enrollmentNumber}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>

                                {importedStudents.length > 5 && !showAllStudents && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowAllStudents(true)}
                                    >
                                        Voir tous les étudiants ({importedStudents.length})
                                    </Button>
                                )}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                )}

                {/* Import Errors */}
                {errorCount > 0 && (
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <HStack>
                                        <Icon as={FaExclamationTriangle} color="red.500" />
                                        <Text fontWeight="semibold">
                                            Erreurs d'importation ({errorCount})
                                        </Text>
                                    </HStack>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.600">
                                        Détails des erreurs rencontrées
                                    </Text>
                                    <Button
                                        size="sm"
                                        leftIcon={<DownloadIcon />}
                                        variant="outline"
                                        colorScheme="red"
                                        onClick={downloadErrorReport}
                                    >
                                        Télécharger le rapport
                                    </Button>
                                </HStack>

                                <List spacing={2}>
                                    {errors.slice(0, showAllErrors ? undefined : 5).map((error, index) => (
                                        <ListItem key={index} p={3} bg="red.50" borderRadius="md">
                                            <VStack align="start" spacing={1}>
                                                <HStack>
                                                    <Badge colorScheme="red">Ligne {error.row}</Badge>
                                                    <Text fontWeight="semibold" fontSize="sm">{error.error}</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="gray.600">
                                                    {error.details}
                                                </Text>
                                            </VStack>
                                        </ListItem>
                                    ))}
                                </List>

                                {errors.length > 5 && !showAllErrors && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowAllErrors(true)}
                                    >
                                        Voir toutes les erreurs ({errors.length})
                                    </Button>
                                )}
                            </VStack>
                        </AccordionPanel>
                    </AccordionItem>
                )}
            </Accordion>

            {/* Action Buttons */}
            <VStack spacing={4}>
                <Divider />

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} w="full">
                    <GridItem>
                        <Button
                            leftIcon={<ViewIcon />}
                            colorScheme="blue"
                            variant="outline"
                            w="full"
                            as={Link}
                            href={routes.page_route.dashboard.surveillant.initial}
                        >
                            Voir les étudiants
                        </Button>
                    </GridItem>

                    <GridItem>
                        <Button
                            leftIcon={<FaFileExport />}
                            colorScheme="green"
                            variant="outline"
                            w="full"
                            onClick={downloadSuccessReport}
                            isDisabled={successCount === 0}
                        >
                            Exporter les résultats
                        </Button>
                    </GridItem>

                    <GridItem>
                        <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="red"
                            variant="outline"
                            w="full"
                            onClick={downloadErrorReport}
                            isDisabled={errorCount === 0}
                        >
                            Rapport d'erreurs
                        </Button>
                    </GridItem>

                    <GridItem>
                        <Button
                            leftIcon={<RepeatIcon />}
                            colorScheme="orange"
                            w="full"
                            onClick={onStartOver}
                        >
                            Nouvelle importation
                        </Button>
                    </GridItem>
                </Grid>
            </VStack>

            {/* Final Status Message */}
            {successCount > 0 && (
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Prochaines étapes</AlertTitle>
                        <AlertDescription>
                            Les étudiants importés sont maintenant disponibles dans le système.
                            Vous pouvez les consulter dans la section "Gestion des étudiants".
                        </AlertDescription>
                    </Box>
                </Alert>
            )}
        </VStack>
    );
}
