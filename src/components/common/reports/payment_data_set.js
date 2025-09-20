import {
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  ScaleFade,
  Text,
} from '@chakra-ui/react';
import { DataTableLayout } from '@components/layout/data_table';
import { reportingFilter } from '@utils/mappers/kpi';
import { ACCESS_ROUTES } from '@utils/mappers/menu';
import { dateFormatter } from '@utils/tools/mappers';
import { useTranslations } from 'next-intl';
import { BoxZone } from '../cards/boxZone';

// PaymentExpandedComponent: Expanded row component for payment transactions details
const PaymentExpandedComponent = ({ data, role, onCancelPayment }) => {
  const t = useTranslations('components.dataset.payments');

  // Destructure fields from the payment transaction record
  const {
    id,
    monthOf,
    amount,
    isPaid,
    status,
    firstname,
    lastname,
    cancelledAt,
    cancellationReason,
  } = data;

  const paymentDate = new Date(monthOf);
  const isCancelled = status === 'cancelled';
  const canCancel =
    !isCancelled && isPaid && ACCESS_ROUTES.isCashier(role?.name);

  const handleCancelClick = () => {
    onCancelPayment(id);
  };

  return (
    <ScaleFade px={{ base: 3, md: 5 }} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="filled" w="100%">
          <CardBody p={{ base: 4, md: 6 }}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
              gap={{ base: 4, md: 5 }}
            >
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('date')}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>
                  {dateFormatter(paymentDate)}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('amount')}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{amount} FCFA</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('status')}
                </Text>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={isCancelled ? 'red.500' : 'inherit'}
                >
                  {isCancelled
                    ? t('cancelled')
                    : isPaid
                      ? t('paid')
                      : t('pending')}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('student')}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>
                  {firstname} {lastname}
                </Text>
              </GridItem>

              {/* Cancellation Details - Only show if payment is cancelled */}
              {isCancelled && cancelledAt && (
                <GridItem>
                  <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                    {t('cancelledAt')}
                  </Text>
                  <Text fontSize={{ base: 'sm', md: 'md' }} color="red.500">
                    {dateFormatter(new Date(cancelledAt))}
                  </Text>
                </GridItem>
              )}

              {isCancelled && cancellationReason && (
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                    {t('cancellationReason')}
                  </Text>
                  <Text fontSize={{ base: 'sm', md: 'md' }} color="red.500">
                    {cancellationReason}
                  </Text>
                </GridItem>
              )}
            </Grid>

            {/* Action Buttons */}
            {canCancel && (
              <HStack mt={4} justifyContent="flex-end">
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={handleCancelClick}
                >
                  {t('cancelPayment')}
                </Button>
              </HStack>
            )}
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

// PaymentDataSet component for listing payment transactions
export const PaymentDataSet = ({
  role,
  data = [],
  columns,
  selectedIndex = 0,
  token,
  onCancelPayment,
}) => {
  const filterFunction = ({ data, needle }) =>
    reportingFilter({
      data,
      position: selectedIndex,
      needle,
    });

  const handleCancelPayment = (paymentId) => {
    console.log('handleCancelPayment in PaymentDataSet', paymentId);

    if (onCancelPayment) {
      onCancelPayment(paymentId);
    }
  };

  return (
    <DataTableLayout
      columns={columns}
      data={data}
      role={role}
      token={token}
      translationNamespace="components.dataset.payments"
      expandedComponent={(data) =>
        PaymentExpandedComponent({
          ...data,
          role,
          onCancelPayment: handleCancelPayment,
        })
      }
      filterFunction={filterFunction}
      defaultSortFieldId="monthOf"
      selectedIndex={selectedIndex}
      paginationProps={{
        rowsPerPage: 10,
        rowsPerPageOptions: [5, 10, 20, 50],
      }}
    />
  );
};
