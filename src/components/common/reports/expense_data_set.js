import {
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  ScaleFade,
  Text
} from "@chakra-ui/react";
import { DataTableLayout } from '@components/layout/data_table';
import { ExpenseCreationModal } from "@components/modals/expenseCreationModal";
import { ACCESS_ROUTES } from "@utils/mappers/menu";
import { dateFormatter } from "@utils/tools/mappers";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BoxZone } from "../cards/boxZone";

// ExpenseExpandedComponent: Expanded row component for expense details
const ExpenseExpandedComponent = ({ data }) => {
  const t = useTranslations('components.dataset.expenses');
  // Destructure fields from the expense record
  const { expenseDate, amount, category, school, schoolYear } = data;
  const formattedDate = new Date(expenseDate);

  return (
    <ScaleFade px={{ base: 3, md: 5 }} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="filled" w="100%">
          <CardBody p={{ base: 4, md: 6 }}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              }}
              gap={{ base: 4, md: 5 }}
            >
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('date')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{dateFormatter(formattedDate)}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('amount')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{amount} FCFA</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('category')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{category}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('school')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{school?.name || t('na')}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>{t('schoolYear')}</Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{schoolYear?.name || t('na')}</Text>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

// ExpenseDataSet component for listing expense transactions
export const ExpenseDataSet = ({
  role,
  data = [],
  columns,
  token,
  schoolId,
  schoolYearId,
  setHasSucceeded,
  selectedIndex = 0
}) => {
  const t = useTranslations('components.dataset.expenses');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);

  const filterFunction = ({ data, needle }) =>
    data.filter(
      (item) =>
        (item.category &&
          item.category.toLowerCase().includes(needle.toLowerCase())) ||
        (item.expenseDate &&
          item.expenseDate.toLowerCase().includes(needle.toLowerCase())) ||
        (item.school?.name &&
          item.school.name.toLowerCase().includes(needle.toLowerCase())) ||
        (item.schoolYear?.name &&
          item.schoolYear.name.toLowerCase().includes(needle.toLowerCase()))
    );

  const actionButton = ACCESS_ROUTES.isCashier(role.name) && (
    <Button colorScheme="orange" onClick={openExpenseModal}>
      {t('addExpense')}
    </Button>
  );

  return (
    <>
      <DataTableLayout
        columns={columns}
        data={data}
        role={role}
        token={token}
        translationNamespace="components.dataset.expenses"
        actionButton={actionButton}
        expandedComponent={(data) =>
          ExpenseExpandedComponent({ ...data, token })
        }
        filterFunction={filterFunction}
        defaultSortFieldId="expenseDate"
        selectedIndex={selectedIndex}
        paginationProps={{
          rowsPerPage: 10,
          rowsPerPageOptions: [5, 10, 20, 50],
        }}
      />

      <ExpenseCreationModal
        isOpen={isExpenseModalOpen}
        onClose={closeExpenseModal}
        token={token}
        schoolId={schoolId}
        schoolYearId={schoolYearId}
        setHasSucceeded={setHasSucceeded}
      />
    </>
  );
};