import { Badge } from '@chakra-ui/react';
import { colors, messages } from '@theme';
import { dateFormatter, mapPaymentType } from '@utils/tools/mappers';

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
      schools: {
        name,
        address,
        phone: phoneSchool,
        email,
        type,
        IEF,
        responsible,
        parentSchool,
      },
      teachers: {
        complete_name,
        email: teacherEmail,
        phoneNumber,
        gender,
        school,
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
    selector: (row) => row.enrollment_date,
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
export const PAYMENTS_COLUMNS = [{
  name: 'Date de paiement',
  selector: row => (new Date(row.createdAt)).toLocaleDateString(
    'fr-FR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ),
  desc: true,
  sortable: true,
  reorder: true,
},
{
  name: 'Montant (FCFA)',
  selector: row => row.amount,
  desc: true,
  sortable: true,
  reorder: true,
  // right: true,
},
{
  name: 'Type',
  selector: row => (mapPaymentType[row.paymentType] || 'Autre'),
  desc: true,
  sortable: true,
  reorder: true,
},
  {
    name: 'Mensualité',
    selector: row => row.monthOf && dateFormatter(new Date(row.monthOf)),
    desc: true,
    sortable: true,
    reorder: true,
  },
{
  name: 'Élève',
  selector: row => `${row.firstname} ${row.lastname}`,
  desc: true,
  sortable: true,
  reorder: true,
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
    selector: (row) => `${row.responsibleName}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: parentSchool,
    selector: (row) => `${row.parentSchool}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
];

export const TEACHERS_COLUMNS = [
  {
    name: 'Nom complet',
    selector: (row) => `${row.lastname}, ${row.firstname}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Email',
    selector: (row) => `${row.email}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Numéro de téléphone',
    selector: (row) => `${row.phoneNumber}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Adresse',
    selector: (row) => `${row.address}`,
    desc: true,
    sortable: true,
    reorder: true,
  },

  {
    name: 'Établissement',
    selector: (row) => `${row.school}`,
    desc: true,
    sortable: true,
    reorder: true,
  },

  {
    name: 'Langue parlée',
    selector: (row) => `${row.language || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },

  {
    name: 'Type de contrat',
    selector: (row) => `${row.contractType || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Niveau',
    selector: (row) => `${row.level || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },

];

export const USER_COLUMNS = [
  {
    name: 'Nom',
    selector: (row) => `${row.lastname || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Prénom',
    selector: (row) => `${row.firstname || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Email',
    selector: (row) => `${row.email || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Téléphone',
    selector: (row) => `${row.phone || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Etablissement',
    selector: (row) => `${row.school?.name || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Rôle',
    selector: (row) => `${row.role?.name || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
];

export const SCHOOL_YEAR_COLUMNS = [
  {
    name: 'Titre',
    selector: (row) => `${row.name || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Date de début',
    selector: (row) => `${row.startDate || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Date de fin',
    selector: (row) => `${row.endDate || 'N/A'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },

  {
    name: 'Statut',
    selector: (row) => `${row.isActive ? 'Actif' : 'Inactif'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
  {
    name: 'Etat',
    selector: (row) => `${row.isCurrent ? 'En cours' : (row.isEnded ? 'Clôturé' : 'A venir')}`,
    desc: true,
    sortable: true,
    reorder: true,

  },
  {
    name: 'Description',
    selector: (row) => `${row.description || 'No description'}`,
    desc: true,
    sortable: true,
    reorder: true,
  },
];
