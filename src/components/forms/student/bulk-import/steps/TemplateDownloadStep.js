import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    HStack,
    List,
    ListIcon,
    ListItem,
    Text,
    useToast,
    VStack
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FaDownload, FaExclamationTriangle, FaFileExcel } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { downloadTemplate } from 'src/lib/services/bulkImport';
import * as XLSX from 'xlsx';

export default function TemplateDownloadStep({ onNext }) {
    const t = useTranslations('bulkImport');
    const toast = useToast();
    const { data: session } = useSession();
    const [isDownloading, setIsDownloading] = useState(false);

    // Fallback function to generate template locally if API fails
    const generateLocalTemplate = () => {
        // Create sample data for the template
        const sampleData = [
            {
                'Nom': 'Ndiaye',
                'Prénom': 'Aminata',
                'Genre': 'F',
                'Date de naissance (DD/MM/YYYY)': '15/03/2010',
                'Lieu de naissance': 'Dakar',
                'Nom du tuteur': 'Ndiaye',
                'Prénom du tuteur': 'Mamadou',
                'Téléphone du tuteur': '774567890',
                'Niveau': 'CI',
                'Lettre de classe': 'A',
                'Catégorie sociale': 'Normal'
            },
            {
                'Nom': 'Fall',
                'Prénom': 'Ousmane',
                'Genre': 'M',
                'Date de naissance (DD/MM/YYYY)': '22/07/2009',
                'Lieu de naissance': 'Thiès',
                'Nom du tuteur': 'Fall',
                'Prénom du tuteur': 'Aissatou',
                'Téléphone du tuteur': '775123456',
                'Niveau': 'CP',
                'Lettre de classe': 'B',
                'Catégorie sociale': 'Réduction inscription'
            },
            {
                'Nom': 'Diop',
                'Prénom': 'Fatou',
                'Genre': 'F',
                'Date de naissance (DD/MM/YYYY)': '08/11/2008',
                'Lieu de naissance': 'Saint-Louis',
                'Nom du tuteur': 'Diop',
                'Prénom du tuteur': 'Ibrahima',
                'Téléphone du tuteur': '776789012',
                'Niveau': 'CE1',
                'Lettre de classe': 'A',
                'Catégorie sociale': 'Tout tarifs offerts'
            }
        ];

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sampleData);

        // Add the worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Élèves');

        // Create instructions worksheet
        const instructions = [
            ['Instructions pour l\'importation en masse d\'élèves'],
            [''],
            ['1. Remplissez les colonnes suivantes pour chaque élève:'],
            ['   - Nom: Nom de famille de l\'élève'],
            ['   - Prénom: Prénom de l\'élève'],
            ['   - Genre: M (Masculin) ou F (Féminin)'],
            ['   - Date de naissance: Format DD/MM/YYYY (ex: 15/03/2010)'],
            ['   - Lieu de naissance: Ville de naissance'],
            ['   - Nom du tuteur: Nom de famille du tuteur/parent'],
            ['   - Prénom du tuteur: Prénom du tuteur/parent'],
            ['   - Téléphone du tuteur: Numéro de téléphone (ex: 774567890)'],
            ['   - Niveau: CI, CP, CE1, CE2, CM1, CM2, 6ème, 5ème, 4ème, 3ème, 2nde, 1ère, Tle'],
            ['   - Lettre de classe: A, B, C, etc.'],
            ['   - Catégorie sociale: Normal, Réduction inscription, Réduction mensualité, Tout tarifs offerts'],
            [''],
            ['2. Respectez exactement le format des colonnes'],
            ['3. Ne modifiez pas les en-têtes de colonnes'],
            ['4. Supprimez ces instructions avant l\'importation'],
            ['5. Gardez seulement l\'onglet "Élèves" avec vos données']
        ];

        const instructionsWs = XLSX.utils.aoa_to_sheet(instructions);
        XLSX.utils.book_append_sheet(workbook, instructionsWs, 'Instructions');

        // Download the file
        XLSX.writeFile(workbook, 'modele_import_eleves_al_azhar.xlsx');

        toast({
            title: t('steps.download.notifications.downloadSuccess.title'),
            description: t('steps.download.notifications.downloadSuccess.description'),
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    // Function to download template from API
    const downloadFromAPI = async () => {
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

        setIsDownloading(true);
        try {
            const blob = await downloadTemplate({ token: session.user.accessToken });
            console.log('Downloaded blob:', blob);

            if (blob && blob.size > 0) {
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Al-Azhar-Students-Template.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast({
                    title: 'Modèle téléchargé!',
                    description: 'Le modèle Excel a été téléchargé avec succès depuis le serveur.',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            } else {
                console.warn('No valid blob received, falling back to local template');
                generateLocalTemplate();
            }
        } catch (error) {
            console.warn('API template download failed, using local template:', error);
            // Fallback to local generation
            generateLocalTemplate();
        } finally {
            setIsDownloading(false);
        }
    }; const requirements = [
        'Nom complet de l\'élève',
        'Genre (M/F)',
        'Date et lieu de naissance',
        'Informations du tuteur',
        'Niveau et classe',
        'Catégorie sociale'
    ];

    const tips = [
        'Utilisez le modèle fourni pour éviter les erreurs',
        'Respectez le format de date DD/MM/YYYY',
        'Vérifiez les numéros de téléphone',
        'Les niveaux doivent correspondre à ceux de l\'école',
        'Supprimez les exemples avant l\'importation'
    ];

    return (
        <VStack spacing={6} align="stretch">
            {/* Main Download Card */}
            <Card>
                <CardHeader>
                    <HStack spacing={3}>
                        <FaFileExcel color="#2E8B57" size={24} />
                        <Heading size="md">{t('steps.download.card.title')}</Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Text color="gray.600">
                            {t('steps.download.card.description')}
                        </Text>

                        <HStack spacing={4}>
                            <Badge colorScheme="green" p={2}>
                                <HStack spacing={1}>
                                    <FaFileExcel size={12} />
                                    <Text fontSize="sm">{t('steps.download.card.stats.format')}</Text>
                                </HStack>
                            </Badge>
                            <Badge colorScheme="blue" p={2}>
                                <HStack spacing={1}>
                                    <MdCheckCircle size={12} />
                                    <Text fontSize="sm">{t('steps.download.card.stats.sample')}</Text>
                                </HStack>
                            </Badge>
                        </HStack>

                        <Button
                            leftIcon={<FaDownload />}
                            colorScheme="green"
                            size="lg"
                            onClick={downloadFromAPI}
                            isLoading={isDownloading}
                            loadingText="Téléchargement..."
                            width="fit-content"
                        >
                            {t('steps.download.card.downloadButton')}
                        </Button>

                        <Text fontSize="sm" color="gray.500">
                            💡 Si le téléchargement depuis le serveur échoue, un modèle local sera généré automatiquement.
                        </Text>
                    </VStack>
                </CardBody>
            </Card>

            {/* Requirements */}
            <Card>
                <CardHeader>
                    <Heading size="sm">{t('steps.download.requirements.title')}</Heading>
                </CardHeader>
                <CardBody>
                    <List spacing={2}>
                        {requirements.map((requirement, index) => (
                            <ListItem key={index}>
                                <ListIcon as={MdCheckCircle} color="green.500" />
                                {requirement}
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
            </Card>

            {/* Tips */}
            <Card>
                <CardHeader>
                    <Heading size="sm">{t('steps.download.tips.title')}</Heading>
                </CardHeader>
                <CardBody>
                    <List spacing={2}>
                        {tips.map((tip, index) => (
                            <ListItem key={index}>
                                <ListIcon as={MdCheckCircle} color="blue.500" />
                                {tip}
                            </ListItem>
                        ))}
                    </List>
                </CardBody>
            </Card>

            {/* Important Notice */}
            <Alert status="warning" borderRadius="md">
                <AlertIcon as={FaExclamationTriangle} />
                <Box>
                    <AlertTitle>{t('steps.download.notice.title')}</AlertTitle>
                    <AlertDescription>
                        {t('steps.download.notice.description')}
                    </AlertDescription>
                </Box>
            </Alert>

            {/* Next Button */}
            <HStack justify="flex-end">
                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={onNext}
                >
                    {t('steps.download.nextButton')}
                </Button>
            </HStack>
        </VStack>
    );
}
