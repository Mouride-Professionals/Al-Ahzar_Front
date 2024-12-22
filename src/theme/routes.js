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
          class: {
            detail: '/dashboard/surveillant/class/%id',
            all: '/dashboard/surveillant/classes',
          },
          students: {
            initial: '/dashboard/students',
            create: '/dashboard/students/create',
          },
          teachers: '/dashboard/teachers',
          schools: {
            all: '/dashboard/schools',
            detail: '/dashboard/schools/%id',
            classes: '/dashboard/schools/%id/classes',
          },
        },
        classes: '/dashboard/classes',
        students: {
          initial: '/dashboard/students',
          create: '/dashboard/students/create',
        },
        teachers: '/dashboard/teachers',
        schools: {
          all: '/dashboard/schools',
          detail: '/dashboard/schools/%id',
          classes: '/dashboard/schools/%id/classes',
        },
      },
    },
    api_route: {
      alazhar: {
        create: {
          student: '/students',
          classroom: '/classes',
          payment: '/payments',
          school: '/schools',
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
            classes: '/schools/%id/classes',
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
