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
  [ROLES.ADJOINT_CAISSIER]: cashier, // Same access as Caissier
  [ROLES.SURVEILLANT_GENERAL]: surveillant,
  [ROLES.ADJOINT_SURVEILLANT_GENERAL]: surveillant, // Same access as Surveillant General
  [ROLES.SECRETAIRE_GENERAL]: direction,
  [ROLES.ADJOINT_SECRETAIRE_GENERAL]: direction, // Same access as Secretaire General
  [ROLES.DIRECTEUR_GENERAL]: direction, // Inherits secretaire_general routes
  [ROLES.ADJOINT_DIRECTEUR_GENERAL]: direction, // Same access as Directeur General
  [ROLES.DIRECTEUR_ETABLISSMENT]: {
    initial: cashier.initial,
    finance: cashier.finance,
    classes: surveillant.classes,
    students: surveillant.students,
  }, // Combines caissier and surveillant_general routes
  [ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT]: {
    initial: cashier.initial,
    finance: cashier.finance,
    classes: surveillant.classes,
    students: surveillant.students,
  }, // Same access as Directeur Etablissement
  // SGF roles - read-only finance access via direction dashboard
  [ROLES.SECRETAIRE_GENERALE_FINANCES]: direction,
  [ROLES.ADJOINT_SECRETAIRE_GENERALE_FINANCES]: direction,
  isAdmin(role) {
    return (
      role === ROLES.SECRETAIRE_GENERAL ||
      role === ROLES.DIRECTEUR_GENERAL ||
      role === ROLES.ADJOINT_SECRETAIRE_GENERAL ||
      role === ROLES.ADJOINT_DIRECTEUR_GENERAL
    );
  },
  isSurveillant(role) {
    return (
      role === ROLES.SURVEILLANT_GENERAL ||
      role === ROLES.ADJOINT_SURVEILLANT_GENERAL
    );
  },
  isCashier(role) {
    return role === ROLES.CAISSIER || role === ROLES.ADJOINT_CAISSIER;
  },
  // Helper to check if role is SGF (finance read-only)
  isFinanceReadOnly(role) {
    return (
      role === ROLES.SECRETAIRE_GENERALE_FINANCES ||
      role === ROLES.ADJOINT_SECRETAIRE_GENERALE_FINANCES
    );
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
          color={
            activeLink === routes.initial
              ? colors.white
              : colors.secondary.regular
          }
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
          color={
            activeLink === routes.classes?.all
              ? colors.white
              : colors.secondary.regular
          }
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
          color={
            activeLink === routes.finance?.initial
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.finance,
      link: routes.finance?.initial,
      isVisible:
        hasPermission(roleName, 'viewSchoolFinance') ||
        hasPermission(roleName, 'viewAllSchoolsFinance'),
    },
    // Students
    routes.students && {
      active: [
        routes.students?.initial,
        routes.students?.create,
        routes.students?.confirm,
        routes.students?.resubscribe,
      ]
        .filter(Boolean)
        .includes(activeLink),
      icon: (
        <HiAcademicCap
          size={20}
          color={
            [
              routes.students?.initial,
              routes.students?.create,
              routes.students?.confirm,
              routes.students?.resubscribe,
            ]
              .filter(Boolean)
              .includes(activeLink)
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
      ]
        .filter(Boolean)
        .includes(activeLink),
      icon: (
        <HiAcademicCap
          size={20}
          color={
            [
              routes.users?.all,
              routes.users?.detail,
              routes.users?.create,
              routes.users?.edit,
            ]
              .filter(Boolean)
              .includes(activeLink)
              ? colors.white
              : colors.secondary.regular
          }
        />
      ),
      color: colors.secondary.regular,
      message: messages.components.menu.users,
      link: routes.users?.all,
      isVisible:
        hasPermission(roleName, 'manageUsers') ||
        hasPermission(roleName, 'manageRoles'),
    },
    // Teachers
    routes.teachers && {
      active: [
        routes.teachers?.all,
        routes.teachers?.detail,
        routes.teachers?.create,
        routes.teachers?.edit,
      ]
        .filter(Boolean)
        .includes(activeLink),
      icon: (
        <FaSuitcase
          size={20}
          color={
            [
              routes.teachers?.all,
              routes.teachers?.detail,
              routes.teachers?.create,
              routes.teachers?.edit,
            ]
              .filter(Boolean)
              .includes(activeLink)
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
      ]
        .filter(Boolean)
        .includes(activeLink),
      icon: (
        <FaSuitcase
          size={20}
          color={
            [
              routes.school_years?.all,
              routes.school_years?.detail,
              routes.school_years?.create,
              routes.school_years?.edit,
            ]
              .filter(Boolean)
              .includes(activeLink)
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
