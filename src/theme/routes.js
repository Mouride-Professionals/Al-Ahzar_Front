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
        initial: '/dashboard/cashier',
        classes: {
          all: '/dashboard/cashier/classes',
          detail: '/dashboard/cashier/classes/%id',
        },
        students: {
          initial: '/dashboard/cashier/students',
          confirm: '/dashboard/cashier/students/confirm/registration/{student}',
        },
      },
      surveillant: {
        initial: '/dashboard/surveillant',
        classes: {
          detail: '/dashboard/surveillant/classes/%id',
          all: '/dashboard/surveillant/classes',
        },
        students: {
          initial: '/dashboard/surveillant/students',
          create: '/dashboard/surveillant/students/create',
        },
      },
      direction: {
        initial: '/dashboard/direction',
        schools: {
          all: '/dashboard/direction/schools',
          detail: '/dashboard//direction/schools/%id',
          create: '/dashboard/direction/schools/create',
          edit: '/dashboard/direction/schools/%id/edit',
          classes: {
            all: '/dashboard/direction/schools/%id/classes',
            detail: '/dashboard/direction/schools/%id/classes/%classId',
            create: '/dashboard/direction/schools/%id/classes/create',
            edit: '/dashboard/direction/schools/%id/classes/%classId/edit',
          },
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
        school_years: {
          all: '/dashboard/direction/school_years',
          detail: '/dashboard/direction/school_years/%id',
          create: '/dashboard/direction/school_years/create',
          edit: '/dashboard/direction/school_years/%id/edit',

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
        school_year: '/school-years',
      },
      get: {
        classes: '/classes',
        class: {
          // all: `/classes?filters[schoolYear][id][$eq]=%activeSchoolYear&populate=eleves.payments&pageSize=100`,
          all: `/classes?filters[schoolYear][isActive][$eq]=true&populate=eleves.payments&pageSize=100`,
          detail: `/classes/%id?filters[schoolYear][isActive][$eq]=true&populate=eleves,eleves.payments,etablissement`,
          // detail: `/classes/%id?filters[schoolYear][id][$eq]=%activeSchoolYear&populate=eleves,eleves.payments,etablissement`,
        },
        students: {
          all: `/students?filters[classe][schoolYear][isActive][$eq]=true&populate=classe,payments`,
          // all: `/students?filters[classe][schoolYear][id][$eq]=%activeSchoolYear&populate=classe,payments`,
          detail: '/students/%id?populate=classe,payments',
        },
        teachers: {
          detail: '/teachers/%id',
          all: `/teachers`,
        },
        schools: {
          detail: '/schools/%id',
          all: '/schools',
          classes: '/schools/%id/classes',
        },
        school_years: {
          all: '/school-years',
          detail: '/school-years/%id',
        },
        me: '/users/me?populate=*',
      },
      update: {
        student: '/students/%id',
        school: '/schools/%id',
        teacher: '/teachers/%id',
        school_year: '/school-years/%id',

      },
    },
  },
};
