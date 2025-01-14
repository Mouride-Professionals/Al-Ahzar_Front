export const name = 'Theming Routes File';
export const themeRoutes = {
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
          confirm: '/dashboard/cashier/students/confirm/registration/{student}',
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
      //to be removed
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
      //to be removed
      classes: '/dashboard/classes',
      //to be removed
      students: {
        initial: '/dashboard/students',
        create: '/dashboard/students/create',
      },
      direction: {
        initial: '/dashboard/direction',
        schools: {
          all: '/dashboard/direction/schools',
          detail: '/dashboard//direction/schools/%id',
          create: '/dashboard/direction/schools/create',
          edit: '/dashboard/direction/schools/%id/edit',
          classes: '/dashboard/direction/schools/%id/classes',
        },
        teachers: {
          all: '/dashboard/direction/teachers',
          detail: '/dashboard/direction/teachers/%id',
          create: '/dashboard/direction/teachers/create',
          edit: '/dashboard/direction/teachers/%id/edit',
        },
        students: {
          initial: '/dashboard/direction/students',
          create: '/dashboard/direction/students/create',
        },
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
        teacher: '/teachers',
      },
      get: {
        classes: '/classes',
        class: {
          all: '/classes?populate=eleves.payments&pageSize=100',
          detail: '/classes/%id?populate=eleves,eleves.payments,etablissement',
        },
        students: {
          all: '/students?populate=classe,payments',
          detail: '/students/%id?populate=classe,payments',
        },
        teachers: {
          detail: '/teachers/%id',
          all: '/teachers',
        },
        schools: {
          detail: '/schools/%id',
          all: '/schools',
          classes: '/schools/%id/classes',
        },
        me: '/users/me?populate=*',
      },
      update: {
        student: '/students/%id',
        school: '/schools/%id',
        teacher: '/teachers/%id',
      },
    },
  },
};
