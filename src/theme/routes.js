
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
        finance: {
          initial: '/dashboard/cashier/finance',
          // detail: '/dashboard/cashier/classes/%id',
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
          resubscribe: '/dashboard/surveillant/students/{student}/resubscribe',

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
        users: {
          all: '/dashboard/direction/users',
          detail: '/dashboard/direction/users/%id',
          create: '/dashboard/direction/users/create',
          edit: '/dashboard/direction/users/%id/edit',
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
        finance: {
          initial: '/dashboard/direction/finance',
          // detail: '/dashboard/cashier/classes/%id',
        },

      },
    },
  },
  api_route: {
    alazhar: {
      create: {
        student: '/students',
        enrollment: '/enrollments',
        classroom: '/classes',
        payment: '/payments',
        school: '/schools',
        teacher: '/teachers',
        school_year: '/school-years',
        user: '/users',
      },
      get: {
        classes: {
          all: `/classes?filters[school][id][$eq]=%schoolId&filters[schoolYear][id][$eq]=%activeSchoolYear&populate=enrollments.student`,
          allWithoutSchoolId: `/classes?filters[schoolYear][id][$eq]=%activeSchoolYear&populate=enrollments.student`,
          detail: `/classes/%id?populate=enrollments.student,enrollments.payments,school,enrollments.schoolYear`,
        },

        students: {
          allWithoutSchoolYear: `/enrollments?filters[class][school][id][$eq]=%schoolId&filters[class][schoolYear][id][$lt]=%activeSchoolYear&sort=enrollmentDate:desc&populate=student,payments,class,schoolYear`,
          all: `/enrollments?filters[schoolYear][id][$eq]=%activeSchoolYear&filters[class][school][id][$eq]=%schoolId&sort=enrollmentDate:desc&populate=student,payments,class,schoolYear`,
          allWithoutSchoolId: `/enrollments?filters[schoolYear][id][$eq]=%activeSchoolYear&sort=enrollmentDate:desc&populate=student,payments,class,schoolYear`,
          detail: '/enrollments/%id?populate=class,student,payments,schoolYear',
        },
        teachers: {
          detail: '/teachers/%id',
          all: `/teachers`,
        },
        users: {
          detail: '/users/%id',
          all: `/users`,
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
        finance: {
          all: '/payments?filters[enrollment][schoolYear][id][$eq]=%activeSchoolYear&filters[enrollment][class][school][id][$eq]=%schoolId&sort=createdAt:desc&populate=enrollment.student,payment_detail',
          stats: '/payments/stats?filters[schoolYear][id][$eq]=%activeSchoolYear&filters[school][id][$eq]=%schoolId',
          statsWithoutSchoolId: '/payments/stats?filters[schoolYear][id][$eq]=%activeSchoolYear',
        },
        me: '/users/me?populate=*',
      },
      update: {
        student: '/students/%id',
        school: '/schools/%id',
        teacher: '/teachers/%id',
        school_year: '/school-years/%id',
        user: '/users/%id',

      },
    },
  },
};
