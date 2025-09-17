export const ROLES = {
  CAISSIER: 'Caissier',
  SURVEILLANT_GENERAL: 'Surveillant general',
  SECRETAIRE_GENERAL: 'Secretaire General',
  DIRECTEUR_GENERAL: 'Directeur General',
  DIRECTEUR_ETABLISSMENT: 'Directeur etablissment',

  // Assistant roles (Adjoint) - same permissions as main roles
  ADJOINT_CAISSIER: 'Adjoint Caissier',
  ADJOINT_SURVEILLANT_GENERAL: 'Adjoint Surveillant General',
  ADJOINT_SECRETAIRE_GENERAL: 'Adjoint Secretaire General',
  ADJOINT_DIRECTEUR_GENERAL: 'Adjoint Directeur General',
  ADJOINT_DIRECTEUR_ETABLISSMENT: 'Adjoint Directeur Etablissement',

  // Finance roles - read-only access to all finance across establishments
  SECRETAIRE_GENERALE_FINANCES: 'Secretaire Générale de Finances',
  ADJOINT_SECRETAIRE_GENERALE_FINANCES:
    'Adjoint Secretaire Générale de Finances',
};

export const hasPermission = (role, permission) => {
  // Map assistant roles to their main role permissions
  const roleMapping = {
    [ROLES.ADJOINT_CAISSIER]: ROLES.CAISSIER,
    [ROLES.ADJOINT_SURVEILLANT_GENERAL]: ROLES.SURVEILLANT_GENERAL,
    [ROLES.ADJOINT_SECRETAIRE_GENERAL]: ROLES.SECRETAIRE_GENERAL,
    [ROLES.ADJOINT_DIRECTEUR_GENERAL]: ROLES.DIRECTEUR_GENERAL,
    [ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT]: ROLES.DIRECTEUR_ETABLISSMENT,
    // SGF assistant role maps to main SGF role
    [ROLES.ADJOINT_SECRETAIRE_GENERALE_FINANCES]:
      ROLES.SECRETAIRE_GENERALE_FINANCES,
  };

  // Use mapped role for assistant roles, otherwise use original role
  const effectiveRole = roleMapping[role] || role;

  const permissions = {
    [ROLES.CAISSIER]: {
      viewSchoolFinance: true,
      createExpense: true,
      viewHome: true,
      managePayments: true,
    },
    [ROLES.SURVEILLANT_GENERAL]: {
      manageStudents: true,
      bulkStudents: true,
      viewSchoolReports: true,
      viewClasses: true,
      viewHome: true,
    },
    [ROLES.SECRETAIRE_GENERAL]: {
      viewAllSchoolsFinance: true,
      createSchool: true,
      manageSchool: true,
      switchSchools: true,
      viewHome: true,
      manageUsers: true,
      manageTeachers: true,
      manageSchoolYears: true,
    },
    [ROLES.DIRECTEUR_GENERAL]: {
      viewAllSchoolsFinance: true,
      createSchool: true,
      manageSchool: true,
      switchSchools: true,
      viewHome: true,
      manageUsers: true,
      manageTeachers: true,
      manageSchoolYears: true,
      manageRoles: true, // For role management
    },
    [ROLES.DIRECTEUR_ETABLISSMENT]: {
      viewSchoolFinance: true,
      createExpense: true,
      manageStudents: true,
      viewSchoolReports: true,
      viewClasses: true,
      viewHome: true,
    },
    // SGF roles - read-only finance access across all establishments
    [ROLES.SECRETAIRE_GENERALE_FINANCES]: {
      viewAllSchoolsFinance: true,
      viewSchoolFinance: true,
      switchSchools: true,
      viewHome: true,
      // Notable: NO create/edit permissions - read-only access
      createExpense: false,
      managePayments: false,
      createSchool: false,
      manageSchool: false,
      manageUsers: false,
      manageTeachers: false,
      manageSchoolYears: false,
    },
  };
  return permissions[effectiveRole]?.[permission] || false;
};

// Helper to get allowed schools for a role
export const getAllowedSchools = (role, userSchoolId, allSchools) => {
  // Define role groups with their permissions
  const directionRoles = [
    ROLES.SECRETAIRE_GENERAL,
    ROLES.DIRECTEUR_GENERAL,
    ROLES.ADJOINT_SECRETAIRE_GENERAL,
    ROLES.ADJOINT_DIRECTEUR_GENERAL,
  ];

  // SGF roles have global read-only access to all schools
  const financeGlobalRoles = [
    ROLES.SECRETAIRE_GENERALE_FINANCES,
    ROLES.ADJOINT_SECRETAIRE_GENERALE_FINANCES,
  ];

  const schoolSpecificRoles = [
    ROLES.CAISSIER,
    ROLES.SURVEILLANT_GENERAL,
    ROLES.DIRECTEUR_ETABLISSMENT,
    ROLES.ADJOINT_CAISSIER,
    ROLES.ADJOINT_SURVEILLANT_GENERAL,
    ROLES.ADJOINT_DIRECTEUR_ETABLISSMENT,
  ];

  if (directionRoles.includes(role) || financeGlobalRoles.includes(role)) {
    return allSchools; // Access to all schools
  }
  if (schoolSpecificRoles.includes(role)) {
    return allSchools.filter((school) => school.id === userSchoolId); // Only assigned school
  }
  return [];
};
