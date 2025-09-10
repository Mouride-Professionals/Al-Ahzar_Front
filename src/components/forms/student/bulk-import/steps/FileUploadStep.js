import {
  ArrowBackIcon,
  AttachmentIcon,
  CheckCircleIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
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
  Heading,
  HStack,
  Icon,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileCsv, FaFileExcel, FaFileUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function FileUploadStep({
  onFileUpload,
  onBack,
  uploadedFile,
  status,
}) {
  const t = useTranslations('bulkImport.steps.upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [actualFile, setActualFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = 'Fichier non accepté';

        if (rejection.errors[0]?.code === 'file-too-large') {
          errorMessage = 'Le fichier est trop volumineux (maximum 10MB)';
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          errorMessage = 'Type de fichier non supporté. Utilisez .xlsx ou .csv';
        }

        toast({
          title: 'Erreur de fichier',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setIsProcessing(true);

        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);

          if (progress >= 100) {
            clearInterval(progressInterval);
            processFile(file);
          }
        }, 200);
      }
    },
    [toast]
  );

  const processFile = async (file) => {
    try {
      // Store the actual file object
      setActualFile(file);

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Create preview data (first 5 rows)
      const headers = jsonData[0] || [];
      const previewRows = jsonData.slice(1, 6);

      setFilePreview({
        headers,
        rows: previewRows,
        totalRows: jsonData.length - 1,
        fileName: file.name,
        fileSize: file.size,
        data: jsonData, // Store full data for validation
      });

      setIsProcessing(false);

      toast({
        title: 'Fichier chargé avec succès',
        description: `${jsonData.length - 1} lignes détectées`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: 'Erreur de lecture',
        description: 'Impossible de lire le fichier. Vérifiez le format.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const removeFile = () => {
    setFilePreview(null);
    setUploadProgress(0);
  };

  const handleNext = () => {
    if (filePreview && actualFile) {
      // Pass both the processed data and the actual file object
      onFileUpload({
        preview: filePreview,
        file: actualFile,
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Upload Area */}
      {!filePreview && (
        <Card>
          <CardBody p={8}>
            <Box
              {...getRootProps()}
              border="2px dashed"
              borderColor={isDragActive ? 'orange.400' : 'gray.300'}
              borderRadius="xl"
              p={12}
              textAlign="center"
              cursor="pointer"
              bg={isDragActive ? 'orange.50' : 'gray.50'}
              transition="all 0.2s"
              _hover={{
                borderColor: 'orange.400',
                bg: 'orange.50',
              }}
            >
              <input {...getInputProps()} />

              <VStack spacing={4}>
                <Icon
                  as={isDragActive ? FaFileUpload : AttachmentIcon}
                  boxSize={12}
                  color={isDragActive ? 'orange.500' : 'gray.400'}
                />

                <VStack spacing={2}>
                  <Heading size="md" color="gray.700">
                    {isDragActive
                      ? 'Déposez votre fichier ici'
                      : 'Glissez-déposez votre fichier Excel'}
                  </Heading>
                  <Text color="gray.500">
                    ou cliquez pour sélectionner un fichier
                  </Text>
                </VStack>

                <HStack spacing={4} color="gray.400" fontSize="sm">
                  <HStack>
                    <Icon as={FaFileExcel} />
                    <Text>.xlsx</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaFileCsv} />
                    <Text>.csv</Text>
                  </HStack>
                  <Text>Maximum 10MB</Text>
                </HStack>
              </VStack>
            </Box>

            {isProcessing && (
              <Box mt={4}>
                <Text mb={2} fontSize="sm" color="gray.600">
                  Traitement du fichier...
                </Text>
                <Progress
                  value={uploadProgress}
                  colorScheme="orange"
                  size="md"
                  borderRadius="md"
                />
              </Box>
            )}
          </CardBody>
        </Card>
      )}

      {/* File Preview */}
      {filePreview && !isProcessing && (
        <VStack spacing={4} align="stretch">
          {/* File Info */}
          <Card>
            <CardBody>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Icon as={FaFileExcel} color="green.500" />
                    <Heading size="md">{filePreview.fileName}</Heading>
                    <Badge colorScheme="green">Chargé</Badge>
                  </HStack>
                  <HStack spacing={4} fontSize="sm" color="gray.600">
                    <Text>{filePreview.totalRows} lignes</Text>
                    <Text>{formatFileSize(filePreview.fileSize)}</Text>
                    <Text>{filePreview.headers.length} colonnes</Text>
                  </HStack>
                </VStack>

                <Button
                  leftIcon={<DeleteIcon />}
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={removeFile}
                >
                  Supprimer
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Data Preview */}
          <Card>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md">
                  Aperçu des données (5 premières lignes)
                </Heading>

                <Box overflowX="auto" w="100%">
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        {filePreview.headers.map((header, index) => (
                          <Th key={index} minW="120px" fontSize="xs">
                            {header}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filePreview.rows.map((row, rowIndex) => (
                        <Tr key={rowIndex}>
                          {filePreview.headers.map((_, colIndex) => (
                            <Td key={colIndex} fontSize="xs">
                              {row[colIndex] || '-'}
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      )}

      {/* File Format Info */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Formats supportés</AlertTitle>
          <AlertDescription>
            Excel (.xlsx), CSV (.csv). Assurez-vous que votre fichier utilise le
            modèle téléchargé.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Navigation Buttons */}
      <HStack justify="space-between">
        <Button leftIcon={<ArrowBackIcon />} variant="outline" onClick={onBack}>
          Retour
        </Button>

        <Button
          rightIcon={<CheckCircleIcon />}
          colorScheme="orange"
          onClick={handleNext}
          isDisabled={!filePreview || isProcessing}
          isLoading={isProcessing}
          loadingText="Traitement..."
        >
          Valider le fichier
        </Button>
      </HStack>
    </VStack>
  );
}
