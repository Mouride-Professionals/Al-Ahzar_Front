import {
  Card,
  CardBody,
  Grid,
  GridItem,
  ScaleFade,
  Text
} from '@chakra-ui/react';
import { DataTableLayout } from '@components/layout/data_table';
import { reportingFilter } from '@utils/mappers/kpi';
import { dateFormatter } from '@utils/tools/mappers';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { BoxZone } from '../cards/boxZone';

// PaymentExpandedComponent: Expanded row component for payment transactions details
const PaymentExpandedComponent = ({ data, token }) => {
  const t = useTranslations('components.dataset.payments');
  // Destructure fields from the payment transaction record
  // Adjust these fields to match your actual payment data structure
  const {
    id,
    monthOf, amount, isPaid,
    firstname, lastname,
  } = data;
  const paymentDate = new Date(monthOf);

  return (
    <ScaleFade px={{ base: 3, md: 5 }} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="filled" w="100%">
          <CardBody p={{ base: 4, md: 6 }}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)'
              }}
              gap={{ base: 4, md: 5 }}
            >
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('date')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{dateFormatter(paymentDate)}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('amount')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{amount} FCFA</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('status')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{isPaid ? t('paid') : t('pending')}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('student')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{firstname} {lastname}</Text>
              </GridItem>
            </Grid>
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
  token
}) => {
  const t = useTranslations('components.dataset.payments');
  const router = useRouter();

  const filterFunction = ({ data, needle }) =>
    reportingFilter({
      data,
      position: selectedIndex,
      needle,
    });

  return (
    <DataTableLayout
      columns={columns}
      data={data}
      role={role}
      token={token}
      translationNamespace="components.dataset.payments"
      expandedComponent={(data) =>
        PaymentExpandedComponent({ ...data, token })
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