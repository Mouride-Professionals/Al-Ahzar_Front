import { colors, messages, routes } from '@theme';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap, HiHome } from 'react-icons/hi';
import { SiGoogleclassroom } from 'react-icons/si';

const {
  page_route: {
    dashboard: { initial, cashier, surveillant, all_access },
  },
} = routes;

export const ACCESS_ROUTES = {
  Caissier: cashier,
  ['Surveillant general']: surveillant,
  ['Secretaire General']: all_access,
  ['Directeur etablissment']: all_access,
};

export const DashboardMainMenu = ({ activeLink, role }) => [
  {
    active: activeLink == initial,
    icon: (
      <HiHome
        size={20}
        color={activeLink == initial ? colors.white : colors.secondary.regular}
      />
    ),
    color: colors.secondary.regular,
    message: messages.components.menu.home,
    link: initial,
  },
  {
    active: activeLink == ACCESS_ROUTES[role?.name]?.classes,
    icon: (
      <SiGoogleclassroom
        size={20}
        color={
          activeLink == ACCESS_ROUTES[role?.name]?.classes
            ? colors.white
            : colors.secondary.regular
        }
      />
    ),
    color: colors.secondary.regular,
    message: messages.components.menu.classes,
    link: ACCESS_ROUTES[role?.name]?.classes,
  },
  {
    active: [
      ACCESS_ROUTES[role?.name]?.students?.create,
      ACCESS_ROUTES[role?.name]?.students?.initial,
      ACCESS_ROUTES[role?.name]?.students?.confirm,
    ].includes(activeLink),
    icon: (
      <HiAcademicCap
        size={20}
        color={
          [
            ACCESS_ROUTES[role?.name]?.students?.create,
            ACCESS_ROUTES[role?.name]?.students?.initial,
            ACCESS_ROUTES[role?.name]?.students?.confirm,
          ].includes(activeLink)
            ? colors.white
            : colors.secondary.regular
        }
      />
    ),
    isDisabled: true,
    color: colors.secondary.regular,
    message: messages.components.menu.students.initial,
    link: ACCESS_ROUTES[role?.name]?.students.initial,
  },
  ACCESS_ROUTES[role?.name]?.teachers && {
    active: activeLink == ACCESS_ROUTES[role?.name]?.teachers,
    icon: (
      <FaSuitcase
        size={20}
        color={
          activeLink == ACCESS_ROUTES[role?.name]?.teachers
            ? colors.white
            : colors.secondary.regular
        }
      />
    ),
    color: colors.secondary.regular,
    message: messages.components.menu.teachers,
    link: ACCESS_ROUTES[role?.name]?.teachers,
  },
];
