const {
  classCreationSchema,
  studentRegistrationSchema,
  schoolCreationSchema,
  teacherRecrutmentSchema,
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
            options: [{ name: 'Oui', value: true }, { name: 'Non', value: false }],
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
          sex: {
            placeholder: 'Sexe',
            uid: 'sex',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.sex._whitelist
            ),
          },
          phoneNumber: {
            placeholder: 'Téléphone',
            uid: 'phoneNumber',
            type: 'text'
          }
          , email: {
            placeholder: 'Email',
            uid: 'email',
            type: 'text'
          }
        },

      }
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
        }

      },
      teacher: {
        recruitment: {
          info: {
            personalInfoMessage: 'Informations personnelles',
            contactInfoMessage: 'Informations de contact',
            additionalInfoMessage: 'Informations additionnelles',
          },
          errors: {
            already_exists: 'Cet enseignant existe déjà',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        }
      }
    },

  }
};
