'use client';

import { Box, HStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FormExport, FormFilter, FormSearch } from '@components/common/input/FormInput';
import { colors } from '@theme';
import { downloadCSV } from '@utils/csv';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

export const DataTableLayout = ({
  columns,
  data,
  role,
  token,
  translationNamespace,
  actionButton,
  expandedComponent,
  filterFunction,
  defaultSortFieldId = 'createdAt',
  extraSubHeaderComponents,
  selectedIndex = 0,
  ...rest
}) => {
  const t = useTranslations(translationNamespace);
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const filtered = useMemo(
    () => filterFunction({ data, position: selectedIndex, needle: filterText }),
    [data, filterText, selectedIndex, filterFunction]
  );

  useEffect(() => {
    if (filtered.length) {
      localStorage.setItem(`${translationNamespace}_data`, JSON.stringify(filtered));
    }
  }, [filtered, translationNamespace]);

  const subHeaderComponentMemo = useMemo(() => (
    <Wrap
      align="center"
      justify={{ base: 'center', md: 'space-between' }}
      my={3}
      w="100%"
      spacing={{ base: 2, sm: 4 }}
    >
      <WrapItem w={{ base: '100%', md: '70%' }}>
        <HStack
          w="100%"
          alignItems="center"
          justifyContent={{ base: 'center', md: 'flex-start' }}
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          spacing={{ base: 2, md: 4 }}
        >
          <Box w={{ base: '100%', sm: '60%' }}>
            <FormSearch
              placeholder={t('searchPlaceholder')}
              keyUp={(e) => setFilterText(e.target.value)}
              h={{ base: 40, sm: 50 }}
            />
          </Box>
          <HStack pl={{ base: 0, md: 4 }}>
            {extraSubHeaderComponents}
            {/* <FormFilter onExport={() => {}} /> */}
            <FormExport onExport={() => downloadCSV(filtered)} />
          </HStack>
        </HStack>
      </WrapItem>
      <WrapItem w={{ base: '100%', md: '25%' }} justifyContent={{ base: 'center', md: 'flex-end' }}>
        {actionButton && role?.name && actionButton}
      </WrapItem>
    </Wrap>
  ), [filterText, selectedIndex, filtered, role, t, actionButton, extraSubHeaderComponents]);

  const handleRowExpandToggle = (row) => {
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  return (
    <Box overflowX="auto" w="100%">
      <DataTable
        style={{ width: '100%', backgroundColor: colors.white, borderRadius: 10 }}
        columns={columns}
        data={filtered}
        defaultCanSort
        initialState={{ sortBy: [{ id: defaultSortFieldId, desc: true }] }}
        subHeader
        subHeaderAlign="center"
        subHeaderComponent={subHeaderComponentMemo}
        expandableRows
        expandableRowExpanded={(row) => row.id === expandedRow?.id}
        expandOnRowClicked
        expandableRowsHideExpander
        onRowClicked={handleRowExpandToggle}
        pagination
        highlightOnHover
        responsive
        customStyles={{
          table: {
            style: {
              backgroundColor: colors.white,
              borderRadius: '10px',
            },
          },
          headCells: {
            style: {
              fontSize: { base: '12px', sm: '14px' },
              fontWeight: 'bold',
              padding: '8px',
            },
          },
          cells: {
            style: {
              fontSize: { base: '12px', sm: '14px' },
              padding: '8px',
            },
          },
        }}
        expandableRowsComponent={expandedComponent}
        {...rest}
      />
    </Box>
  );
};