import { colors, messages, routes } from '@theme';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap, HiHome } from 'react-icons/hi';
import { LuSchool } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';

const {
  page_route: {
    dashboard: { initial, cashier, surveillant, all_access, direction },
  },
} = routes;

export const ACCESS_ROUTES = {

  Caissier: cashier,
  ['Surveillant general']: surveillant,
  ['Secretaire General']: direction,
  ['Directeur General']: direction,
  ['Directeur etablissment']: all_access,
  isAdmin(role) {
    return role == 'Secretaire General' || role == 'Directeur General';
  },
  isSurveillant(role) {
    return role == 'Surveillant general';
  },
  isCashier(role) {
    return role == 'Caissier';
  },
};

export const DashboardMainMenu = ({ activeLink, role }) => [
  // home
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
  // school
  ACCESS_ROUTES[role?.name]?.schools && {
    active: [
      ACCESS_ROUTES[role?.name]?.schools.all,
      ACCESS_ROUTES[role?.name]?.schools?.detail,
      ACCESS_ROUTES[role?.name]?.schools?.classes,
    ].includes(activeLink),
    icon: (
      <LuSchool
        size={20}
        color={
          [
            ACCESS_ROUTES[role?.name]?.schools.all,
            ACCESS_ROUTES[role?.name]?.schools?.detail,
            ACCESS_ROUTES[role?.name]?.schools?.classes,
          ].includes(activeLink)
            ? colors.white
            : colors.secondary.regular
        }
      />
    ),
    color: colors.secondary.regular,
    message: messages.components.menu.schools,
    link: ACCESS_ROUTES[role?.name]?.schools.all,
  },
  // classes not be seen by all_access
  ACCESS_ROUTES[role?.name]?.classes && {
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
  // students
  !ACCESS_ROUTES[role?.name]?.students && {
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
    active: [
      ACCESS_ROUTES[role?.name]?.teachers.all,
      ACCESS_ROUTES[role?.name]?.teachers.detail,
      ACCESS_ROUTES[role?.name]?.teachers.create,
    ].includes(activeLink),
    icon: (
      <FaSuitcase
        size={20}
        color={
          [
            ACCESS_ROUTES[role?.name]?.teachers.all,
            ACCESS_ROUTES[role?.name]?.teachers.detail,
            ACCESS_ROUTES[role?.name]?.teachers.create,
          ].includes(activeLink)
            ? colors.white
            : colors.secondary.regular
        }
      />
    ),
    color: colors.secondary.regular,
    message: messages.components.menu.teachers,
    link: ACCESS_ROUTES[role?.name]?.teachers.all,
  },
];

// import { colors, messages, routes } from '@theme';
// import { FaSuitcase } from 'react-icons/fa';
// import { HiAcademicCap, HiHome } from 'react-icons/hi';
// import { LuSchool } from 'react-icons/lu';
// import { SiGoogleclassroom } from 'react-icons/si';

// const {
//   page_route: {
//     dashboard: { initial, cashier, surveillant, all_access, direction },
//   },
// } = routes;

// const ACCESS_ROUTES = {
//   Caissier: cashier,
//   ['Surveillant general']: surveillant,
//   ['Secretaire General']: direction,
//   ['Directeur General']: direction,
//   ['Directeur etablissment']: all_access,
// };

// const MENU_ITEMS = {
//   home: {
//     icon: HiHome,
//     message: messages.components.menu.home,
//     linkKey: 'initial',
//   },
//   schools: {
//     icon: LuSchool,
//     message: messages.components.menu.schools,
//     linkKey: 'schools.all',
//     subLinks: ['schools.all', 'schools.detail', 'schools.classes'],
//   },
//   classes: {
//     icon: SiGoogleclassroom,
//     message: messages.components.menu.classes,
//     linkKey: 'classes',
//   },
//   students: {
//     icon: HiAcademicCap,
//     message: messages.components.menu.students.initial,
//     linkKey: 'students.initial',
//     subLinks: ['students.create', 'students.initial', 'students.confirm'],
//     isDisabled: true,
//   },
//   teachers: {
//     icon: FaSuitcase,
//     message: messages.components.menu.teachers,
//     linkKey: 'teachers.all',
//     subLinks: ['teachers.all', 'teachers.detail', 'teachers.create'],
//   },
// };

// const isActive = (links, activeLink) => links.includes(activeLink);
// const getIconColor = (active, activeColor, defaultColor) =>
//   active ? activeColor : defaultColor;

// export const DashboardMainMenu = ({ activeLink, role }) => {
//   const roleRoutes = ACCESS_ROUTES[role?.name] || {};

//   return Object.entries(MENU_ITEMS).map(([key, item]) => {
//     const links = item.subLinks?.map((subLink) => roleRoutes[subLink]) || [];
//     const isItemActive = isActive(links, activeLink) || activeLink === roleRoutes[item.linkKey];

//     if (key === 'classes' && role === 'all_access') return null;

//     return {
//       active: isItemActive,
//       icon: (
//         <item.icon
//           size={20}
//           color={getIconColor(
//             isItemActive,
//             colors.white,
//             colors.secondary.regular
//           )}
//         />
//       ),
//       color: colors.secondary.regular,
//       message: item.message,
//       link: roleRoutes[item.linkKey],
//       isDisabled: item.isDisabled,
//     };
//   });
// };
