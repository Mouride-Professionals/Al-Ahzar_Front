'use client';

import {
  Box,
  Center,
  HStack,
  Skeleton,
  Spinner,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FormExport, FormSearch } from '@components/common/input/FormInput';
import {
  DEFAULT_ROWS_PER_PAGE,
  ROWS_PER_PAGE_OPTIONS,
} from '@constants/pagination';
import { colors } from '@theme';
import { downloadExcel } from '@utils/csv';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DataTableFallback = () => (
  <Box w="100%" minH="200px">
    <Skeleton h="100%" borderRadius="10px" />
  </Box>
);

const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
  loading: DataTableFallback,
});

export const DataTableLayout = ({
  columns,
  data,
  role,
  token,
  translationNamespace,
  actionButton,
  expandedComponent,
  filterFunction,
  onSearchChange = () => {},
  defaultSortFieldId = 'createdAt',
  extraSubHeaderComponents,
  selectedIndex = 0,
  paginationProps,
  searchDebounceMs = 800, // New prop for configurable debounce time
  ...rest
}) => {
  const t = useTranslations(translationNamespace);
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [debouncedFilterText, setDebouncedFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const debounceTimerRef = useRef(null);

  // Debounce effect for automatic search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilterText(filterText.trim());
    }, searchDebounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filterText, searchDebounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedFilterText !== undefined) {
      onSearchChange?.(debouncedFilterText);
    }
  }, [debouncedFilterText, onSearchChange]);

  // Handle immediate search (when user clicks search button)
  const handleSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmedValue = filterText.trim();
    setDebouncedFilterText(trimmedValue);
    onSearchChange?.(trimmedValue);
  }, [filterText, onSearchChange]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setFilterText(e.target.value);
  }, []);

  // Handle clear search
  const handleClear = useCallback(() => {
    setFilterText('');
    setDebouncedFilterText('');
    onSearchChange?.('');
  }, [onSearchChange]);

  // Use debounced value for filtering
  const filtered = useMemo(
    () =>
      filterFunction
        ? filterFunction({
            data,
            position: selectedIndex,
            needle: debouncedFilterText,
          })
        : data,
    [data, debouncedFilterText, selectedIndex, filterFunction]
  );

  const studentExportOptions = useMemo(() => {
    if (
      translationNamespace !== 'components.dataset.students' ||
      !filtered.length
    )
      return undefined;
    const studentKeys = ['firstname', 'studentIdentifer', 'parent_firstname'];
    const firstRow = filtered[0];

    if (
      !firstRow ||
      !studentKeys.every((key) =>
        Object.prototype.hasOwnProperty.call(firstRow, key)
      )
    ) {
      return undefined;
    }

    const label = (key, fallback) => t(`exportHeaders.${key}`, { fallback });

    return {
      sheetName: t('exportSheetName', { fallback: 'Students' }),
      labels: {
        student_identifier: label('student_identifier', 'Student ID'),
        firstname: label('firstname', 'First Name'),
        lastname: label('lastname', 'Last Name'),
        level: label('level', 'Class'),
        type: label('type', 'Enrollment Type'),
        socialStatus: label('socialStatus', 'Social Status'),
        guardian: label('guardian', 'Guardian'),
        guardian_phone: label('guardian_phone', 'Guardian Phone'),
        registered_at: label('registered_at', 'Registration Date'),
        enrollment_date: label('enrollment_date', 'Start Date'),
        enrollment_number: label('enrollment_number', 'Enrollment Number'),
        registrationComment: label('registrationComment', 'Comment'),
        isCurrentMonthPaid: label('isCurrentMonthPaid', 'Current Month Paid'),
      },
      booleanLabels: {
        true: label('yes', 'Yes'),
        false: label('no', 'No'),
      },
    };
  }, [filtered, t, translationNamespace]);

  const subHeaderComponentMemo = useMemo(
    () => (
      <Wrap
        alignItems="center"
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
            <FormSearch
              placeholder={t('searchPlaceholder')}
              value={filterText}
              onChange={handleInputChange}
              onSearch={handleSearch}
              onClear={handleClear}
              h={{ base: 40, sm: 50 }}
            />
            <HStack pl={{ base: 0, md: 4 }}>
              {extraSubHeaderComponents}
              <FormExport
                onExport={() => downloadExcel(filtered, studentExportOptions)}
              />
            </HStack>
          </HStack>
        </WrapItem>
        <WrapItem
          w={{ base: '100%', md: '25%' }}
          justifyContent={{ base: 'center', md: 'flex-end' }}
        >
          {actionButton && role?.name && actionButton}
        </WrapItem>
      </Wrap>
    ),
    [
      filtered,
      role,
      t,
      actionButton,
      extraSubHeaderComponents,
      studentExportOptions,
      filterText,
      handleInputChange,
      handleSearch,
      handleClear,
    ]
  );

  const handleRowExpandToggle = (row) => {
    setExpandedRow((prev) => (prev?.id === row.id ? null : row));
  };

  const paginationHandlers = useMemo(() => {
    if (!paginationProps) {
      return {
        paginationPerPage: DEFAULT_ROWS_PER_PAGE,
        paginationRowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
        paginationDefaultPage: 1,
      };
    }
    const {
      onChangePage,
      onRowsPerPageChange,
      isServerSide,
      isLoadingPage,
      rowsPerPage,
      rowsPerPageOptions,
      currentPage,
      totalRows,
    } = paginationProps;

    return {
      paginationServer: Boolean(isServerSide),
      paginationTotalRows: totalRows,
      paginationPerPage: rowsPerPage,
      paginationRowsPerPageOptions: rowsPerPageOptions,
      paginationDefaultPage: currentPage,
      onChangeRowsPerPage: (newPerPage, page) =>
        onRowsPerPageChange?.(newPerPage, page),
      onChangePage: (page, total) => onChangePage?.(page, total),
      // Let us show our own overlay instead of letting RDT hide the table
    };
  }, [paginationProps]);

  const showOverlay = Boolean(paginationProps?.isLoadingPage);

  return (
    <Box overflowX="auto" w="100%" position="relative">
      <DataTable
        style={{
          width: '100%',
          backgroundColor: colors.white,
          borderRadius: 10,
        }}
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
        {...paginationHandlers}
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

      {showOverlay && (
        <Center
          position="absolute"
          inset={0}
          bg="rgba(255,255,255,0.65)"
          zIndex={1}
        >
          <Spinner size="lg" color={colors.primary.regular} thickness="4px" />
        </Center>
      )}
    </Box>
  );
};
