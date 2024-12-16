import { number, object, string } from 'yup';

export const authenticationSchema = object({
  identifier: string().trim().required(),
  password: string().trim().required(),
  authentication: string().trim(),
});

const AllowedSexes = ['Homme', 'Femme'];
const AllowedStudentTypes = [
  'Hafiz',
  'Ancien Redoublant',
  'Ancien Passant',
  'Nouveau',
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

export const studentRegistrationSchema = object({
  firstname: string().trim().required(),
  lastname: string().trim().required(),
  sex: string().trim().oneOf(AllowedSexes).required(),
  date: number().max(31).required(),
  month: number().max(12).required(),
  year: number().min(1990).required(),
  birthplace: string().trim().required(),
  parent_lastname: string().trim().required(),
  parent_firstname: string().trim().required(),
  parent_phone: number().required(),
  level: string().trim().required(),
  classroom: string().trim().required(),
  class_letter: string().trim().required(),
  registration: string(),
});

export const studentConfirmationchema = object({
  studentType: string().trim().oneOf(AllowedStudentTypes).required(),
  socialCategory: string().trim().oneOf(AllowedSocialCategories).required(),
  comment: string().trim(),
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
