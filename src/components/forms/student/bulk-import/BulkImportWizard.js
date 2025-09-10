import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import DataValidationStep from './steps/DataValidationStep';
import FileUploadStep from './steps/FileUploadStep';
import ImportProgressStep from './steps/ImportProgressStep';
import ResultsDisplayStep from './steps/ResultsDisplayStep';
import TemplateDownloadStep from './steps/TemplateDownloadStep';

export default function BulkImportWizard({
    currentStep,
    onStepChange,
    onImportComplete,
    importData
}) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [validationResults, setValidationResults] = useState(null);
    const [importProgress, setImportProgress] = useState(0);
    const [importStatus, setImportStatus] = useState('idle'); // idle, uploading, validating, importing, completed, error

    const handleFileUpload = (fileData) => {
        // fileData now contains { preview, file }
        setUploadedFile(fileData);
        setValidationResults(null); // Clear previous validation results
        onStepChange(3); // Move to validation step
    };

    const handleValidationComplete = (results) => {
        setValidationResults(results);
        // Don't auto-advance if there are errors, let user review them first
        if (results && results.errors.length === 0) {
            onStepChange(4); // Move to import step if no errors
        }
    };

    const handleImportStart = () => {
        setImportStatus('importing');
        setImportProgress(0);
    };

    const handleImportProgress = (progress) => {
        setImportProgress(progress);
    };

    const handleImportComplete = (results) => {
        setImportStatus('completed');
        setImportProgress(100);
        onImportComplete(results);
        onStepChange(5); // Move to results step
    };

    const handleImportError = (error) => {
        setImportStatus('error');
        console.error('Import error:', error);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <TemplateDownloadStep
                        onNext={() => onStepChange(2)}
                    />
                );
            case 2:
                return (
                    <FileUploadStep
                        onFileUpload={handleFileUpload}
                        onBack={() => onStepChange(1)}
                        uploadedFile={uploadedFile}
                        status={importStatus}
                    />
                );
            case 3:
                return (
                    <DataValidationStep
                        file={uploadedFile}
                        onValidationComplete={handleValidationComplete}
                        onBack={() => onStepChange(2)}
                        onNext={() => onStepChange(4)}
                        validationResults={validationResults}
                    />
                );
            case 4:
                return (
                    <ImportProgressStep
                        file={uploadedFile}
                        validationResults={validationResults}
                        onImportStart={handleImportStart}
                        onImportProgress={handleImportProgress}
                        onImportComplete={handleImportComplete}
                        onImportError={handleImportError}
                        onBack={() => onStepChange(3)}
                        progress={importProgress}
                        status={importStatus}
                    />
                );
            case 5:
                return (
                    <ResultsDisplayStep
                        importData={importData}
                        onStartOver={() => {
                            setUploadedFile(null);
                            setValidationResults(null);
                            setImportProgress(0);
                            setImportStatus('idle');
                            onStepChange(1);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            {renderCurrentStep()}
        </Box>
    );
}
