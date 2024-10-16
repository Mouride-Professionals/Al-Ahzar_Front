import { Badge } from '@chakra-ui/react';
import { colors, messages } from '@theme';

export const reportingFilter = ({ data, needle }) => {
  return data.filter(
    (item) =>
      item.firstname &&
      item.firstname.toLowerCase().includes(needle.toLowerCase())
  );
};

const {
  constants: {
    dataset: {
      students: {
        students,
        _class,
        parents,
        phone,
        registration,
        current_month,
        paid,
        not_paid,
      },
    },
  },
} = messages.components;

export const STUDENTS_COLUMNS = [
  {
    name: students,
    selector: (row) => `${row.lastname}, ${row.firstname}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: _class,
    selector: (row) => row.level,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: parents,
    selector: (row) => `${row.parent_lastname}, ${row.parent_firstname}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: phone,
    selector: (row) => row.parent_phone,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: registration,
    selector: (row) => row.registered_at,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: current_month,
    // selector: (row) => row.isCurrentMonthPaid ? 'Payé' : 'Impayé',
    desc: true,
    sortable: true,
    reorder: true,
    cell: ({ isCurrentMonthPaid }) => (
      <Badge
        bgColor={isCurrentMonthPaid ? colors.secondary.soft : colors.red.light}
        color={
          isCurrentMonthPaid ? colors.secondary.regular : colors.red.regular
        }
        variant={'subtle'}
        py={1}
        px={3}
        borderRadius={50}
      >
        {isCurrentMonthPaid ? paid : not_paid}
      </Badge>
    ),
  },
];
