module.exports = {
  name: 'Theming Routes File',
  themeRoutes: {
    page_route: {
      initial: '/',
      auth: {
        initial: '/user/auth',
        register: '/user/auth/register',
      },
      dashboard: {
        initial: '/dashboard',
        cashier: {
          class: {
            all: '/dashboard/cashier/classes',
            detail: '/dashboard/cashier/class/%id',
          },
          classes: '/dashboard/cashier/classes',
          students: {
            initial: '/dashboard/cashier/students',
            confirm:
              '/dashboard/cashier/students/confirm/registration/{student}',
          },
        },
        surveillant: {
          classes: '/dashboard/surveillant/classes',
          class: {
            detail: '/dashboard/surveillant/class/%id',
            all: '/dashboard/surveillant/classes',
          },
          students: {
            initial: '/dashboard/surveillant/students',
            create: '/dashboard/surveillant/students/create',
          },
        },
        all_access: {
          classes: '/dashboard/classes',
          students: {
            initial: '/dashboard/students',
            create: '/dashboard/students/create',
          },
          teachers: '/dashboard/teachers',
        },
        classes: '/dashboard/classes',
        students: {
          initial: '/dashboard/students',
          create: '/dashboard/students/create',
        },
        teachers: '/dashboard/teachers',
      },
    },
    api_route: {
      alazhar: {
        create: {
          student: '/students',
          classroom: '/classes',
          payment: '/payments',
        },
        get: {
          classes: '/classes',
          class: {
            all: '/classes?populate=eleves.payments&pageSize=100',
            detail:
              '/classes/%id?populate=eleves,eleves.payments,etablissement',
          },
          students: {
            all: '/students?populate=classe,payments',
            detail: '/students/%id?populate=classe,payments',
          },
          teachers: '/teachers',
          schools: {
            detail: '/schools/%id',
            all: '/schools',
          },
          me: '/users/me?populate=*',
        },
        update: {
          student: '/students/%id',
        },
      },
    },
  },
};
