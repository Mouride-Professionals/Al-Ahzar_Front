export const ROLES = {
    CAISSIER: 'Caissier',
    SURVEILLANT_GENERAL: 'Surveillant general',
    SECRETAIRE_GENERAL: 'Secretaire General',
    DIRECTEUR_GENERAL: 'Directeur General',
    DIRECTEUR_ETABLISSMENT: 'Directeur etablissment',
};


export const hasPermission = (role, permission) => {
    const permissions = {
        [ROLES.CAISSIER]: {
            viewSchoolFinance: true,
            createExpense: true,
            viewHome: true,
        },
        [ROLES.SURVEILLANT_GENERAL]: {
            manageStudents: true,
            viewSchoolReports: true,
            viewClasses: true,
            viewHome: true,
        },
        [ROLES.SECRETAIRE_GENERAL]: {
            viewAllSchoolsFinance: true,
            createSchool: true,
            switchSchools: true,
            viewHome: true,
            manageUsers: true,
            manageTeachers: true,
            manageSchoolYears: true,
        },
        [ROLES.DIRECTEUR_GENERAL]: {
            viewAllSchoolsFinance: true,
            createSchool: true,
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
    };
    return permissions[role]?.[permission] || false;
};

// Helper to get allowed schools for a role
export const getAllowedSchools = (role, userSchoolId, allSchools) => {
    if ([ROLES.SECRETAIRE_GENERAL, ROLES.DIRECTEUR_GENERAL].includes(role)) {
        return allSchools; // Access to all schools
    }
    if ([ROLES.CAISSIER, ROLES.SURVEILLANT_GENERAL, ROLES.DIRECTEUR_ETABLISSMENT].includes(role)) {
        return allSchools.filter((school) => school.id === userSchoolId); // Only assigned school
    }
    return [];
};