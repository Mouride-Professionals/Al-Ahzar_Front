const { use } = require("react");

module.exports = {
  name: 'Components Messages',
  themeComponentsMessages: {
    authentication: {
      login: {
        heading: {
          title: 'Connectez-vous',
          subtitle:
            'Entrez vore identifiant et votre mot de passe pour vous connecter à votre compte',
        },
        specifics: {
          forgotten_password: 'Forgot password?',
          account: "Don't have an account? Sign up",
          highlight: 'Sign up',
        },
      },
      register: {
        heading: {
          title: 'Hey there 👋',
          subtitle: "Please enter your creds, we'll take care of the rest 😊",
        },
        specifics: {
          forgotten_password: 'Forgot password?',
          account: 'Already have an account? Sign in',
          highlight: 'Sign in',
        },
      },
    },
    cards: {
      class: {
        students: '%number élèves',
      },
      student: {
        confirmation: "Confirmation d'inscription",
        registration: "Formulaire d'inscription",
        another_student: 'Inscrire un autre élève',
        info: {
          success: 'Inscription initiée',
          message:
            "Vous avez initié l'inscription de l'élève. Le service financier se chargera de la dernière étape du processus d'inscription.",
          confirmation:
            "Vous avez clôturé l'inscription de l'élève %firstname %lastname en classe de %classname. Vous pouvez trouver la fiche de l'élève sur son profil.",
          classList: 'Liste des classes',
        },
      },
      school: {
        creation: 'Formulaire de création',
        edit: 'Formulaire de modification',
        another_school: 'Créer un autre établissement',
        info: {
          success: 'Création reussie',
          message: "Vous avez créé l'établissement.\n Vous pouvez maintenant créer des classes et inscrire des élèves.",
          publishing:
            " Vous avez créé l'établissement .\n Vous pouvez maintenant créer des classes et inscrire des élèves.",
          classList: 'Liste des classes',
        },
      },
      user: {
        creation: 'Formulaire de création',
        edit: 'Formulaire de modification',
        another_user: 'Créer un autre utilisateur',
        info: {
          success: 'Création reussie',
          message: 'Vous avez créé un nouvel utilisateur.',
          publishing:
            "Vous avez publié l'utilisateur %firstname %lastname. Vous pouvez maintenant lui affecter un rôle.",
        }
      },
      teacher: {
        affectation: "Affectation d'enseignant",
        recruitment: 'Formulaire de recrutement',
        another_teacher: 'Recruter un autre enseignant',
        info: {
          success: 'Inscription reussie',
          message:
            'Vous avez recruté un nouveau enseignant. Vous pouvez maintenant lui affecter  dans une école.',
          affectation:
            "Vous avez affecté l'enseignant %firstname %lastname dans l'école %name.",
        },
      },
      school_year: {
        creation: 'Formulaire de création',
        edit: 'Formulaire de modification',
        info: {
          success: 'Création reussie',
          message:
            "Vous avez créé l'année scolaire.",
        },
      },
    },
    menu: {
      home: 'Accueil',
      classes: 'Classes',
      finance: 'Finance',
      students: {
        initial: 'Elèves',
        create: 'Inscrire un élève',
      },
      users: 'Administration',
      teachers: 'Enseignants',
      schools: 'Établissements',
      school_years: 'Années',
    },
    layout: {
      header: {},
      footer: {},
      dashboard: {},
      breadcrumb: {
        initial: 'Al Azhar',
        classes: 'Classes',
        schools: 'Al Azhar',
      },
    },
    dataset: {
      students: {
        title: 'Liste des élèves',
        cta: {
          filter: '',
          export: '',
        },
      },
      schools: {
        title: 'Liste des écoles',
        cta: {
          filter: '',
          export: '',
        },
      },
      teachers: {
        title: 'Liste des enseignants',
        cta: {
          filter: '',
          export: '',
        },
      },
      users: {
        title: 'Liste des utilisateurs',
        cta: {
          filter: '',
          export: '',
        },
      },
    },
    classList: {
      grade: 'Classes de primares',
      intermediate: 'Classes de secondaires 1er cycle',
      upperIntermediate: 'Classes de secondaires 2ème cycle',
      create: 'Créer une classe',
      noClasses: 'Aucune classe.\n Veuillez créez une classe pour commencer.',
    },
    schoolList: {
      title: 'Liste des écoles',
      createSchool: 'Créer une école',
      viewDetails: 'Fiche de l école',
      cta: {
        filter: '',
        export: '',
      },
    },
    constants: {
      dataset: {
        students: {
          students: 'Élève',
          _class: 'Classe',
          parents: 'Parent',
          phone: 'Tél parent',
          registration: 'Inscription',
          current_month: 'Mois en cours',
          paid: 'Payé',
          not_paid: 'Impayé',
        },
        schools: {
          name: 'Nom',
          address: 'Adresse',
          email: 'Email',
          phone: 'Téléphone',
          type: 'Type',
          IEF: 'IEF',
          responsible: 'Directeur',
          parentSchool: 'Établissement parent',
        },
        teachers: {
          complete_name: 'Prénom et Nom',
          email: 'Email',
          phoneNumber: 'Téléphone',
          gender: 'Genre',
          school: 'Établissement',
        },
      },
    },
  },
};
