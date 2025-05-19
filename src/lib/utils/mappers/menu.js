import { colors, routes } from '@theme';
import { hasPermission, ROLES } from '@utils/roles';
import { useTranslations } from 'next-intl';
import { FaSuitcase } from 'react-icons/fa';
import { HiAcademicCap, HiOutlineHome } from 'react-icons/hi';
import { SiCashapp, SiGoogleclassroom } from 'react-icons/si';

const {
  page_route: {
    dashboard: { initial, cashier, surveillant, direction },
  },
} = routes;

export const ACCESS_ROUTES = {
  [ROLES.CAISSIER]: cashier,
  [ROLES.SURVEILLANT_GENERAL]: surveillant,
  [ROLES.SECRETAIRE_GENERAL]: direction,
  [ROLES.DIRECTEUR_GENERAL]: direction, // Inherits secretaire_general routes
  [ROLES.DIRECTEUR_ETABLISSMENT]: {
    initial: cashier.initial,
    finance: cashier.finance,
    classes: surveillant.classes,
    students: surveillant.students,
  }, // Combines caissier and surveillant_general routes
  isAdmin(role) {
    return role === ROLES.SECRETAIRE_GENERAL || role === ROLES.DIRECTEUR_GENERAL;
  },
  isSurveillant(role) {
    return role === ROLES.SURVEILLANT_GENERAL;
  },
  isCashier(role) {
    return role === ROLES.CAISSIER;
  },
};

export const DashboardMainMenu = ({ activeLink, role }) => {
  const roleName = role?.name;
  const routes = ACCESS_ROUTES[roleName] || {};
  //Internationalization
  const t = useTranslations('components.menu');
  const messages = {
    components: {
      menu: {
        home: t('home'),
        classes: t('classes'),
        finance: t('finance'),
        students: {
          initial: t('students.initial'),
          create: t('students.create'),
        },
        users: t('users'),
        teachers: t('teachers'),
        schools: t('schools'),
        school_years: t('school_years'),
      },
    },
  };

  const menuItems = [
    // Home
    {
      active: activeLink === routes.initial,
      icon: (
        <HiOutlineHome
          size={20}
          color={activeLink === routes.initial ? colors.white : colors.secondary.regular}
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.home,
      link: routes.initial,
      isVisible: hasPermission(roleName, 'viewHome'),
    },
    // Classes
    routes.classes && {
      active: activeLink === routes.classes?.all,
      icon: (
        <SiGoogleclassroom
          size={20}
          color={activeLink === routes.classes?.all ? colors.white : colors.secondary.regular}
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.classes,
      link: routes.classes?.all,
      isVisible: hasPermission(roleName, 'viewClasses'),
    },
    // Finance
    routes.finance && {
      active: activeLink === routes.finance?.initial,
      icon: (
        <SiCashapp
          size={20}
          color={activeLink === routes.finance?.initial ? colors.white : colors.secondary.regular}
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.finance,
      link: routes.finance?.initial,
      isVisible: hasPermission(roleName, 'viewSchoolFinance') || hasPermission(roleName, 'viewAllSchoolsFinance'),
    },
    // Students
    routes.students && {
      active: [
        routes.students?.initial,
        routes.students?.create,
        routes.students?.confirm,
        routes.students?.resubscribe,
      ].filter(Boolean).includes(activeLink),
      icon: (
        <HiAcademicCap
          size={20}
          color={
            [
              routes.students?.initial,
              routes.students?.create,
              routes.students?.confirm,
              routes.students?.resubscribe,
            ].filter(Boolean).includes(activeLink)
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      // isDisabled: true,
      color: colors.secondary.regular,
      message: messages.components.menu.students.initial,
      link: routes.students?.initial,
      isVisible: false, //hasPermission(roleName, 'manageStudents'),
    },
    // Users
    routes.users && {
      active: [
        routes.users?.all,
        routes.users?.detail,
        routes.users?.create,
        routes.users?.edit,
      ].filter(Boolean).includes(activeLink),
      icon: (
        <HiAcademicCap
          size={20}
          color={
            [
              routes.users?.all,
              routes.users?.detail,
              routes.users?.create,
              routes.users?.edit,
            ].filter(Boolean).includes(activeLink)
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.users,
      link: routes.users?.all,
      isVisible: hasPermission(roleName, 'manageUsers') || hasPermission(roleName, 'manageRoles'),
    },
    // Teachers
    routes.teachers && {
      active: [
        routes.teachers?.all,
        routes.teachers?.detail,
        routes.teachers?.create,
        routes.teachers?.edit,
      ].filter(Boolean).includes(activeLink),
      icon: (
        <FaSuitcase
          size={20}
          color={
            [
              routes.teachers?.all,
              routes.teachers?.detail,
              routes.teachers?.create,
              routes.teachers?.edit,
            ].filter(Boolean).includes(activeLink)
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.teachers,
      link: routes.teachers?.all,
      isVisible: hasPermission(roleName, 'manageTeachers'),
    },
    // School Years
    routes.school_years && {
      active: [
        routes.school_years?.all,
        routes.school_years?.detail,
        routes.school_years?.create,
        routes.school_years?.edit,
      ].filter(Boolean).includes(activeLink),
      icon: (
        <FaSuitcase
          size={20}
          color={
            [
              routes.school_years?.all,
              routes.school_years?.detail,
              routes.school_years?.create,
              routes.school_years?.edit,
            ].filter(Boolean).includes(activeLink)
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.school_years,
      link: routes.school_years?.all,
      isVisible: hasPermission(roleName, 'manageSchoolYears'),
    },
  ];

  return menuItems.filter((item) => item && item.isVisible && item.link);
};
// update this import { colors, messages, routes } from '@theme';
// import { FaSuitcase } from 'react-icons/fa';
// import { HiAcademicCap, HiOutlineHome } from 'react-icons/hi';
// import { SiCashapp, SiGoogleclassroom, } from 'react-icons/si';

// const {
//   page_route: {
//     dashboard: { initial, cashier, surveillant, all_access, direction },
//   },
// } = routes;
// export const ROLES = {
//   caissier: 'Caissier',
//   surveillant_general: 'Surveillant general',
//   secretaire_general: 'Secretaire General',
//   directeur_general: 'Directeur General',
//   directeur_etablissment: 'Directeur etablissment',
// }

// export const ACCESS_ROUTES = {

//   Caissier: cashier,
//   ['Surveillant general']: surveillant,
//   ['Secretaire General']: direction,
//   ['Directeur General']: direction,
//   ['Directeur etablissment']: all_access,
//   isAdmin(role) {
//     return role == 'Secretaire General' || role == 'Directeur General';
//   },
//   isSurveillant(role) {
//     return role == 'Surveillant general';
//   },
//   isCashier(role) {
//     return role == 'Caissier';
//   },
// };

// export const DashboardMainMenu = ({ activeLink, role }) => [
//   // home
//   {
//     active: activeLink == ACCESS_ROUTES[role?.name]?.initial,
//     icon: (
//       <HiOutlineHome
//         size={20}
//         color={activeLink == ACCESS_ROUTES[role?.name]?.initial ? colors.white : colors.secondary.regular}
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.home,
//     link: ACCESS_ROUTES[role?.name]?.initial,
//   },

//   // classes not be seen by all_access
//   ACCESS_ROUTES[role?.name]?.classes && ACCESS_ROUTES[role?.name]?.classes.all && {
//     active: activeLink == ACCESS_ROUTES[role?.name]?.classes.all,
//     icon: (
//       <SiGoogleclassroom
//         size={20}
//         color={
//           activeLink == ACCESS_ROUTES[role?.name]?.classes.all
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.classes,
//     link: ACCESS_ROUTES[role?.name]?.classes.all,
//   },
//   // finance not be seen by all_access
//   ACCESS_ROUTES[role?.name]?.finance && ACCESS_ROUTES[role?.name]?.finance.initial && {
//     active: activeLink == ACCESS_ROUTES[role?.name]?.finance.initial,
//     icon: (
//       //finance and money icon
//       <
//         SiCashapp
//         size={20}
//         color={
//           activeLink == ACCESS_ROUTES[role?.name]?.finance.initial
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.finance,
//     link: ACCESS_ROUTES[role?.name]?.finance.initial,
//   },
//   // students
//   !ACCESS_ROUTES[role?.name]?.students && {
//     active: [
//       ACCESS_ROUTES[role?.name]?.students?.create,
//       ACCESS_ROUTES[role?.name]?.students?.initial,
//       ACCESS_ROUTES[role?.name]?.students?.confirm,
//     ].includes(activeLink),
//     icon: (
//       <HiAcademicCap
//         size={20}
//         color={
//           [
//             ACCESS_ROUTES[role?.name]?.students?.create,
//             ACCESS_ROUTES[role?.name]?.students?.initial,
//             ACCESS_ROUTES[role?.name]?.students?.confirm,
//           ].includes(activeLink)
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     isDisabled: true,
//     color: colors.secondary.regular,
//     message: messages.components.menu.students.initial,
//     link: ACCESS_ROUTES[role?.name]?.students.initial,
//   },
//   //users
//   ACCESS_ROUTES[role?.name]?.users && {
//     active: [
//       ACCESS_ROUTES[role?.name]?.users.all,
//       ACCESS_ROUTES[role?.name]?.users.detail,
//       ACCESS_ROUTES[role?.name]?.users.create,
//     ].includes(activeLink),
//     icon: (
//       <HiAcademicCap
//         size={20}
//         color={
//           [
//             ACCESS_ROUTES[role?.name]?.users.all,
//             ACCESS_ROUTES[role?.name]?.users.detail,
//             ACCESS_ROUTES[role?.name]?.users.create,
//           ].includes(activeLink)
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.users,
//     link: ACCESS_ROUTES[role?.name]?.users.all,
//   },
//   ACCESS_ROUTES[role?.name]?.teachers && {
//     active: [
//       ACCESS_ROUTES[role?.name]?.teachers.all,
//       ACCESS_ROUTES[role?.name]?.teachers.detail,
//       ACCESS_ROUTES[role?.name]?.teachers.create,
//     ].includes(activeLink),
//     icon: (
//       <FaSuitcase
//         size={20}
//         color={
//           [
//             ACCESS_ROUTES[role?.name]?.teachers.all,
//             ACCESS_ROUTES[role?.name]?.teachers.detail,
//             ACCESS_ROUTES[role?.name]?.teachers.create,
//           ].includes(activeLink)
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.teachers,
//     link: ACCESS_ROUTES[role?.name]?.teachers.all,
//   },
//   ACCESS_ROUTES[role?.name]?.school_years && {
//     active: [
//       ACCESS_ROUTES[role?.name]?.school_years.all,
//       ACCESS_ROUTES[role?.name]?.school_years.detail,
//       ACCESS_ROUTES[role?.name]?.school_years.create,
//     ].includes(activeLink),
//     icon: (
//       <FaSuitcase
//         size={20}
//         color={
//           [
//             ACCESS_ROUTES[role?.name]?.school_years.all,
//             ACCESS_ROUTES[role?.name]?.school_years.detail,
//             ACCESS_ROUTES[role?.name]?.school_years.create,
//           ].includes(activeLink)
//             ? colors.white
//             : colors.secondary.regular
//         }
//       />
//     ),
//     color: colors.secondary.regular,
//     message: messages.components.menu.school_years,
//     link: ACCESS_ROUTES[role?.name]?.school_years.all,
//   },
// ];
