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
      schools: { name, address, phone: phoneSchool, email, type, IEF, responsible },
      teachers: { complete_name, email: teacherEmail, phoneNumber, gender, },
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

export const SCHOOLS_COLUMNS = [
  {
    name: name,
    selector: (row) => `${row.name}`,
    desc: true,
    sortable: true,
    reorder: true,
    cell: (row) => (
      //adjust the width of the cell
      <div style={{ width: '200px' }}>{row.name}</div>
    ),
  },
  {
    name: address,
    selector: (row) => `${row.address}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: phoneSchool,
    selector: (row) => `${row.phone}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: email,
    selector: (row) => `${row.email}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: type,
    selector: (row) => `${row.type}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: IEF,
    selector: (row) => `${row.IEF}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: responsible,
    selector: (row) => `${row.responsible}`,
    desc: true,
    sortable: true,
    reorder: true,
  }

];

export const TEACHERS_COLUMNS = [
  {
    name: complete_name,
    selector: (row) => `${row.lastname}, ${row.firstname}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: teacherEmail,
    selector: (row) => `${row.email}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: phoneNumber,
    selector: (row) => `${row.phoneNumber}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: gender,
    selector: (row) => `${row.gender}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
];

