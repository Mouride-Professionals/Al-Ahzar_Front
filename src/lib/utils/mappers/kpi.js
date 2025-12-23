'use client';

import { Badge } from '@chakra-ui/react';
import { colors } from '@theme';
import { formatMoneyWithCurrency } from '@utils/mappers/formatters';
import { dateFormatter, mapPaymentType } from '@utils/tools/mappers';
import { useLocale, useTranslations } from 'next-intl';

// Filter function remains unchanged (locale-agnostic)
export const reportingFilter = ({ data, needle }) => {
  return data?.filter(
    (item) =>
      item.firstname &&
      item.firstname.toLowerCase().includes(needle.toLowerCase())
  );
};

// Hook to generate table columns with translations
export const useTableColumns = () => {
  const t = useTranslations('components.dataset');
  const locale = useLocale();

  const STUDENTS_COLUMNS = [
    {
      name: t('students.columns.student'),
      selector: (row) => ` ${row.firstname}, ${row.lastname} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.student_identifier'),
      selector: (row) => row.student_identifier || t('students.columns.na'),
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.class'),
      selector: (row) => row.level,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.parent'),
      selector: (row) => ` ${row.parent_firstname}, ${row.parent_lastname} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.parent_phone'),
      selector: (row) => row.parent_phone,
      desc: true,
      sortable: true,
      reorder: true,
      //always ltr
      style: { direction: 'ltr' },
    },
    {
      name: t('students.columns.enrollment'),
      selector: (row) => row.enrollment_date,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.enrollment_number'),
      selector: (row) => row.enrollment_number || t('students.columns.na'),
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('students.columns.current_month'),
      desc: true,
      sortable: true,
      reorder: true,
      cell: ({ isCurrentMonthPaid, enrollmentConfirmed }) => {
        const isPending = !enrollmentConfirmed;
        const bgColor = isPending
          ? colors.yellow.light
          : isCurrentMonthPaid
            ? colors.secondary.soft
            : colors.red.light;
        const color = isPending
          ? colors.yellow.regular
          : isCurrentMonthPaid
            ? colors.secondary.regular
            : colors.red.regular;
        const label = isPending
          ? t('students.columns.not_confirmed')
          : isCurrentMonthPaid
            ? t('students.columns.paid')
            : t('students.columns.not_paid');
        return (
          <Badge
            bgColor={bgColor}
            color={color}
            variant={'subtle'}
            py={1}
            px={3}
            borderRadius={50}
          >
            {label}
          </Badge>
        );
      },
    },
  ];

  const PAYMENTS_COLUMNS = [
    {
      name: t('payments.columns.payment_date'),
      selector: (row) =>
        new Date(row.createdAt).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('payments.columns.amount'),
      selector: (row) => Number(row.amount ?? 0),
      desc: true,
      sortable: true,
      reorder: true,
      cell: (row) => formatMoneyWithCurrency(row.amount),
    },
    {
      name: t('payments.columns.type'),
      selector: (row) =>
        mapPaymentType[row.paymentType] || t('payments.columns.other'),
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('payments.columns.monthly'),
      selector: (row) => row.monthOf && dateFormatter(new Date(row.monthOf)),
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('payments.columns.student'),
      selector: (row) => `${row.firstname} ${row.lastname} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('payments.columns.status'),
      selector: (row) => row.status,
      desc: true,
      sortable: true,
      reorder: true,
      cell: (row) => (
        <Badge
          bgColor={
            row.status === 'paid'
              ? colors.secondary.soft
              : row.status === 'cancelled'
                ? colors.red.light
                : colors.yellow.light
          }
          color={
            row.status === 'paid'
              ? colors.secondary.regular
              : row.status === 'cancelled'
                ? colors.red.regular
                : colors.yellow.regular
          }
          variant={'subtle'}
          py={1}
          px={3}
          borderRadius={50}
        >
          {row.status === 'paid'
            ? t('payments.paid')
            : row.status === 'cancelled'
              ? t('payments.cancelled')
              : t('payments.pending')}
        </Badge>
      ),
    },
  ];

  const EXPENSES_COLUMNS = [
    {
      name: t('expenses.columns.date'),
      selector: (row) =>
        new Date(row.createdAt).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      sortable: true,
      id: 'expenseDate',
    },
    {
      name: t('expenses.columns.amount'),
      selector: (row) => Number(row.amount ?? 0),
      sortable: true,
      id: 'amount',
      cell: (row) => formatMoneyWithCurrency(row.amount),
    },
    {
      name: t('expenses.columns.category'),
      selector: (row) => row.category,
      sortable: true,
      id: 'category',
    },
    {
      name: t('expenses.columns.school'),
      selector: (row) => row.school || t('expenses.columns.na'),
      sortable: true,
      id: 'school',
    },
    {
      name: t('expenses.columns.school_year'),
      selector: (row) => row.schoolYear || t('expenses.columns.na'),
      sortable: true,
      id: 'schoolYear',
    },
  ];

  const SCHOOLS_COLUMNS = [
    {
      name: t('schools.columns.name'),
      selector: (row) => `${row.name} `,
      desc: true,
      sortable: true,
      reorder: true,
      cell: (row) => <div style={{ width: '200px' }}>{row.name}</div>,
    },
    {
      name: t('schools.columns.address'),
      selector: (row) => `${row.address} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schools.columns.phone'),
      selector: (row) => `${row.phone} `,
      desc: true,
      sortable: true,
      reorder: true,
      style: { direction: 'ltr' },
    },
    {
      name: t('schools.columns.email'),
      selector: (row) => `${row.email} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schools.columns.type'),
      selector: (row) => `${row.type} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schools.columns.ief'),
      selector: (row) => `${row.IEF} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schools.columns.director'),
      selector: (row) => `${row.responsibleName} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schools.columns.parent_school'),
      selector: (row) => `${row.parentSchool} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
  ];

  const TEACHERS_COLUMNS = [
    {
      name: t('teachers.columns.full_name'),
      selector: (row) => `${row.firstname} ${row.lastname} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.email'),
      selector: (row) => `${row.email} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.phone_number'),
      selector: (row) => `${row.phoneNumber} `,
      desc: true,
      sortable: true,
      reorder: true,
      style: { direction: 'ltr' },
    },
    {
      name: t('teachers.columns.address'),
      selector: (row) => `${row.address} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.school'),
      selector: (row) => `${row.school} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.language'),
      selector: (row) => `${row.language || t('teachers.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.contract_type'),
      selector: (row) => `${row.contractType || t('teachers.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('teachers.columns.level'),
      selector: (row) => `${row.level || t('teachers.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
  ];

  const USER_COLUMNS = [
    {
      name: t('users.columns.last_name'),
      selector: (row) => `${row.lastname || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('users.columns.first_name'),
      selector: (row) => `${row.firstname || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('users.columns.email'),
      selector: (row) => `${row.email || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('users.columns.phone'),
      selector: (row) => `${row.phone || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
      style: { direction: 'ltr' },
    },
    {
      name: t('users.columns.school'),
      selector: (row) => `${row.school?.name || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('users.columns.role'),
      selector: (row) => `${row.role?.name || t('users.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
  ];

  const SCHOOL_YEAR_COLUMNS = [
    {
      name: t('schoolYears.columns.title'),
      selector: (row) => `${row.name || t('schoolYears.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schoolYears.columns.start_date'),
      selector: (row) => `${row.startDate || t('schoolYears.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schoolYears.columns.end_date'),
      selector: (row) => `${row.endDate || t('schoolYears.columns.na')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schoolYears.columns.status'),
      selector: (row) =>
        `${row.isActive ? t('schoolYears.columns.active') : t('schoolYears.columns.inactive')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schoolYears.columns.state'),
      selector: (row) =>
        `${row.isCurrent ? t('schoolYears.columns.current') : row.isEnded ? t('schoolYears.columns.ended') : t('schoolYears.columns.upcoming')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
    {
      name: t('schoolYears.columns.description'),
      selector: (row) =>
        `${row.description || t('schoolYears.columns.no_description')} `,
      desc: true,
      sortable: true,
      reorder: true,
    },
  ];

  return {
    STUDENTS_COLUMNS,
    PAYMENTS_COLUMNS,
    EXPENSES_COLUMNS,
    SCHOOLS_COLUMNS,
    TEACHERS_COLUMNS,
    USER_COLUMNS,
    SCHOOL_YEAR_COLUMNS,
  };
};
