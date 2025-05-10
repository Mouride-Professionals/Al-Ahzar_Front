const {
  classCreationSchema,
  studentRegistrationSchema,
  schoolCreationSchema,
  teacherRecruitmentSchema,
  userCreationSchema,
  expenseSchema,
  enrollmentSchema,
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
          placeholder: 'vWc4o@example.com',
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
      change_password: {
        current_password: {
          label: 'Mot de passe actuel',
          placeholder: '****************',
          type: 'password',
          name: 'currentPassword',
        },
        new_password: {
          label: 'Nouveau mot de passe',
          placeholder: '****************',
          type: 'password',
          name: 'newPassword',
        },
        confirm_password: {
          label: 'Confirmer le mot de passe',
          placeholder: '****************',
          type: 'password',
          name: 'confirmPassword',
        },
        submit: 'Changer le mot de passe',
        specifics: {
          current_password: 'Current Password',
          new_password: 'New Password',
          confirm_password: 'Confirm Password',
          highlight: 'Change Password',
        },

      },
      forgot_password: {
        email: {
          label: 'Email',
          placeholder: 'Entrez votre email',
          type: 'email',
          name: 'email',
        },
        submit: 'Envoyer',
      },
      reset_password: {
        password: {
          label: 'Nouveau mot de passe',
          placeholder: '****************',
          type: 'password',
          name: 'password',
        },
        confirm_password: {
          label: 'Confirmer le mot de passe',
          placeholder: '****************',
          type: 'password',
          name: 'confirmPassword',
        },
        submit: 'Réinitialiser le mot de passe',
      },
      student: {
        registration: {
          lastname: {
            placeholder: 'Nom',
            label: 'Nom',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder: 'Prénom',
            label: 'Prénom',
            type: 'text',
            uid: 'firstname',
          },
          sex: {
            placeholder: 'Sexe',
            label: 'Sexe',
            uid: 'sex',
            select: true,
            options: mapOptions(
              studentRegistrationSchema.fields.sex._whitelist
            ),
          },
          socialCategory: {
            placeholder: 'Cas social',
            label: 'Cas social',
            select: true,
            uid: 'socialCategory',
            options: mapOptions(
              studentRegistrationSchema.fields.socialCategory._whitelist
            ),
          },
          date: {
            placeholder: 'Jour',
            label: 'Jour',
            type: 'text',
            uid: 'date',
          },
          month: {
            placeholder: 'Mois',
            label: 'Mois',
            type: 'text',
            uid: 'month',
          },
          year: {
            placeholder: 'Année',
            label: 'Année',
            type: 'text',
            uid: 'year',
          },
          birthplace: {
            placeholder: 'Lieu de naissance',
            label: 'Lieu de naissance',
            type: 'text',
            uid: 'birthplace',
          },
          parent_lastname: {
            placeholder: 'Nom',
            label: 'Nom',
            type: 'text',
            uid: 'parent_lastname',
          },
          parent_firstname: {
            placeholder: 'Prénom',
            label: 'Prénom',
            type: 'text',
            uid: 'parent_firstname',
          },
          parent_phone: {
            placeholder: 'Numéro de télèphone',
            label: 'Numéro de télèphone',
            type: 'text',
            uid: 'parent_phone',
          },
          level: {
            placeholder: 'Niveau',
            label: 'Niveau',
            type: 'text',
            uid: 'level',
          },
          classroom: {
            placeholder: 'Classe',
            label: 'Classe',
            type: 'text',
            uid: 'classroom',
          },
          class_letter: {
            placeholder: 'Lettre',
            label: 'Lettre',
            type: 'text',
            uid: 'class_letter',
          },
        },
        confirm: {
          studentType: {
            placeholder: "Type d'élève",
            label: "Type d'élève",
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
            label: 'Cas social',
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
            label: 'Commentaire',
            type: 'text',
            uid: 'comment',
          },
          amount: {
            placeholder: 'Montant total',
            label: 'Montant total',
            type: 'number',
            uid: 'amount',
          },
          monthOf: {
            placeholder: 'Mois de paiement',
            label: 'Mois de paiement',
            type: 'date',
            uid: 'monthOf',
          },
          paymentDetail: {
            monthlyFee: {
              placeholder: 'Frais de la mensualité',
              label: 'Frais de la mensualité',
              type: 'number',
              uid: 'monthlyFee',
            },
            enrollmentFee: {
              placeholder: 'Frais de l`inscription',
              label: 'Frais de l`inscription',
              type: 'number',
              uid: 'enrollmentFee',
            },
            blouseFee: {
              placeholder: 'Frais de la blouse',
              label: 'Frais de la blouse',
              type: 'number',
              uid: 'blouseFee',
            },
            examFee: {
              placeholder: 'Frais de l`examen',
              label: 'Frais de l`examen',
              type: 'number',
              uid: 'examFee',
            }, parentContributionFee: {
              placeholder: 'Frais de la cotisation des parents',
              label: 'Frais de la cotisation des parents',
              type: 'number',
              uid: 'parentContributionFee',
            }
          }

        },
        enrollment: {
          classroom: {
            placeholder: 'Classe',
            label: 'Classe',
            uid: 'class',
            type: 'text',
          },
          socialCategory: {
            placeholder: 'Cas social',
            label: 'Cas social',
            select: true,
            uid: 'socialCategory',
            options: mapOptions(enrollmentSchema.fields.socialCategory._whitelist),
          },
          enrollmentType: {
            placeholder: 'Type d`inscription',
            label: 'Type d`inscription',
            select: true,
            uid: 'enrollmentType',
            options: mapOptions(enrollmentSchema.fields.enrollmentType._whitelist),
          }

        },
        payment: {
          amount: {
            placeholder: 'Montant à payer',
            label: 'Montant à payer',
            type: 'number',
            uid: 'amount',
          },
          monthOf: {
            placeholder: 'Mois à payer',
            label: 'Mois à payer',
            type: 'date',
            uid: 'monthOf',
          }
        },
      },
      class: {
        creation: {
          grade: {
            placeholder: 'Cycle',
            label: 'Cycle',
            uid: 'grade',
            select: true,
            options: mapOptions(classCreationSchema.fields.grade._whitelist),
          },
          level: {
            placeholder: 'Niveau',
            label: 'Niveau',
            uid: 'level',
            select: true,
            options: mapOptions(classCreationSchema.fields.level._whitelist),
          },
          letter: {
            placeholder: 'Section',
            label: 'Section',
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
            label: 'Nom de l’ecole',
            uid: 'name',
            type: 'text',
          },
          address: {
            placeholder: 'Adresse',
            label: 'Adresse',
            uid: 'address',
            type: 'text',
          },
          city: {
            placeholder: 'Ville/Village',
            label: 'Ville/Village',
            uid: 'city',
            type: 'text',
          },
          email: {
            placeholder: 'Email',
            label: 'Email',
            uid: 'email',
            type: 'email',
          },
          postBox: {
            placeholder: 'Boite postale',
            label: 'Boite postale',
            uid: 'postBox',
            type: 'text',
          },
          phone: {
            placeholder: 'Téléphone',
            label: 'Téléphone',
            uid: 'phone',
            type: 'text',
          },
          banner: {
            placeholder: "Logo de l'école", label: "Logo de l'école",
            uid: "banner", type: "file"
          },
          type: {
            placeholder: 'Type',
            label: 'Type',
            uid: 'type',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.type._whitelist),
          },
          parentSchool: {
            placeholder: 'Etablissement parent',
            label: 'Etablissement parent',
            uid: 'parentSchool',
            type: 'text',
          },
          IEF: {
            placeholder: 'IEF',
            label: 'IEF',
            uid: 'IEF',
            type: 'text',
            // select: true,
            // options: mapOptions(schoolCreationSchema.fields.IEF._whitelist),
          },
          responsibleName: {
            placeholder: 'Nom du directeur',
            label: 'Nom du directeur',
            uid: 'responsibleName',
            type: 'text',
          },

          region: {
            placeholder: 'Région',
            label: 'Région',
            uid: 'region',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.region._whitelist),
          },
          department: {
            placeholder: 'Département',
            label: 'Département',
            uid: 'department',
            type: 'text',
          },
          commune: {
            placeholder: 'Commune',
            label: 'Commune',
            uid: 'commune',
            type: 'text',
          },
          note: {
            placeholder: 'Note supplémentaire sur le terrain',
            label: 'Note supplémentaire sur le terrain',
            uid: 'note',
            type: 'text',
          },
          isAlAzharLand: {
            placeholder: 'Le terrain appartient-il à Al Azhar?',
            label: 'Le terrain appartient-il à Al Azhar?',
            uid: 'isAlAzharLand',
            select: true,
            options: [
              { name: 'Oui', value: true },
              { name: 'Non', value: false },
            ],
          },
          phoneFix: {
            placeholder: 'Téléphone Fixe',
            label: 'Téléphone Fixe',
            uid: 'phoneFix',
            type: 'text',
          },
          IA: {
            placeholder: 'IA',
            label: 'IA',
            uid: 'IA',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.IA._whitelist),
          },
          creationDate: {
            placeholder: 'Date de création',
            label: 'Date de création',
            uid: 'creationDate',
            type: 'date',
          },
        },
      },
      user: {
        creation: {
          username: {
            placeholder: 'Nom d’utilisateur',
            label: 'Nom d’utilisateur',
            uid: 'username',
            type: 'text',
          },
          firstname: {
            placeholder: 'Prénom',
            label: 'Prrenom',
            uid: 'firstname',
            type: 'text',
          },
          lastname: {
            placeholder: 'Nom',
            label: 'Nom',
            uid: 'lastname',
            type: 'text',
          },
          email: {
            placeholder: 'Email',
            label: 'Email',
            uid: 'email',
            type: 'email',
          },
          password: {
            placeholder: 'Mot de passe',
            label: 'Mot de passe',
            uid: 'password',
            type: 'password',
          },
          confirmPassword: {
            placeholder: 'Confirmer le mot de passe',
            label: 'Confirmer le mot de passe',
            uid: 'confirmPassword',
            type: 'password',
          },
          role: {
            placeholder: 'Role',
            label: 'Role',
            uid: 'role',
            select: true,
            // options: mapOptions(
            //   userCreationSchema.fields.role._whitelist
            // ),
          },
          school: {
            placeholder: 'Établissement',
            label: 'Établissement',
            uid: 'school',
            type: 'text',
          },

        },
      },
      teacher: {
        recruitment: {
          lastname: {
            placeholder: 'Nom',
            label: 'Nom',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder: 'Prénom',
            label: 'Prénom',
            type: 'text',
            uid: 'firstname',
          },
          gender: {
            placeholder: 'Sexe',
            label: 'Sexe',
            uid: 'gender',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.gender._whitelist
            ),
          },
          phoneNumber: {
            placeholder: 'Téléphone',
            label: 'Téléphone',
            uid: 'phoneNumber',
            type: 'text',
          },
          email: {
            placeholder: 'Email',
            label: 'Email',
            uid: 'email',
            type: 'text',
            grow: 2,
          },
          school: {
            placeholder: 'Établissement',
            label: 'Établissement',
            uid: 'school',
            type: 'text',
          },
          birthDate: {
            placeholder: 'Date de naissance',
            label: 'Date de naissance',
            uid: 'birthDate',
            type: 'date',
          },
          birthPlace: {
            placeholder: 'Lieu de naissance',
            label: 'Lieu de naissance',
            uid: 'birthPlace',
            type: 'text',
          },
          address: {
            placeholder: 'Adresse',
            label: 'Adresse',
            uid: 'address',
            type: 'text',
          },
          maritalStatus: {
            placeholder: 'Situation matrimoniale',
            label: 'Situation matrimoniale',
            uid: 'maritalStatus',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.maritalStatus._whitelist //to be added later
            ),
          },
          academicDegree: {
            placeholder: 'Dernier diplome',
            label: 'Dernier diplome',
            uid: 'academicDegree',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.academicDegree._whitelist // to be added later
            ),
          },
          professionalDegrees: {
            placeholder: 'Diplomes professionnels',
            label: 'Diplomes professionnels',
            uid: 'professionalDegrees',
            select: true,
            options: [
              { value: 'bts', label: 'BTS (Brevet de Technicien Supérieur)' },
              { value: 'dut', label: 'DUT (Diplôme Universitaire de Technologie)' },
              { value: 'licence_pro', label: 'Licence Professionnelle' },
              { value: 'cap', label: 'CAP (Certificat d’Aptitude Professionnelle)' },
              { value: 'bt', label: 'BT (Brevet de Technicien)' },
              { value: 'master_pro', label: 'Master Professionnel' },
              { value: 'ccna', label: 'Cisco Certified Network Associate (CCNA)' },
              { value: 'mcse', label: 'Microsoft Certified Solutions Expert (MCSE)' },
            ],
          },
          disciplines: {
            placeholder: 'Disciplines à enseigner',
            label: 'Disciplines à enseigner',
            uid: 'disciplines',
            select: true,
            options: [
              { value: 'etudes_islamiques', label: 'Études Islamiques (Tafsir, Hadith, Fiqh, Aqida)' },
              { value: 'memorisation_coran', label: 'Mémorisation et Interprétation du Coran (Tahfiz)' },
              { value: 'langue_arabe', label: 'Langue et Littérature Arabe (Nahw, Sarf, Balagha)' },
              { value: 'histoire_islam', label: 'Histoire de l’Islam et des Savants Musulmans' },
              { value: 'spiritualite_soufisme', label: 'Spiritualité et Soufisme (Enseignements de Cheikh Ahmadou Bamba)' },
              { value: 'francais', label: 'Français (Lecture, Grammaire, Rédaction)' },
              { value: 'mathematiques', label: 'Mathématiques (Arithmétique, Algèbre, Géométrie)' },
              { value: 'sciences_naturelles', label: 'Sciences Naturelles (Biologie, Physique, Chimie)' },
              { value: 'geographie', label: 'Géographie (Sénégal, Afrique, Monde)' },
              { value: 'histoire', label: 'Histoire (Histoire du Sénégal et Universelle)' },
              { value: 'anglais', label: 'Anglais (Introduction et Approfondissement)' },
              { value: 'informatique', label: 'Informatique et Technologie (Programmation, Bureautique)' },
              { value: 'education_civique', label: 'Éducation Civique et Morale' },
              { value: 'formation_professionnelle', label: 'Formation Technique et Professionnelle (Couture, Menuiserie, Agriculture)' }
            ]
          },
          language: {
            placeholder: 'Langue parlée',
            label: 'Langue parlée',
            uid: 'language',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.language._whitelist //to be added later
            ),
          },
          subjects: {
            placeholder: 'Matieres enseignées',
            label: 'Matieres enseignées',
            uid: 'subjects',
            select: true,
            options: [
              { value: 'etudes_islamiques', label: 'Études Islamiques (Tafsir, Hadith, Fiqh, Aqida)' },
              { value: 'memorisation_coran', label: 'Mémorisation et Interprétation du Coran (Tahfiz)' },
              { value: 'langue_arabe', label: 'Langue et Littérature Arabe (Nahw, Sarf, Balagha)' },
              { value: 'histoire_islam', label: 'Histoire de l’Islam et des Savants Musulmans' },
              { value: 'spiritualite_soufisme', label: 'Spiritualité et Soufisme (Enseignements de Cheikh Ahmadou Bamba)' },
              { value: 'francais', label: 'Français (Lecture, Grammaire, Rédaction)' },
              { value: 'mathematiques', label: 'Mathématiques (Arithmétique, Algèbre, Géométrie)' },
              { value: 'sciences_naturelles', label: 'Sciences Naturelles (Biologie, Physique, Chimie)' },
              { value: 'geographie', label: 'Géographie (Sénégal, Afrique, Monde)' },
              { value: 'histoire', label: 'Histoire (Histoire du Sénégal et Universelle)' },
              { value: 'anglais', label: 'Anglais (Introduction et Approfondissement)' },
              { value: 'informatique', label: 'Informatique et Technologie (Programmation, Bureautique)' },
              { value: 'education_civique', label: 'Éducation Civique et Morale' },
              { value: 'formation_professionnelle', label: 'Formation Technique et Professionnelle (Couture, Menuiserie, Agriculture)' }
            ]
          },
          contractType: {
            placeholder: 'Type de contrat',
            label: 'Type de contrat',
            uid: 'contractType',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.contractType._whitelist //to be added later
            ),
          },
          level: {
            placeholder: 'Niveau',
            label: 'Niveau',
            uid: 'level',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.level._whitelist //to be added later
            ),
          },
          salary: {
            placeholder: 'Salaire',
            label: 'Salaire',
            uid: 'salary',
            type: 'number',
          },
          contributions: {
            placeholder: 'Contributions',
            label: 'Contributions',
            uid: 'contributions',
            type: 'text',
          },
          registrationNumber: {
            placeholder: 'Numéro d’immatriculation',
            label: 'Numéro d’immatriculation',
            uid: 'registrationNumber',
            type: 'text',
          },
          generation: {
            placeholder: 'Génération',
            label: 'Génération',
            uid: 'generation',
            type: 'text',
          },
          salaryPerHour: {
            placeholder: 'Salaire par heure',
            label: 'Salaire par heure',
            uid: 'salaryPerHour',
            type: 'number',
          },
          hoursNumber: {
            placeholder: 'Nombre d’heures',
            label: 'Nombre d’heures',
            uid: 'hoursNumber',
            type: 'number',
          },
          additionalResponsibilities: {
            placeholder: 'Responsabilités supplémentaires',
            label: 'Responsabilités supplémentaires',
            uid: 'additionalResponsibilities',
            type: 'text',
          },
          countryFrom: {
            placeholder: 'Pays d’origine',
            label: 'Pays d’origine',
            uid: 'countryFrom',
            text: 'text',
          },
          arrivalDate: {
            placeholder: 'Date d’arrivée',
            label: 'Date d’arrivée',
            uid: 'arrivalDate',
            type: 'date',
          },
          previousInstitutes: {
            placeholder: 'Institutes antérieurs',
            label: 'Institutes antérieurs',
            uid: 'previousInstitutes',
            type: 'text',
          },

          //end
        },
      },
      schoolYear: {
        creation: {
          name: {
            placeholder: 'Titre de l’annee scolaire',
            label: 'Titre de l’annee scolaire',
            uid: 'name',
            type: 'text',
          },
          startDate: {
            placeholder: 'Date de debut',
            label: 'Date de debut',
            uid: 'startDate',
            type: 'date',
          },
          endDate: {
            placeholder: 'Date de fin',
            label: 'Date de fin',
            uid: 'endDate',
            type: 'date',
          },
          description: {
            placeholder: 'Description',
            label: 'Description',
            uid: 'description',
            type: 'text',
          },
        },
      },
      //expense
      expense: {
        creation: {
          expenseDate: {
            placeholder: 'Date de l’achat',
            label: 'Date de l’achat',
            uid: 'expenseDate',
            type: 'date',
          },
          amount: {
            placeholder: 'Montant',
            label: 'Montant',
            uid: 'amount',
            type: 'number',
          },
          category: {
            placeholder: 'Categorie',
            label: 'Categorie',
            uid: 'category',
            select: true,
            options: mapOptions(expenseSchema.fields.category._whitelist),


          },
          description: {
            placeholder: 'Description',
            label: 'Description',
            uid: 'description',
            type: 'text',
          },

        }
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
          birthPlaceMessage: 'Date et lieu de naissance',
          classInfoMessage: 'Informations sur la classe',
          personalInfoMessage: 'Informations personnelles',
          tutorInfoMessage: 'Informations sur le tuteur',
        },
        errors: {
          already_exists: 'Cet élève existe déjà',
          problem: 'Une erreur est survenue lors de la sauvegarde',
        },
      },
      enrollment: {
        info: {
          personalInfoMessage: 'Informations personnelles',
          classInfoMessage: 'Informations sur la classe',
          generalInfoMessage: 'Informations generales',
        },
        errors: {
          already_exists: 'Cet élève est déjà inscrit ',
          problem: 'Une erreur est survenue lors de la sauvegarde',
        }

      },
      payment: {
        errors: {
          already_exists: 'Le paiement est deja effectué',
          problem: 'Une erreur est survenue lors du paiement',
        }

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
      user: {
        creation: {
          info: {
            generalInfoMessage: 'Informations generales',
            addressInfoMessage: 'Informations de l’adresse',
            contactInfoMessage: 'Informations de contact',
            additionalInfoMessage: 'Informations additionnelles',
          },
          errors: {
            already_exists: 'Cet utilisateur existe deja',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        },
      },
      schoolYear: {
        creation: {
          info: {
            generalInfoMessage: 'Informations generales',
          },
          errors: {
            already_exists: 'Cette année scolaire existe deja',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        },
      },
      expense: {
        creation: {
          info: {
            generalInfoMessage: 'Informations generales',
          },
          errors: {
            already_exists: 'Cette expense existe deja',
            problem: 'Une erreur est survenue lors de la sauvegarde',
          },
        },
      }
    },
  },
};
