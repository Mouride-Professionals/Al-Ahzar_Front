import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { paymentCancellationHandler } from '@handlers';
import { colors } from '@theme';
import { formatMoneyWithCurrency } from '@utils/mappers/formatters';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MdCancel } from 'react-icons/md';

export const PaymentCancellationModal = ({
  isOpen,
  onClose,
  paymentId,
  paymentDetails,
  token,
  setHasSucceeded,
}) => {
  const t = useTranslations();
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      setError(t('components.modals.paymentCancellation.reasonRequired'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    await paymentCancellationHandler({
      paymentId,
      cancellationReason: cancellationReason.trim(),
      setSubmitting: setIsSubmitting,
      setFieldError: (field, message) => setError(message),
      token,
      hasSucceeded: (success) => {
        if (success) {
          setHasSucceeded(true);
          onClose();
          setCancellationReason('');
        }
      },
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCancellationReason('');
      setError('');
      onClose();
    }
  };

  return (
    <Modal size={'lg'} onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bgColor={colors.secondary.light}>
          <HStack>
            <MdCancel color={colors.secondary.regular} size={25} />
            <Text>{t('components.modals.paymentCancellation.title')}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Payment Details */}
            <Stack spacing={2}>
              <Text fontWeight="bold">
                {t('components.modals.paymentCancellation.paymentDetails')}
              </Text>
              {paymentDetails && (
                <Stack spacing={1} fontSize="sm" color="gray.600">
                  <Text>
                    <strong>{t('components.dataset.payments.student')}:</strong>{' '}
                    {paymentDetails.firstname} {paymentDetails.lastname}
                  </Text>
                  <Text>
                    <strong>{t('components.dataset.payments.amount')}:</strong>{' '}
                    {formatMoneyWithCurrency(paymentDetails.amount)}
                  </Text>
                  <Text>
                    <strong>{t('components.dataset.payments.date')}:</strong>{' '}
                    {new Date(paymentDetails.monthOf).toLocaleDateString()}
                  </Text>
                </Stack>
              )}
            </Stack>

            {/* Warning Message */}
            <Text color="orange.600" fontSize="sm">
              {t('components.modals.paymentCancellation.warning')}
            </Text>

            {/* Cancellation Reason */}
            <Stack spacing={2}>
              <Text fontWeight="medium">
                {t('components.modals.paymentCancellation.reasonLabel')} *
              </Text>
              <Textarea
                placeholder={t(
                  'components.modals.paymentCancellation.reasonPlaceholder'
                )}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                isDisabled={isSubmitting}
              />
            </Stack>

            {/* Error Message */}
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button
              variant="ghost"
              onClick={handleClose}
              isDisabled={isSubmitting}
            >
              {t('components.modals.paymentCancellation.cancel')}
            </Button>
            <Button
              colorScheme="red"
              onClick={handleCancel}
              isLoading={isSubmitting}
              loadingText={t(
                'components.modals.paymentCancellation.cancelling'
              )}
            >
              {t('components.modals.paymentCancellation.confirm')}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
