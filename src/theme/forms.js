const {
  classCreationSchema,
  studentRegistrationSchema,
  schoolCreationSchema,
  teacherRecruitmentSchema,
} = require('@utils/schemas');
const { ClassTitle } = require('@utils/tools/mappers');
const mapOptions = (array) =>
  Array.from(array).map((option) => ({
    name: ClassTitle(option),
    value: option,
  }));

module.exports = {
  name: 'Theming forms files',
  themeForms: {
    inputs: {
      login: {
        identifier: {
          label: 'Identifiant',
          placeholder: 'bayeousmane@mouridpro.com',
          type: 'text',
          name: 'identifier',
        },
        password: {
          label: 'Mot de passe',
          placeholder: '****************',
          type: 'password',
          name: 'password',
        },
        submit: 'Connexion',
        specifics: {
          forgotten_password: 'Forgot password?',
          account: "Don't have an account? Sign up",
          highlight: 'Sign up',
        },
      },
      student: {
        registration: {
          lastname: {
            placeholder: 'Nom',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder: 'Prénom',
            type: 'text',
            uid: 'firstname',
          },
          sex: {
            placeholder: 'Sexe',
            uid: 'sex',
            select: true,
            options: mapOptions(
              studentRegistrationSchema.fields.sex._whitelist
            ),
          },
          date: {
            placeholder: 'Jour',
            type: 'text',
            uid: 'date',
          },
          month: {
            placeholder: 'Mois',
            type: 'text',
            uid: 'month',
          },
          year: {
            placeholder: 'Année',
            type: 'text',
            uid: 'year',
          },
          birthplace: {
            placeholder: 'Lieu de naissance',
            type: 'text',
            uid: 'birthplace',
          },
          parent_lastname: {
            placeholder: 'Nom',
            type: 'text',
            uid: 'parent_lastname',
          },
          parent_firstname: {
            placeholder: 'Prénom',
            type: 'text',
            uid: 'parent_firstname',
          },
          parent_phone: {
            placeholder: 'Numéro de télèphone',
            type: 'text',
            uid: 'parent_phone',
          },
          level: {
            placeholder: 'Niveau',
            type: 'text',
            uid: 'level',
          },
          classroom: {
            placeholder: 'Classe',
            type: 'text',
            uid: 'classroom',
          },
          class_letter: {
            placeholder: 'Lettre',
            type: 'text',
            uid: 'class_letter',
          },
        },
        confirm: {
          studentType: {
            placeholder: "Type d'élève",
            select: true,
            uid: 'studentType',
            options: [
              { name: 'Hafiz', value: 'Hafiz' },
              {
                name: 'Ancien Redoublant',
                value: 'Ancien Redoublant',
              },
              { name: 'Ancien Passant', value: 'Ancien Passant' },
              { name: 'Nouveau', value: 'Nouveau' },
            ],
          },
          socialCategory: {
            placeholder: 'Cas social',
            select: true,
            uid: 'socialCategory',
            options: [
              { name: 'Non', value: 'Non' },
              {
                name: 'Réduction inscription',
                value: 'Réduction inscription',
              },
              {
                name: 'Réduction mensualité',
                value: 'Réduction mensualité',
              },
              {
                name: 'Tout tarifs offerts',
                value: 'Tout tarifs offerts',
              },
            ],
          },
          comment: {
            placeholder: 'Commentaire',
            type: 'text',
            uid: 'comment',
          },
        },
      },
      class: {
        creation: {
          grade: {
            placeholder: 'Cycle',
            uid: 'grade',
            select: true,
            options: mapOptions(classCreationSchema.fields.grade._whitelist),
          },
          level: {
            placeholder: 'Niveau',
            uid: 'level',
            select: true,
            options: mapOptions(classCreationSchema.fields.level._whitelist),
          },
          letter: {
            placeholder: 'Section',
            uid: 'letter',
            select: true,
            options: mapOptions(classCreationSchema.fields.letter._whitelist),
          },
        },
      },
      school: {
        creation: {
          name: {
            placeholder: 'Nom de l’ecole',
            uid: 'name',
            type: 'text',
          },
          address: {
            placeholder: 'Adresse',
            uid: 'address',
            type: 'text',
          },
          city: {
            placeholder: 'Ville/Village',
            uid: 'city',
            type: 'text',
          },
          email: {
            placeholder: 'Email',
            uid: 'email',
            type: 'email',
          },
          postBox: {
            placeholder: 'Boite postale',
            uid: 'postBox',
            type: 'text',
          },
          phone: {
            placeholder: 'Téléphone',
            uid: 'phone',
            type: 'text',
          },
          type: {
            placeholder: 'Type',
            uid: 'type',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.type._whitelist),
          },
          etablissementParent: {
            placeholder: 'Etablissement parent',
            uid: 'etablissementParent',
            type: 'text',
          },
          IEF: {
            placeholder: 'IEF',
            uid: 'IEF',
            type: 'text',
            // select: true,
            // options: mapOptions(schoolCreationSchema.fields.IEF._whitelist),
          },
          responsibleName: {
            placeholder: 'Nom du directeur',
            uid: 'responsibleName',
            type: 'text',
          },

          region: {
            placeholder: 'Région',
            uid: 'region',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.region._whitelist),
          },
          department: {
            placeholder: 'Département',
            uid: 'department',
            type: 'text',
          },
          commune: {
            placeholder: 'Commune',
            uid: 'commune',
            type: 'text',
          },
          note: {
            placeholder: 'Note supplémentaire sur le terrain',
            uid: 'note',
            type: 'text',
          },
          isAlAzharLand: {
            placeholder: 'Le terrain appartient-il à Al Azhar?',
            uid: 'isAlAzharLand',
            select: true,
            options: [
              { name: 'Oui', value: true },
              { name: 'Non', value: false },
            ],
          },
          phoneFix: {
            placeholder: 'Téléphone Fixe',
            uid: 'phoneFix',
            type: 'text',
          },
          IA: {
            placeholder: 'IA',
            uid: 'IA',
            type: 'text',
            // select: true,
            // options: mapOptions(schoolCreationSchema.fields.IA._whitelist),
          },
          creationDate: {
            placeholder: 'Date de création',
            uid: 'creationDate',
            type: 'date',
          },
        },
      },
      teacher: {
        recruitment: {
          lastname: {
            placeholder: 'Nom',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder: 'Prénom',
            type: 'text',
            uid: 'firstname',
          },
          gender: {
            placeholder: 'Sexe',
            uid: 'gender',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.gender._whitelist
            ),
          },
          phoneNumber: {
            placeholder: 'Téléphone',
            uid: 'phoneNumber',
            type: 'text',
          },
          email: {
            placeholder: 'Email',
            uid: 'email',
            type: 'text',
            grow: 2,
          },
          etablissement: {
            placeholder: 'Établissement',
            uid: 'etablissement',
            type: 'text',
          },
          birthDate: {
            placeholder: 'Date de naissance',
            uid: 'birthDate',
            type: 'date',
          },
          birthPlace: {
            placeholder: 'Lieu de naissance',
            uid: 'birthPlace',
            type: 'text',
          },
          address: {
            placeholder: 'Adresse',
            uid: 'address',
            type: 'text',
          },
          maritalStatus: {
            placeholder: 'Situation matrimoniale',
            uid: 'maritalStatus',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.maritalStatus._whitelist //to be added later
            ),
          },
          academicDegree: {
            placeholder: 'Dernier diplome',
            uid: 'academicDegree',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.academicDegree._whitelist // to be added later
            ),
          },
          professionalDegrees: {
            placeholder: 'Diplomes professionnels',
            uid: 'professionalDegrees',
            type: 'text',
          },
          disciplines: {
            placeholder: 'Disciplines à enseigner',
            uid: 'disciplines',
            type: 'text',
          },
          language: {
            placeholder: 'Langue parlée',
            uid: 'language',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.language._whitelist //to be added later
            ),
          },
          subjects: {
            placeholder: 'Matieres enseignées',
            uid: 'subjects',
            type: 'text',
          },
          contractType: {
            placeholder: 'Type de contrat',
            uid: 'contractType',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.contractType._whitelist //to be added later
            ),
          },
          level: {
            placeholder: 'Niveau',
            uid: 'level',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.level._whitelist //to be added later
            ),
          },
          salary: {
            placeholder: 'Salaire',
            uid: 'salary',
            type: 'number',
          },
          contributions: {
            placeholder: 'Contributions',
            uid: 'contributions',
            type: 'text',
          },
          registrationNumber: {
            placeholder: 'Numéro d’immatriculation',
            uid: 'registrationNumber',
            type: 'text',
          },
          generation: {
            placeholder: 'Génération',
            uid: 'generation',
            type: 'text',
          },
          salaryPerHour: {
            placeholder: 'Salaire par heure',
            uid: 'salaryPerHour',
            type: 'number',
          },
          hoursNumber: {
            placeholder: 'Nombre d’heures',
            uid: 'hoursNumber',
            type: 'number',
          },
          additionalResponsibilities: {
            placeholder: 'Responsabilités supplémentaires',
            uid: 'additionalResponsibilities',
            type: 'text',
          },
          countryFrom: {
            placeholder: 'Pays d’origine',
            uid: 'countryFrom',
            text: 'text',
          },
          arrivalDate: {
            placeholder: 'Date d’arrivée',
            uid: 'arrivalDate',
            type: 'date',
          },
          previousInstitutes: {
            placeholder: 'Institutes antérieurs',
            uid: 'previousInstitutes',
            type: 'text',
          },

          //end
        },
      },
    },
    messages: {
      login: {
        errors: {
          not_authorized: 'Identifiant ou mot de passe non valide',
        },
      },
      registration: {
        info: {
          bitrhPlaceMessage: 'Date et lieu de naissance',
          classInfoMessage: 'Informations sur la classe',
          personalInfoMessage: 'Informations personnelles',
          tutorInfoMessage: 'Informations sur le tuteur',
        },
        errors: {
          already_exists: 'Cet élève existe déjà',
          problem: 'Une erreur est survenue lors de la sauvegarde',
        },
      },
      school: {
        creation: {
          info: {
            generalInfoMessage: 'Informations generales',
            addressInfoMessage: 'Informations de l’adresse',
            contactInfoMessage: 'Informations de contact',
            additionalInfoMessage: 'Informations additionnelles',
          },
          errors: {
            already_exists: 'Cet école existe déjà',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        },
      },
      teacher: {
        recruitment: {
          info: {
            personalInfoMessage: 'Informations personnelles',
            contactInfoMessage: 'Informations de contact',
            contractInfoMessage: 'Informations sur le contrat',
            additionalInfoMessage: 'Informations additionnelles',
          },
          errors: {
            already_exists: 'Cet enseignant existe déjà',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        },
      },
    },
  },
};
