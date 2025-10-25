const {
  classCreationSchema,
  studentRegistrationSchema,
  schoolCreationSchema,
  teacherRecruitmentSchema,
  expenseSchema,
  enrollmentSchema,
} = require('@utils/schemas');
const { ClassTitle } = require('@utils/tools/mappers');

const mapOptions = (array) =>
  Array.from(array).map((option) => ({
    name: ClassTitle(option),
    value: option,
  }));

// Note: Translation keys are provided as strings. Use `useTranslations('components.forms')`
// in consuming components to fetch translations from messages/ar.json or messages/en.json.
module.exports = {
  name: 'Theming forms',
  themeForms: {
    inputs: {
      login: {
        identifier: {
          label: 'forms.inputs.login.identifier.label',
          placeholder: 'vWc4o@example.com',
          type: 'text',
          name: 'identifier',
          uid: 'identifier',
        },
        password: {
          label: 'forms.inputs.login.password.label',
          placeholder: '****************',
          type: 'password',
          name: 'password',
          uid: 'password',
        },
        submit: 'forms.inputs.login.submit',
        specifics: {
          forgotten_password: 'forms.inputs.login.specifics.forgotten_password',
          account: 'forms.inputs.login.specifics.account',
          highlight: 'forms.inputs.login.specifics.highlight',
        },
      },
      change_password: {
        current_password: {
          label: 'forms.inputs.change_password.current_password.label',
          placeholder: '****************',
          type: 'password',
          name: 'currentPassword',
          uid: 'currentPassword',
        },
        new_password: {
          label: 'forms.inputs.change_password.new_password.label',
          placeholder: '****************',
          type: 'password',
          name: 'newPassword',
          uid: 'newPassword',
        },
        confirm_password: {
          label: 'forms.inputs.change_password.confirm_password.label',
          placeholder: '****************',
          type: 'password',
          name: 'confirmPassword',
          uid: 'confirmPassword',
        },
        submit: 'forms.inputs.change_password.submit',
        specifics: {
          current_password:
            'forms.inputs.change_password.specifics.current_password',
          new_password: 'forms.inputs.change_password.specifics.new_password',
          confirm_password:
            'forms.inputs.change_password.specifics.confirm_password',
          highlight: 'forms.inputs.change_password.specifics.highlight',
        },
      },
      forgot_password: {
        email: {
          label: 'forms.inputs.forgot_password.email.label',
          placeholder: 'v-placeholder@example.com',
          type: 'email',
          name: 'email',
          uid: 'email',
        },
        submit: 'forms.inputs.forgot_password.submit',
      },
      reset_password: {
        password: {
          label: 'forms.inputs.reset_password.password.label',
          placeholder: '****************',
          type: 'password',
          name: 'password',
          uid: 'password',
        },
        confirm_password: {
          label: 'forms.inputs.reset_password.confirm_password.label',
          placeholder: '****************',
          type: 'password',
          name: 'confirmPassword',
          uid: 'confirmPassword',
        },
        submit: 'forms.inputs.reset_password.submit',
      },
      student: {
        registration: {
          lastname: {
            placeholder:
              'forms.inputs.student.registration.lastname.placeholder',
            label: 'forms.inputs.student.registration.lastname.label',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder:
              'forms.inputs.student.registration.firstname.placeholder',
            label: 'forms.inputs.student.registration.firstname.label',
            type: 'text',
            uid: 'firstname',
          },
          sex: {
            placeholder: 'forms.inputs.student.registration.sex.placeholder',
            label: 'forms.inputs.student.registration.sex.label',
            uid: 'sex',
            select: true,
            options: mapOptions(
              studentRegistrationSchema.fields.sex._whitelist
            ),
          },
          socialCategory: {
            placeholder:
              'forms.inputs.student.registration.socialCategory.placeholder',
            label: 'forms.inputs.student.registration.socialCategory.label',
            select: true,
            uid: 'socialCategory',
            options: mapOptions(
              studentRegistrationSchema.fields.socialCategory._whitelist
            ),
          },
          date: {
            placeholder: 'forms.inputs.student.registration.date.placeholder',
            label: 'forms.inputs.student.registration.date.label',
            type: 'text',
            uid: 'date',
          },
          month: {
            placeholder: 'forms.inputs.student.registration.month.placeholder',
            label: 'forms.inputs.student.registration.month.label',
            type: 'text',
            uid: 'month',
          },
          year: {
            placeholder: 'forms.inputs.student.registration.year.placeholder',
            label: 'forms.inputs.student.registration.year.label',
            type: 'text',
            uid: 'year',
          },
          birthplace: {
            placeholder:
              'forms.inputs.student.registration.birthplace.placeholder',
            label: 'forms.inputs.student.registration.birthplace.label',
            type: 'text',
            uid: 'birthplace',
          },
          parent_lastname: {
            placeholder:
              'forms.inputs.student.registration.parent_lastname.placeholder',
            label: 'forms.inputs.student.registration.parent_lastname.label',
            type: 'text',
            uid: 'parent_lastname',
          },
          parent_firstname: {
            placeholder:
              'forms.inputs.student.registration.parent_firstname.placeholder',
            label: 'forms.inputs.student.registration.parent_firstname.label',
            type: 'text',
            uid: 'parent_firstname',
          },
          parent_phone: {
            placeholder:
              'forms.inputs.student.registration.parent_phone.placeholder',
            label: 'forms.inputs.student.registration.parent_phone.label',
            type: 'text',
            uid: 'parent_phone',
          },
          level: {
            placeholder: 'forms.inputs.student.registration.level.placeholder',
            label: 'forms.inputs.student.registration.level.label',
            type: 'text',
            uid: 'level',
          },
          classroom: {
            placeholder:
              'forms.inputs.student.registration.classroom.placeholder',
            label: 'forms.inputs.student.registration.classroom.label',
            type: 'text',
            uid: 'classroom',
          },
          class_letter: {
            placeholder:
              'forms.inputs.student.registration.class_letter.placeholder',
            label: 'forms.inputs.student.registration.class_letter.label',
            type: 'text',
            uid: 'class_letter',
          },
        },
        confirm: {
          studentType: {
            placeholder: 'forms.inputs.student.confirm.studentType.placeholder',
            label: 'forms.inputs.student.confirm.studentType.label',
            select: true,
            uid: 'studentType',
            options: [
              {
                name: 'forms.inputs.student.confirm.studentType.options[0].name',
                value: 'Hafiz',
              },
              {
                name: 'forms.inputs.student.confirm.studentType.options[1].name',
                value: 'Ancien Redoublant',
              },
              {
                name: 'forms.inputs.student.confirm.studentType.options[2].name',
                value: 'Ancien Passant',
              },
              {
                name: 'forms.inputs.student.confirm.studentType.options[3].name',
                value: 'Nouveau',
              },
            ],
          },
          socialCategory: {
            placeholder:
              'forms.inputs.student.confirm.socialCategory.placeholder',
            label: 'forms.inputs.student.confirm.socialCategory.label',
            select: true,
            uid: 'socialCategory',
            options: [
              {
                name: 'forms.inputs.student.confirm.socialCategory.options[0].name',
                value: 'Non',
              },
              {
                name: 'forms.inputs.student.confirm.socialCategory.options[1].name',
                value: 'Réduction inscription',
              },
              {
                name: 'forms.inputs.student.confirm.socialCategory.options[2].name',
                value: 'Réduction mensualité',
              },
              {
                name: 'forms.inputs.student.confirm.socialCategory.options[3].name',
                value: 'Tout tarifs offerts',
              },
            ],
          },
          comment: {
            placeholder: 'forms.inputs.student.confirm.comment.placeholder',
            label: 'forms.inputs.student.confirm.comment.label',
            type: 'text',
            uid: 'comment',
          },
          amount: {
            placeholder: 'forms.inputs.student.confirm.amount.placeholder',
            label: 'forms.inputs.student.confirm.amount.label',
            type: 'number',
            uid: 'amount',
          },
          monthOf: {
            placeholder: 'forms.inputs.student.confirm.monthOf.placeholder',
            label: 'forms.inputs.student.confirm.monthOf.label',
            type: 'date',
            uid: 'monthOf',
          },
          paymentDetail: {
            monthlyFee: {
              placeholder:
                'forms.inputs.student.confirm.paymentDetail.monthlyFee.placeholder',
              label:
                'forms.inputs.student.confirm.paymentDetail.monthlyFee.label',
              type: 'number',
              uid: 'monthlyFee',
            },
            enrollmentFee: {
              placeholder:
                'forms.inputs.student.confirm.paymentDetail.enrollmentFee.placeholder',
              label:
                'forms.inputs.student.confirm.paymentDetail.enrollmentFee.label',
              type: 'number',
              uid: 'enrollmentFee',
            },
            blouseFee: {
              placeholder:
                'forms.inputs.student.confirm.paymentDetail.blouseFee.placeholder',
              label:
                'forms.inputs.student.confirm.paymentDetail.blouseFee.label',
              type: 'number',
              uid: 'blouseFee',
            },
            examFee: {
              placeholder:
                'forms.inputs.student.confirm.paymentDetail.examFee.placeholder',
              label: 'forms.inputs.student.confirm.paymentDetail.examFee.label',
              type: 'number',
              uid: 'examFee',
            },
            parentContributionFee: {
              placeholder:
                'forms.inputs.student.confirm.paymentDetail.parentContributionFee.placeholder',
              label:
                'forms.inputs.student.confirm.paymentDetail.parentContributionFee.label',
              type: 'number',
              uid: 'parentContributionFee',
            },
          },
        },
        enrollment: {
          classroom: {
            placeholder:
              'forms.inputs.student.enrollment.classroom.placeholder',
            label: 'forms.inputs.student.enrollment.classroom.label',
            uid: 'class',
            type: 'text',
          },
          socialCategory: {
            placeholder:
              'forms.inputs.student.enrollment.socialCategory.placeholder',
            label: 'forms.inputs.student.enrollment.socialCategory.label',
            select: true,
            uid: 'socialCategory',
            options: mapOptions(
              enrollmentSchema.fields.socialCategory._whitelist
            ),
          },
          enrollmentType: {
            placeholder:
              'forms.inputs.student.enrollment.enrollmentType.placeholder',
            label: 'forms.inputs.student.enrollment.enrollmentType.label',
            select: true,
            uid: 'enrollmentType',
            options: mapOptions(
              enrollmentSchema.fields.enrollmentType._whitelist
            ),
          },
        },
        payment: {
          amount: {
            placeholder: 'forms.inputs.student.payment.amount.placeholder',
            label: 'forms.inputs.student.payment.amount.label',
            type: 'number',
            uid: 'amount',
          },
          monthOf: {
            placeholder: 'forms.inputs.student.payment.monthOf.placeholder',
            label: 'forms.inputs.student.payment.monthOf.label',
            type: 'date',
            uid: 'monthOf',
          },
        },
      },
      class: {
        creation: {
          grade: {
            placeholder: 'forms.inputs.class.creation.grade.placeholder',
            label: 'forms.inputs.class.creation.grade.label',
            uid: 'grade',
            select: true,
            options: mapOptions(classCreationSchema.fields.grade._whitelist),
          },
          level: {
            placeholder: 'forms.inputs.class.creation.level.placeholder',
            label: 'forms.inputs.class.creation.level.label',
            uid: 'level',
            select: true,
            options: mapOptions(classCreationSchema.fields.level._whitelist),
          },
          letter: {
            placeholder: 'forms.inputs.class.creation.letter.placeholder',
            label: 'forms.inputs.class.creation.letter.label',
            uid: 'letter',
            select: true,
            options: mapOptions(classCreationSchema.fields.letter._whitelist),
          },
          description: {
            placeholder: 'forms.inputs.class.creation.description.placeholder',
            label: 'forms.inputs.class.creation.description.label',
            uid: 'description',
            type: 'text',
            maxLength: 50,
          },
        },
      },
      school: {
        creation: {
          name: {
            placeholder: 'forms.inputs.school.creation.name.placeholder',
            label: 'forms.inputs.school.creation.name.label',
            uid: 'name',
            type: 'text',
          },
          address: {
            placeholder: 'forms.inputs.school.creation.address.placeholder',
            label: 'forms.inputs.school.creation.address.label',
            uid: 'address',
            type: 'text',
          },
          city: {
            placeholder: 'forms.inputs.school.creation.city.placeholder',
            label: 'forms.inputs.school.creation.city.label',
            uid: 'city',
            type: 'text',
          },
          email: {
            placeholder: 'forms.inputs.school.creation.email.placeholder',
            label: 'forms.inputs.school.creation.email.label',
            uid: 'email',
            type: 'email',
          },
          postBox: {
            placeholder: 'forms.inputs.school.creation.postBox.placeholder',
            label: 'forms.inputs.school.creation.postBox.label',
            uid: 'postBox',
            type: 'text',
          },
          phone: {
            placeholder: 'forms.inputs.school.creation.phone.placeholder',
            label: 'forms.inputs.school.creation.phone.label',
            uid: 'phone',
            type: 'text',
          },
          banner: {
            placeholder: 'forms.inputs.school.creation.banner.placeholder',
            label: 'forms.inputs.school.creation.banner.label',
            uid: 'banner',
            type: 'file',
          },
          type: {
            placeholder: 'forms.inputs.school.creation.type.placeholder',
            label: 'forms.inputs.school.creation.type.label',
            uid: 'type',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.type._whitelist),
          },
          parentSchool: {
            placeholder:
              'forms.inputs.school.creation.parentSchool.placeholder',
            label: 'forms.inputs.school.creation.parentSchool.label',
            uid: 'parentSchool',
            type: 'text',
          },
          IEF: {
            placeholder: 'forms.inputs.school.creation.IEF.placeholder',
            label: 'forms.inputs.school.creation.IEF.label',
            uid: 'IEF',
            type: 'text',
          },
          responsibleName: {
            placeholder:
              'forms.inputs.school.creation.responsibleName.placeholder',
            label: 'forms.inputs.school.creation.responsibleName.label',
            uid: 'responsibleName',
            type: 'text',
          },
          region: {
            placeholder: 'forms.inputs.school.creation.region.placeholder',
            label: 'forms.inputs.school.creation.region.label',
            uid: 'region',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.region._whitelist),
          },
          department: {
            placeholder: 'forms.inputs.school.creation.department.placeholder',
            label: 'forms.inputs.school.creation.department.label',
            uid: 'department',
            type: 'text',
          },
          commune: {
            placeholder: 'forms.inputs.school.creation.commune.placeholder',
            label: 'forms.inputs.school.creation.commune.label',
            uid: 'commune',
            type: 'text',
          },
          note: {
            placeholder: 'forms.inputs.school.creation.note.placeholder',
            label: 'forms.inputs.school.creation.note.label',
            uid: 'note',
            type: 'text',
          },
          isAlAzharLand: {
            placeholder:
              'forms.inputs.school.creation.isAlAzharLand.placeholder',
            label: 'forms.inputs.school.creation.isAlAzharLand.label',
            uid: 'isAlAzharLand',
            select: true,
            options: [
              {
                name: 'forms.inputs.school.creation.isAlAzharLand.options.yes',
                value: true,
              },
              {
                name: 'forms.inputs.school.creation.isAlAzharLand.options.no',
                value: false,
              },
            ],
          },
          phoneFix: {
            placeholder: 'forms.inputs.school.creation.phoneFix.placeholder',
            label: 'forms.inputs.school.creation.phoneFix.label',
            uid: 'phoneFix',
            type: 'text',
          },
          IA: {
            placeholder: 'forms.inputs.school.creation.IA.placeholder',
            label: 'forms.inputs.school.creation.IA.label',
            uid: 'IA',
            select: true,
            options: mapOptions(schoolCreationSchema.fields.IA._whitelist),
          },
          creationDate: {
            placeholder:
              'forms.inputs.school.creation.creationDate.placeholder',
            label: 'forms.inputs.school.creation.creationDate.label',
            uid: 'creationDate',
            type: 'date',
          },
        },
      },
      user: {
        creation: {
          username: {
            placeholder: 'forms.inputs.user.creation.username.placeholder',
            label: 'forms.inputs.user.creation.username.label',
            uid: 'username',
            type: 'text',
          },
          firstname: {
            placeholder: 'forms.inputs.user.creation.firstname.placeholder',
            label: 'forms.inputs.user.creation.firstname.label',
            uid: 'firstname',
            type: 'text',
          },
          lastname: {
            placeholder: 'forms.inputs.user.creation.lastname.placeholder',
            label: 'forms.inputs.user.creation.lastname.label',
            uid: 'lastname',
            type: 'text',
          },
          email: {
            placeholder: 'forms.inputs.user.creation.email.placeholder',
            label: 'forms.inputs.user.creation.email.label',
            uid: 'email',
            type: 'email',
          },
          password: {
            placeholder: 'forms.inputs.user.creation.password.placeholder',
            label: 'forms.inputs.user.creation.password.label',
            uid: 'password',
            type: 'password',
          },
          confirmPassword: {
            placeholder:
              'forms.inputs.user.creation.confirmPassword.placeholder',
            label: 'forms.inputs.user.creation.confirmPassword.label',
            uid: 'confirmPassword',
            type: 'password',
          },
          role: {
            placeholder: 'forms.inputs.user.creation.role.placeholder',
            label: 'forms.inputs.user.creation.role.label',
            uid: 'role',
            select: true,
          },
          school: {
            placeholder: 'forms.inputs.user.creation.school.placeholder',
            label: 'forms.inputs.user.creation.school.label',
            uid: 'school',
            type: 'text',
          },
        },
      },
      teacher: {
        recruitment: {
          lastname: {
            placeholder:
              'forms.inputs.teacher.recruitment.lastname.placeholder',
            label: 'forms.inputs.teacher.recruitment.lastname.label',
            type: 'text',
            uid: 'lastname',
          },
          firstname: {
            placeholder:
              'forms.inputs.teacher.recruitment.firstname.placeholder',
            label: 'forms.inputs.teacher.recruitment.firstname.label',
            type: 'text',
            uid: 'firstname',
          },
          gender: {
            placeholder: 'forms.inputs.teacher.recruitment.gender.placeholder',
            label: 'forms.inputs.teacher.recruitment.gender.label',
            uid: 'gender',
            select: true,
            options: [
              {
                name: 'forms.inputs.teacher.recruitment.gender.options.male',
                value: 'Homme',
              },
              {
                name: 'forms.inputs.teacher.recruitment.gender.options.female',
                value: 'Femme',
              },
            ],
          },
          phoneNumber: {
            placeholder:
              'forms.inputs.teacher.recruitment.phoneNumber.placeholder',
            label: 'forms.inputs.teacher.recruitment.phoneNumber.label',
            uid: 'phoneNumber',
            type: 'text',
          },
          email: {
            placeholder: 'forms.inputs.teacher.recruitment.email.placeholder',
            label: 'forms.inputs.teacher.recruitment.email.label',
            uid: 'email',
            type: 'text',
            grow: 2,
          },
          school: {
            placeholder: 'forms.inputs.teacher.recruitment.school.placeholder',
            label: 'forms.inputs.teacher.recruitment.school.label',
            uid: 'school',
            type: 'text',
          },
          birthDate: {
            placeholder:
              'forms.inputs.teacher.recruitment.birthDate.placeholder',
            label: 'forms.inputs.teacher.recruitment.birthDate.label',
            uid: 'birthDate',
            type: 'date',
          },
          birthPlace: {
            placeholder:
              'forms.inputs.teacher.recruitment.birthPlace.placeholder',
            label: 'forms.inputs.teacher.recruitment.birthPlace.label',
            uid: 'birthPlace',
            type: 'text',
          },
          address: {
            placeholder: 'forms.inputs.teacher.recruitment.address.placeholder',
            label: 'forms.inputs.teacher.recruitment.address.label',
            uid: 'address',
            type: 'text',
          },
          maritalStatus: {
            placeholder:
              'forms.inputs.teacher.recruitment.maritalStatus.placeholder',
            label: 'forms.inputs.teacher.recruitment.maritalStatus.label',
            uid: 'maritalStatus',
            select: true,
            options: [
              {
                value: 'Célibataire',
                name: 'forms.inputs.teacher.recruitment.maritalStatus.options.0.label',
              },
              {
                value: 'Marié(e)',
                name: 'forms.inputs.teacher.recruitment.maritalStatus.options.1.label',
              },
              {
                value: 'Divorçé(e)',
                name: 'forms.inputs.teacher.recruitment.maritalStatus.options.2.label',
              },
              {
                value: 'Veuf(ve)',
                name: 'forms.inputs.teacher.recruitment.maritalStatus.options.3.label',
              },
            ],
          },
          academicDegree: {
            placeholder:
              'forms.inputs.teacher.recruitment.academicDegree.placeholder',
            label: 'forms.inputs.teacher.recruitment.academicDegree.label',
            uid: 'academicDegree',
            select: true,
            options: [
              // "Baccalauréat", "Licence", "Master", "Doctorat"
              {
                value: 'Baccalauréat',
                label:
                  'forms.inputs.teacher.recruitment.academicDegree.options.0.label',
              },
              {
                value: 'Licence',
                label:
                  'forms.inputs.teacher.recruitment.academicDegree.options.1.label',
              },
              {
                value: 'Master',
                label:
                  'forms.inputs.teacher.recruitment.academicDegree.options.2.label',
              },
              {
                value: 'Doctorat',
                label:
                  'forms.inputs.teacher.recruitment.academicDegree.options.3.label',
              },
              {
                value: 'Autre',
                label:
                  'forms.inputs.teacher.recruitment.academicDegree.options.4.label',
              },
            ],
          },
          professionalDegrees: {
            placeholder:
              'forms.inputs.teacher.recruitment.professionalDegrees.placeholder',
            label: 'forms.inputs.teacher.recruitment.professionalDegrees.label',
            uid: 'professionalDegrees',
            select: true,
            isMulti: true,
            options: [
              {
                value: 'bts',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.0.label',
              },
              {
                value: 'dut',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.1.label',
              },
              {
                value: 'licence_pro',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.2.label',
              },
              {
                value: 'cap',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.3.label',
              },
              {
                value: 'bt',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.4.label',
              },
              {
                value: 'master_pro',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.5.label',
              },
              {
                value: 'ccna',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.6.label',
              },
              {
                value: 'mcse',
                label:
                  'forms.inputs.teacher.recruitment.professionalDegrees.options.7.label',
              },
            ],
          },
          disciplines: {
            placeholder:
              'forms.inputs.teacher.recruitment.disciplines.placeholder',
            label: 'forms.inputs.teacher.recruitment.disciplines.label',
            uid: 'disciplines',
            select: true,
            isMulti: true,
            options: [
              {
                value: 'etudes_islamiques',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.0.label',
              },
              {
                value: 'memorisation_coran',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.1.label',
              },
              {
                value: 'langue_arabe',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.2.label',
              },
              {
                value: 'histoire_islam',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.3.label',
              },
              {
                value: 'spiritualite_soufisme',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.4.label',
              },
              {
                value: 'francais',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.5.label',
              },
              {
                value: 'mathematiques',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.6.label',
              },
              {
                value: 'sciences_naturelles',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.7.label',
              },
              {
                value: 'geographie',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.8.label',
              },
              {
                value: 'histoire',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.9.label',
              },
              {
                value: 'anglais',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.10.label',
              },
              {
                value: 'informatique',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.11.label',
              },
              {
                value: 'education_civique',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.12.label',
              },
              {
                value: 'formation_professionnelle',
                label:
                  'forms.inputs.teacher.recruitment.disciplines.options.13.label',
              },
            ],
          },
          language: {
            placeholder:
              'forms.inputs.teacher.recruitment.language.placeholder',
            label: 'forms.inputs.teacher.recruitment.language.label',
            uid: 'language',
            select: true,
            options: mapOptions(
              teacherRecruitmentSchema.fields.language._whitelist
            ),
          },
          subjects: {
            placeholder:
              'forms.inputs.teacher.recruitment.subjects.placeholder',
            label: 'forms.inputs.teacher.recruitment.subjects.label',
            uid: 'subjects',
            select: true,
            isMulti: true,
            options: [
              {
                value: 'etudes_islamiques',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.0.label',
              },
              {
                value: 'memorisation_coran',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.1.label',
              },
              {
                value: 'langue_arabe',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.2.label',
              },
              {
                value: 'histoire_islam',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.3.label',
              },
              {
                value: 'spiritualite_soufisme',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.4.label',
              },
              {
                value: 'francais',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.5.label',
              },
              {
                value: 'mathematiques',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.6.label',
              },
              {
                value: 'sciences_naturelles',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.7.label',
              },
              {
                value: 'geographie',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.8.label',
              },
              {
                value: 'histoire',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.9.label',
              },
              {
                value: 'anglais',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.10.label',
              },
              {
                value: 'informatique',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.11.label',
              },
              {
                value: 'education_civique',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.12.label',
              },
              {
                value: 'formation_professionnelle',
                label:
                  'forms.inputs.teacher.recruitment.subjects.options.13.label',
              },
            ],
          },
          contractType: {
            placeholder:
              'forms.inputs.teacher.recruitment.contractType.placeholder',
            label: 'forms.inputs.teacher.recruitment.contractType.label',
            uid: 'contractType',
            select: true,
            options: [
              {
                value: 'Disponible',
                name: 'forms.inputs.teacher.recruitment.contractType.options.0.label',
              },
              {
                value: 'Temps Partiel',
                name: 'forms.inputs.teacher.recruitment.contractType.options.1.label',
              },
              {
                value: 'Etranger',
                name: 'forms.inputs.teacher.recruitment.contractType.options.2.label',
              },
              {
                value: 'Employé Etat',
                name: 'forms.inputs.teacher.recruitment.contractType.options.3.label',
              },
            ],
          },
          level: {
            placeholder: 'forms.inputs.teacher.recruitment.level.placeholder',
            label: 'forms.inputs.teacher.recruitment.level.label',
            uid: 'level',
            select: true,
            options: [
              {
                name: 'forms.inputs.teacher.recruitment.level.options.0.label',
                value: 'Primaire',
              },
              {
                name: 'forms.inputs.teacher.recruitment.level.options.1.label',
                value: 'Moyen',
              },
              {
                name: 'forms.inputs.teacher.recruitment.level.options.2.label',
                value: 'Secondaire',
              },
            ],
          },
          salary: {
            placeholder: 'forms.inputs.teacher.recruitment.salary.placeholder',
            label: 'forms.inputs.teacher.recruitment.salary.label',
            uid: 'salary',
            type: 'number',
          },
          registrationNumber: {
            placeholder:
              'forms.inputs.teacher.recruitment.registrationNumber.placeholder',
            label: 'forms.inputs.teacher.recruitment.registrationNumber.label',
            uid: 'registrationNumber',
            type: 'text',
          },
          generation: {
            placeholder:
              'forms.inputs.teacher.recruitment.generation.placeholder',
            label: 'forms.inputs.teacher.recruitment.generation.label',
            uid: 'generation',
            type: 'text',
          },
          salaryPerHour: {
            placeholder:
              'forms.inputs.teacher.recruitment.salaryPerHour.placeholder',
            label: 'forms.inputs.teacher.recruitment.salaryPerHour.label',
            uid: 'salaryPerHour',
            type: 'number',
          },
          hoursNumber: {
            placeholder:
              'forms.inputs.teacher.recruitment.hoursNumber.placeholder',
            label: 'forms.inputs.teacher.recruitment.hoursNumber.label',
            uid: 'hoursNumber',
            type: 'number',
          },
          additionalResponsibilities: {
            placeholder:
              'forms.inputs.teacher.recruitment.additionalResponsibilities.placeholder',
            label:
              'forms.inputs.teacher.recruitment.additionalResponsibilities.label',
            uid: 'additionalResponsibilities',
            type: 'text',
          },
          countryFrom: {
            placeholder:
              'forms.inputs.teacher.recruitment.countryFrom.placeholder',
            label: 'forms.inputs.teacher.recruitment.countryFrom.label',
            uid: 'countryFrom',
            type: 'text',
          },
          arrivalDate: {
            placeholder:
              'forms.inputs.teacher.recruitment.arrivalDate.placeholder',
            label: 'forms.inputs.teacher.recruitment.arrivalDate.label',
            uid: 'arrivalDate',
            type: 'date',
          },
          previousInstitutes: {
            placeholder:
              'forms.inputs.teacher.recruitment.previousInstitutes.placeholder',
            label: 'forms.inputs.teacher.recruitment.previousInstitutes.label',
            uid: 'previousInstitutes',
            type: 'text',
          },
        },
      },
      schoolYear: {
        creation: {
          name: {
            placeholder: 'forms.inputs.schoolYear.creation.name.placeholder',
            label: 'forms.inputs.schoolYear.creation.name.label',
            uid: 'name',
            type: 'text',
          },
          startDate: {
            placeholder:
              'forms.inputs.schoolYear.creation.startDate.placeholder',
            label: 'forms.inputs.schoolYear.creation.startDate.label',
            uid: 'startDate',
            type: 'date',
          },
          endDate: {
            placeholder: 'forms.inputs.schoolYear.creation.endDate.placeholder',
            label: 'forms.inputs.schoolYear.creation.endDate.label',
            uid: 'endDate',
            type: 'date',
          },
          description: {
            placeholder:
              'forms.inputs.schoolYear.creation.description.placeholder',
            label: 'forms.inputs.schoolYear.creation.description.label',
            uid: 'description',
            type: 'text',
          },
        },
      },
      expense: {
        creation: {
          expenseDate: {
            placeholder:
              'forms.inputs.expense.creation.expenseDate.placeholder',
            label: 'forms.inputs.expense.creation.expenseDate.label',
            uid: 'expenseDate',
            type: 'date',
          },
          amount: {
            placeholder: 'forms.inputs.expense.creation.amount.placeholder',
            label: 'forms.inputs.expense.creation.amount.label',
            uid: 'amount',
            type: 'number',
          },
          category: {
            placeholder: 'forms.inputs.expense.creation.category.placeholder',
            label: 'forms.inputs.expense.creation.category.label',
            uid: 'category',
            select: true,
            options: mapOptions(expenseSchema.fields.category._whitelist),
          },
          description: {
            placeholder:
              'forms.inputs.expense.creation.description.placeholder',
            label: 'forms.inputs.expense.creation.description.label',
            uid: 'description',
            type: 'text',
          },
        },
      },
    },
    messages: {
      login: {
        errors: {
          not_authorized: 'forms.messages.login.errors.not_authorized',
          problem: 'forms.messages.login.errors.problem',
        },
      },
      registration: {
        info: {
          birthPlaceMessage:
            'forms.messages.registration.info.birthPlaceMessage',
          classInfoMessage: 'forms.messages.registration.info.classInfoMessage',
          personalInfoMessage:
            'forms.messages.registration.info.personalInfoMessage',
          tutorInfoMessage: 'forms.messages.registration.info.tutorInfoMessage',
        },
        errors: {
          already_exists: 'forms.messages.registration.errors.already_exists',
          problem: 'forms.messages.registration.errors.problem',
        },
      },
      enrollment: {
        info: {
          personalInfoMessage:
            'forms.messages.enrollment.info.personalInfoMessage',
          classInfoMessage: 'forms.messages.enrollment.info.classInfoMessage',
          generalInfoMessage:
            'forms.messages.enrollment.info.generalInfoMessage',
        },
        errors: {
          already_exists: 'forms.messages.enrollment.errors.already_exists',
          problem: 'forms.messages.enrollment.errors.problem',
        },
      },
      confirmation: {
        info: {
          studentInfoMessage:
            'forms.messages.confirmation.info.studentInfoMessage',
          paymentDetailsMessage:
            'forms.messages.confirmation.info.paymentDetailsMessage',
        },
        labels: {
          name: 'forms.messages.confirmation.labels.name',
          type: 'forms.messages.confirmation.labels.type',
          class: 'forms.messages.confirmation.labels.class',
          cancel: 'forms.messages.confirmation.labels.cancel',
          validatePayment: 'forms.messages.confirmation.labels.validatePayment',
        },
        errors: {
          problem: 'forms.messages.confirmation.errors.problem',
        },
      },
      payment: {
        errors: {
          already_exists: 'forms.messages.payment.errors.already_exists',
          problem: 'forms.messages.payment.errors.problem',
        },
        cancellation: {
          errors: {
            not_found: 'forms.messages.payment.cancellation.errors.not_found',
            already_cancelled:
              'forms.messages.payment.cancellation.errors.already_cancelled',
            problem: 'forms.messages.payment.cancellation.errors.problem',
          },
        },
      },
      school: {
        creation: {
          info: {
            generalInfoMessage:
              'forms.messages.school.creation.info.generalInfoMessage',
            addressInfoMessage:
              'forms.messages.school.creation.info.addressInfoMessage',
            contactInfoMessage:
              'forms.messages.school.creation.info.contactInfoMessage',
            additionalInfoMessage:
              'forms.messages.school.creation.info.additionalInfoMessage',
          },
          errors: {
            already_exists:
              'forms.messages.school.creation.errors.already_exists',
            problem: 'forms.messages.school.creation.errors.problem',
          },
        },
      },
      teacher: {
        recruitment: {
          info: {
            personalInfoMessage:
              'forms.messages.teacher.recruitment.info.personalInfoMessage',
            contactInfoMessage:
              'forms.messages.teacher.recruitment.info.contactInfoMessage',
            contractInfoMessage:
              'forms.messages.teacher.recruitment.info.contractInfoMessage',
            additionalInfoMessage:
              'forms.messages.teacher.recruitment.info.additionalInfoMessage',
          },
          errors: {
            already_exists:
              'forms.messages.teacher.recruitment.errors.already_exists',
            problem: 'forms.messages.teacher.recruitment.errors.problem',
          },
        },
      },
      user: {
        creation: {
          info: {
            generalInfoMessage:
              'forms.messages.user.creation.info.generalInfoMessage',
            addressInfoMessage:
              'forms.messages.user.creation.info.addressInfoMessage',
            contactInfoMessage:
              'forms.messages.user.creation.info.contactInfoMessage',
            additionalInfoMessage:
              'forms.messages.user.creation.info.additionalInfoMessage',
          },
          errors: {
            already_exists:
              'forms.messages.user.creation.errors.already_exists',
            problem: 'forms.messages.user.creation.errors.problem',
          },
        },
      },
      schoolYear: {
        creation: {
          info: {
            generalInfoMessage:
              'forms.messages.schoolYear.creation.info.generalInfoMessage',
          },
          errors: {
            already_exists:
              'forms.messages.schoolYear.creation.errors.already_exists',
            problem: 'forms.messages.schoolYear.creation.errors.problem',
          },
        },
      },
      expense: {
        creation: {
          info: {
            generalInfoMessage:
              'forms.messages.expense.creation.info.generalInfoMessage',
          },
          errors: {
            already_exists:
              'forms.messages.expense.creation.errors.already_exists',
            problem: 'forms.messages.expense.creation.errors.problem',
          },
        },
      },
    },
  },
};
