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
    },
    menu: {
      home: 'Accueil',
      classes: 'Classes',
      students: {
        initial: 'Elèves',
        create: 'Inscrire un élève',
      },
      teachers: 'Enseignants',
      schools: 'Établissements',
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
    },
    classList: {
      grade: 'Classes de primares',
      intermediate: 'Classes de secondaires 1er cycle',
      upperIntermediate: 'Classes de secondaires 2ème cycle',
      create: 'Créer une classe',
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
      },
    },
  },
};
