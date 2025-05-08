import { array, boolean, date, number, object, ref, string } from 'yup';

export const authenticationSchema = object({
  identifier: string().trim().required(),
  password: string().trim().required(),
  authentication: string().trim(),
});

export const changePasswordSchema = object({
  currentPassword: string().trim().required(),
  newPassword: string().trim().required(),
  confirmPassword: string()
    .trim()
    .oneOf([ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
  authentication: string().trim(),
})

const AllowedSexes = ['Homme', 'Femme'];
const AllowedRoles = ['Directeur Géneral', 'Sécretaraire Géneral', 'Caissier', 'Surveillant Géneral', 'Directeur etablissment'];
const AllowedEnrollmentTypes = [
  'Ancien Redoublant',
  'Ancien Passant',
  'Nouveau',
];
const AllowedPaymentTypes = [
  'Mensualité',
  'Inscription',
  'Blouse',
  'Contribution des parents',
  'Examen',
];
const AllowedSocialCategories = [
  'Non',
  'Réduction inscription',
  'Réduction mensualité',
  'Tout tarifs offerts',
];

const classComplexity = {
  allowedCycles: ['primaire', 'secondaire 1er cycle', 'secondaire 2eme cycle'],
  allowedClassLevels: [
    'CI',
    'CP',
    'CE1',
    'CE2',
    'CM1',
    'CM2',
    'a 6eme',
    'a 5eme',
    'a 4eme',
    'a 3eme',
    'a 2nd',
    'a 1ere',
    'Terminale',
  ],
  allowedLetter: ['A', 'B', 'C', 'D', 'E', 'F'],
};
const allowedExpenseCategory = [
  "Services Publics",
  "Salaires",
  "Fournitures",
  "Entretien",
  "Transport",
  "Activités Parascolaires",
  "Équipements",
  "Formation",
  "Autres",


];
const schoolComplexity = {
  allowedCycles: ['primaire', 'secondaire 1er cycle', 'secondaire 2eme cycle'],
  allowedRegions: [
    'Dakar',
    'Diourbel',
    'Fatick',
    'Kaffrine',
    'Kaolack',
    'Kédougou',
    'Kolda',
    'Louga',
    'Matam',
    'Saint-Louis',
    'Sédhiou',
    'Tambacounda',
    'Thiès',
    'Ziguinchor',
  ],
  allowedDepartmentsByRegion: [
    {
      Dakar: ['Dakar', 'Pikine', 'Rufisque', 'Guédiawaye', 'Keur Massar'],
      Ziguinchor: ['Bignona', 'Oussouye', 'Ziguinchor'],
      Diourbel: ['Bambey', 'Diourbel', 'Mbacké'],
      Saint_Louis: ['Dagana', 'Podor', 'Saint - Louis'],
      Tambacounda: ['Bakel', 'Tambacounda', 'Goudiry', 'Koumpentoum'],
      Kaolack: ['Kaolack', 'Nioro du Rip', 'Guinguinéo'],
      Thiês: ['Mbour', 'Thiès', 'Tivaouane'],
      Louga: ['Kébere', 'Linguère', 'Louga'],
      Fatick: ['Fatick', 'Foundiougne', 'Gossas'],
      Kolda: ['Kolda', 'Vélingara', 'Médina Yoro Foulah'],
      Matam: ['Kanel', 'Matam', 'Ranérou'],
      Kaffrine: ['Kaffrine', 'Birkelane', 'Koungheul', 'Malem Hodar'],
      Kédougou: ['Kédougou', 'Salemata', 'Sedhiou', 'Sikasso'],
      Sédhiou: ['Sédhiou', 'Bounkiling', 'Goudomp'],
    },
  ],
  allowedTypes: ['Centre', 'Centre Secondaire', 'Annexe'],
  isAlAzharLand: [true, false],
  allowedDepartments: [
    'Bakel',
    'Bambey',
    'Bignona',
    'Birkelane',
    'Bounkiling',
    'Dagana',
    'Dakar',
    'Diourbel',
    'Fatick',
    'Foundiougne',
    'Gossas',
    'Goudiry',
    'Goudomp',
    'Guédiawaye',
    'Guinguinéo',
    'Kafrine',
    'Kaolack',
    'Kanel',
    'Kébémer',
    'Kédougou',
    'Keur Massar',
    'Kolda',
    'Koumpentoum',
    'Koungheul',
    'Linguère',
    'Louga',
    "M'bour",
    'Malem Hodar',
    'Matam',
    'Mbacké',
    'Médina Yoro Foulah',
    'Nioro du Rip',
    'Oussouye',
    'Pikine',
    'Podor',
    'Ranérou',
    'Rufisque',
    'Saint-Louis',
    'Salemata',
    'Saraya',
    'Sédhiou',
    'Tambacounda',
    'Thiès',
    'Tivaouane',
    'Vélingara',
    'Ziguinchor',
  ],
};
const allowedIA = schoolComplexity.allowedRegions.map((region) => 'IA de ' + region);
const allowedIEF = schoolComplexity.allowedDepartments.map((department) => 'IEF de ' + department);
const allowedIEFbyIA = allowedIA.map((IA) => allowedIEF.filter((IEF) => IEF.startsWith(IA)));

const teacherComplexity = {
  AllowedMaritalStatuses: ['Célibataire', 'Marié(e)', 'Divorçé(e)', 'Veuf(ve)'],
  AllowedAcademicDegrees: ["Baccalauréat", "Licence", "Master", "Doctorat"],
  AllowedProfessionalDegrees: ['BTS', 'BAC', 'BAC+2', 'BAC+3', 'BAC+4', 'BAC+5'],
  AllowedLanguages: ['Francais', 'Anglais', 'Arabe', 'Wolof'],
  AllowedContractTypes: [
    'Disponible',
    'Employé Etat',
    'Temps Partiel',
    'Etranger',
  ],
  AllowedLevels: ['Primaire', 'Moyen', 'Secondaire'],
};

export const studentRegistrationSchema = object({
  firstname: string().trim().required('Firstname is required'),
  lastname: string().trim().required('Lastname is required'),
  sex: string().trim().oneOf(AllowedSexes).required('Sex is required'),
  socialCategory: string().trim().oneOf(AllowedSocialCategories).required('Social category is required'),
  date: number().max(31).required('Date is required'),
  month: number().max(12).required(),
  year: number().min(1990).required(),
  birthplace: string().trim().required('Birthplace is required'),
  parent_lastname: string().trim().required('Parent lastname is required'),
  parent_firstname: string().trim().required('Parent firstname is required'),
  parent_phone: number().required('Phone number is required'),
  level: string().trim().required(),
  classroom: string().trim().required(),
  class_letter: string().trim().required('Class letter is required'),
  registration: string(),
});

export const studentConfirmationSchema = object({

  amount: number().required().label('Montant total'),
  monthOf: date().label('Mois de paiement'),
  paymentDetail: object({
    monthlyFee: number().label('Frais de la mensualité'),
    enrollmentFee: number().label('Frais de l`inscription'),
    blouseFee: number().label('Frais de la blouse'),
    examFee: number().label('Frais de l`examen'),
    parentContributionFee: number().label('Frais de la cotisation des parents'),
  }),


});

export const enrollmentSchema = object({
  classroom: string().trim().required(),
  enrollmentType: string().trim().oneOf(AllowedEnrollmentTypes).required('Enrollment type is required'),
  socialCategory: string().trim().oneOf(AllowedSocialCategories).required('Social category is required'),
});


export const passwordRecoverySchema = object({
  email: string().email().required(),
});

export const classCreationSchema = object({
  grade: string().trim().oneOf(classComplexity.allowedCycles).required(),
  level: string().trim().oneOf(classComplexity.allowedClassLevels).required(),
  letter: string().trim().oneOf(classComplexity.allowedLetter).required(),
  schoolCreation: string(),
});

export const schoolCreationSchema = object({
  name: string().trim().required(),
  creationDate: date().required(),
  responsibleName: string().required(),
  type: string().trim().oneOf(schoolComplexity.allowedTypes).required(),
  region: string().trim().oneOf(schoolComplexity.allowedRegions).required(),
  department: string()
    .trim()
    .oneOf(schoolComplexity.allowedDepartments)
    .required(),
  commune: string().trim().required(),
  city: string().trim().required(),
  address: string().trim().required(),
  IA: string().trim().oneOf(allowedIA).required(),
  IEF: string().trim().oneOf(allowedIEF).required(),
  phone: number().required(),
  phoneFix: number().required(),
  email: string().email().required(),
  postBox: string().trim().required(),
  isAlAzharLand: boolean().required(),
  note: string().trim(),
});

// user schema creation 
export const userCreationSchema = object({
  username: string().trim().required(),
  firstname: string().trim().required(),
  lastname: string().trim().required(),
  email: string().email().required(),
  password: string().trim().required(),
  role: string().trim().required('Role is required'),
});


export const teacherRecruitmentSchema = object({
  firstname: string().trim().required('Firstname is required'),
  lastname: string().trim().required('Lastname is required'),
  gender: string()
    .oneOf(AllowedSexes, 'Invalid gender')
    .required('Gender is required'),
  phoneNumber: string().trim().required('Phone number is required'),
  email: string().email('Invalid email').required('Email is required'),
  school: string().required('Etablissement is required'),
  birthDate: date().required('Birth date is required'),
  birthPlace: string().trim().required('Birth place is required'),
  address: string().trim().required('Address is required'),
  maritalStatus: string()
    .trim()
    .oneOf(teacherComplexity.AllowedMaritalStatuses, 'Invalid marital status')
    .required('Marital status is required'),
  academicDegree: string()
    .trim()
    .oneOf(teacherComplexity.AllowedAcademicDegrees, 'Invalid academic degree')
    .required('Academic degree is required'),
  professionalDegrees: array()
    .of(string())
    .min(0, 'At least one professional degree must be selected.')
    .required('Professional degrees are required.'),
  disciplines: array()
    .of(string())
    .min(0, 'At least one discipline must be selected.')
    .required('Disciplines are required.'),
  language: string()
    .oneOf(teacherComplexity.AllowedLanguages, 'Invalid language')
    .required('Language is required'),
  subjects: array()
    .of(string())
    .min(0, 'At least one subject must be selected.')
    .required('Subjects are required.'),
  contractType: string()
    .trim()
    .oneOf(teacherComplexity.AllowedContractTypes, 'Invalid contract type')
    .required('Contract type is required'),
  level: string()
    .oneOf(teacherComplexity.AllowedLevels, 'Invalid level')
    .required('Level is required'),
  salary: number()
    .default(0)
    .when('contractType', {
      is: teacherComplexity.AllowedContractTypes[0],
      then: (schema) => schema.required('Salary is required for contract type "Disponible"'),
      otherwise: (schema) => schema.notRequired(),
    }),
  contributions: number().notRequired(),
  registrationNumber: string().trim().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[1],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  generation: string().trim().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[1],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  salaryPerHour: number()
    .default(0)
    .when('contractType', {
      is: teacherComplexity.AllowedContractTypes[2],
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  hoursNumber: number()
    .default(0)
    .when('contractType', {
      is: teacherComplexity.AllowedContractTypes[2],
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  additionalResponsibilities: string().trim().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[2],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  countryFrom: string().trim().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[3],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  arrivalDate: date().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[3],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  previousInstitutes: string().trim().when('contractType', {
    is: teacherComplexity.AllowedContractTypes[3],
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const schoolYearSchema = object({
  name: string().trim().required('Le nom de l\'année scolaire est requis'),
  startDate: date().required('La date de début est requise'),
  endDate: date().min(ref('startDate'), 'La date de fin doit être ultérieure à la date de début')
    // .max(ref('startDate'), 'La durée de l\'année scolaire ne peut pas dépasser 12 mois')
    // .test(
    //   'max-12-months',
    //   'La durée de l\'année scolaire ne peut pas dépasser 12 mois',
    //   (endDate, context) => {
    //     if (!endDate) return false;
    //     const startDate = context.parent.startDate;
    //     if (!startDate) return false;

    //     const diffInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    //       (endDate.getMonth() - startDate.getMonth());

    //     return diffInMonths >= 15;
    //   }
    // )
    .required('La date de fin est requise'),
  description: string().trim().required('La description est requise'),
});

export const expenseSchema = object({
  expenseDate: date()
    .required("La date est requise")
    .typeError("Veuillez entrer une date valide"),
  amount: number()
    .required("Le montant est requis")
    .min(0, "Le montant doit être positif")
    .typeError("Veuillez entrer un montant valide"),
  category: string()
    .required("La catégorie est requise")
    .oneOf(allowedExpenseCategory,
      "Catégorie invalide"
    ),
  description: string().optional(),
  // school: number()
  //   .required("L'école est requise")
  //   .typeError("Veuillez sélectionner une école"),
  // schoolYear: number()
  //   .required("L'année scolaire est requise")
  //   .typeError("Veuillez sélectionner une année scolaire"),
});
