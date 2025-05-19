import {
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  ScaleFade,
  Text
} from '@chakra-ui/react';
import { FormExport, FormFilter, FormSearch } from '@components/common/input/FormInput';
import { downloadCSV } from '@utils/csv';
import { dateFormatter } from '@utils/tools/mappers';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
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
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="filled" w="100%">
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" columnGap={5}>
              <GridItem>
                <Text fontWeight="bold">{t('date')}</Text>
                <Text>{dateFormatter(paymentDate)}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">{t('amount')}</Text>
                <Text>{amount} FCFA</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">{t('status')}</Text>
                <Text>{isPaid ? t('paid') : t('pending')}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">{t('student')}</Text>
                <Text>{firstname} {lastname}</Text>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

// PaymentDataSet component for listing payment transactions
export const PaymentDataSet = ({ role, data, columns, token }) => {
  const t = useTranslations('components.dataset.payments');
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const filtered = useMemo(
    () => {
      return data.filter(
        (item) =>
          (item.firstname &&
            item.firstname.toLowerCase().includes(filterText.toLowerCase())
          ) ||
          (item.lastname &&
            item.lastname.toLowerCase().includes(filterText.toLowerCase()))
          ||
          (item.monthOf &&
            item.monthOf.toLowerCase().includes(filterText.toLowerCase()))
      );
    },
    [data, filterText]
  );
  const router = useRouter();

  const subHeaderComponentMemo = useMemo(() => (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      my={3}
      w="100%"
      borderRadius={10}
    >
      <HStack>
        <Box w="60%">
          <FormSearch
            placeholder={t('searchPlaceholder')}
            keyUp={(e) => setFilterText(e.target.value)}
          />
        </Box>
        <HStack pl={4}>
          <FormFilter onExport={() => { }} />
          <FormExport onExport={() => downloadCSV(filtered)} />
        </HStack>
      </HStack>
    </HStack>
  ), [filterText, filtered, t]);

  const handleRowExpandToggle = (row) => {
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  return (
    <DataTable
      style={{ width: '100%', backgroundColor: 'white', borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: 'monthOf', desc: true }] }}
      subHeader
      expandOnRowClicked
      expandableRowsHideExpander
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id}
      onRowClicked={handleRowExpandToggle}
      expandableRowsComponent={(data) =>
        PaymentExpandedComponent({ ...data, token })
      }
      pagination
    />
  );
};