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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BoxZone } from '../cards/boxZone';
import { mapPaymentsDataTable } from '@utils/mappers/payment';
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '@constants/pagination';
import { fetcher } from 'src/lib/api';

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
  initialPagination = null,
  baseRoute = '',
}) => {
  const fallbackPageSize = initialPagination?.pageSize || DEFAULT_ROWS_PER_PAGE;

  const [payments, setPayments] = useState(data ?? []);
  const [paginationState, setPaginationState] = useState(
    initialPagination || {
      page: 1,
      pageSize: fallbackPageSize,
      pageCount: 1,
      total: data?.length || 0,
    }
  );
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  useEffect(() => {
    setPayments(data ?? []);
    setPaginationState(
      initialPagination || {
        page: 1,
        pageSize: fallbackPageSize,
        pageCount: 1,
        total: data?.length || 0,
      }
    );
  }, [data, initialPagination, fallbackPageSize]);

  const filterFunction = ({ data: rows, needle }) =>
    reportingFilter({
      data: rows,
      position: selectedIndex,
      needle,
    });

  const handleCancelPayment = (paymentId) => {
    if (onCancelPayment) {
      onCancelPayment(paymentId);
    }
  };

  const currentPageSize = paginationState?.pageSize || fallbackPageSize;

  const goToPage = useCallback(
    async (targetPage, pageSizeOverride) => {
      if (!token || !baseRoute) return;
      const pageSize = pageSizeOverride || currentPageSize;
      setIsLoadingPage(true);
      try {
        const response = await fetcher({
          uri: `${baseRoute}&pagination[page]=${targetPage}&pagination[pageSize]=${pageSize}`,
          user_token: token,
        });
        const mapped = mapPaymentsDataTable({ payments: response });
        setPayments(mapped);
        setPaginationState(
          response.meta?.pagination || {
            page: targetPage,
            pageSize,
            pageCount: paginationState?.pageCount || 1,
            total: paginationState?.total || mapped.length,
          }
        );
      } catch (error) {
        console.error('Error loading payments page:', error);
      } finally {
        setIsLoadingPage(false);
      }
    },
    [token, baseRoute, currentPageSize, paginationState?.pageCount, paginationState?.total]
  );

  const paginationConfig = useMemo(
    () => ({
      rowsPerPage: currentPageSize,
      rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
      currentPage: paginationState?.page || 1,
      totalRows: paginationState?.total || payments.length,
      onChangePage: (page) => goToPage(page),
      onRowsPerPageChange: (newSize, page) => goToPage(page || 1, newSize),
      isServerSide: Boolean(baseRoute),
      isLoadingPage,
    }),
    [currentPageSize, paginationState?.page, paginationState?.total, payments.length, goToPage, baseRoute, isLoadingPage]
  );

  return (
    <DataTableLayout
      columns={columns}
      data={payments}
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
      paginationProps={paginationConfig}
    />
  );
};
