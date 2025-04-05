import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  ScaleFade,
  Text,
} from "@chakra-ui/react";
import { FormExport, FormFilter, FormSearch } from "@components/common/input/FormInput";
import { ExpenseCreationModal } from "@components/modals/expenseCreationModal";
import { downloadCSV } from "@utils/csv";
import { dateFormatter } from "@utils/tools/mappers";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { BoxZone } from "../cards/boxZone";
import { ACCESS_ROUTES } from "@utils/mappers/menu";

// ExpenseExpandedComponent: Expanded row component for expense details
const ExpenseExpandedComponent = ({ data, token }) => {
  // Destructure fields from the expense record
  const { id, expenseDate, amount, category, school, schoolYear } = data;
  const formattedDate = new Date(expenseDate);

  return (
    <ScaleFade px={5} initialScale={0.9} in={true}>
      <BoxZone>
        <Card variant="filled" w="100%">
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" columnGap={5}>
              <GridItem>
                <Text fontWeight="bold">Date:</Text>
                <Text>{dateFormatter(formattedDate)}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Montant:</Text>
                <Text>{amount} FCFA</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Catégorie:</Text>
                <Text>{category}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">École:</Text>
                <Text>{school?.name || "N/A"}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Année Scolaire:</Text>
                <Text>{schoolYear?.name || "N/A"}</Text>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </BoxZone>
    </ScaleFade>
  );
};

// ExpenseDataSet component for listing expense transactions
export const ExpenseDataSet = ({ role, data, columns, token, schoolId, schoolYearId, setHasSucceeded }) => {
  const [filterText, setFilterText] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);


  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);

  const filtered = useMemo(() => {
    return data.filter(
      (item) =>
        (item.category &&
          item.category.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.expenseDate &&
          item.expenseDate.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.school?.name &&
          item.school.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.schoolYear?.name &&
          item.schoolYear.name.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [data, filterText]);

  const subHeaderComponentMemo = useMemo(
    () => (
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
              placeholder="Search expenses"
              keyUp={(e) => setFilterText(e.target.value)}
            />
          </Box>
          <HStack pl={4}>
            <FormFilter onExport={() => { }} />
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>
        {/* New Expense Button on top right */}
       { ACCESS_ROUTES.isCashier(role.name) && <Button colorScheme="orange" onClick={openExpenseModal}>
          Ajouter une dépense
        </Button>}
        <ExpenseCreationModal
          isOpen={isExpenseModalOpen}
          onClose={closeExpenseModal}
          token={token}
          schoolId={schoolId} // Adjust accordingly
          schoolYearId={schoolYearId}
          setHasSucceeded={setHasSucceeded}
        />
      </HStack>
    ),
    [filterText, filtered, isExpenseModalOpen]
  );

  const handleRowExpandToggle = (row) => {
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  return (
    <DataTable
      style={{ width: "100%", backgroundColor: "white", borderRadius: 10 }}
      columns={columns}
      data={filtered}
      defaultCanSort
      initialState={{ sortBy: [{ id: "expenseDate", desc: true }] }}
      subHeader
      expandOnRowClicked
      expandableRowsHideExpander
      subHeaderComponent={subHeaderComponentMemo}
      expandableRows
      expandableRowExpanded={(row) => row.id === expandedRow?.id}
      onRowClicked={handleRowExpandToggle}
      expandableRowsComponent={(data) =>
        ExpenseExpandedComponent({ ...data, token })
      }
      pagination
    />
  );
};