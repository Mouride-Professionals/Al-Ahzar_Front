import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Progress,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import BulkImportWizard from '@components/forms/student/bulk-import/BulkImportWizard';
import { DashboardLayout } from '@components/layout/dashboard';
import { routes } from '@theme';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function BulkImportPage() {
  const t = useTranslations('bulkImport');
  const [currentStep, setCurrentStep] = useState(1);
  const [importData, setImportData] = useState(null);
  const toast = useToast();

  const steps = [
    {
      number: 1,
      title: t('steps.download.title'),
      description: t('steps.download.description'),
    },
    {
      number: 2,
      title: t('steps.upload.title'),
      description: t('steps.upload.description'),
    },
    {
      number: 3,
      title: t('steps.validate.title'),
      description: t('steps.validate.description'),
    },
    {
      number: 4,
      title: t('steps.import.title'),
      description: t('steps.import.description'),
    },
    {
      number: 5,
      title: t('steps.results.title'),
      description: t('steps.results.description'),
    },
  ];

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleImportComplete = (results) => {
    setImportData(results);
    toast({
      title: t('notifications.importComplete.title'),
      description: t('notifications.importComplete.description', {
        count: results.successCount,
      }),
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                href={routes.page_route.dashboard.initial}
              >
                {t('breadcrumb.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                href={routes.page_route.dashboard.surveillant.students.initial}
              >
                {t('breadcrumb.students')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{t('breadcrumb.bulkImport')}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box>
            <Heading as="h1" size="xl" color="orange.500" mb={2}>
              {t('title')}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {t('subtitle')}
            </Text>
          </Box>

          {/* Progress Bar */}
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>
              {t('progress.label')} {currentStep} {t('progress.of')}{' '}
              {steps.length}
            </Text>
            <Progress
              value={progress}
              colorScheme="orange"
              size="lg"
              borderRadius="md"
              bg="gray.100"
            />
          </Box>

          {/* Current Step Info */}
          <Box
            bg="orange.50"
            p={4}
            borderRadius="md"
            border="1px"
            borderColor="orange.200"
          >
            <Text fontWeight="semibold" color="orange.700" mb={1}>
              {steps[currentStep - 1]?.title}
            </Text>
            <Text color="orange.600" fontSize="sm">
              {steps[currentStep - 1]?.description}
            </Text>
          </Box>

          {/* Wizard Component */}
          <BulkImportWizard
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onImportComplete={handleImportComplete}
            importData={importData}
          />
        </VStack>
      </Container>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ locale = 'ar' }) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
