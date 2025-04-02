import { persistPayment } from '@services/payment';
import {
  createClassroom,
  createSchool,
  getSchool,
  updateSchool,
} from '@services/school';
import { createSchoolYear, updateSchoolYear } from '@services/school_year';
import { confirmStudent, createPayment, createStudent, enrollStudent } from '@services/student';
import { createTeacher, updateTeacher } from '@services/teacher';
import { createUser } from '@services/user';
import { forms, routes } from '@theme';
import { mapMonthCreationBody } from '@utils/mappers/payment';
import { mapSchoolCreationBody } from '@utils/mappers/school';
import { mapSchoolYearCreationBody } from '@utils/mappers/school_year';
import {
  mapPaymentBody,
  mapStudentConfirmationBody,
  mapStudentCreationBody,
  mapStudentEnrollmentBody
} from '@utils/mappers/student';
import { mapTeacherCreationBody } from '@utils/mappers/teacher';
import { mapUserCreationBody } from '@utils/mappers/user';
import { mapClassBody } from '@utils/tools/mappers';
import { signIn } from 'next-auth/react';
import customRedirect from 'src/pages/api/auth/redirect';

/**
 *
 * @param {Object} data
 * @param {Function} setSubmitting
 * @param {Function} setFieldError
 * @param {route} redirectOnSuccess
 * @returns
 */
export const loginFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  redirectOnSuccess = '/',
}) => {
  const { identifier, password } = data;

  try {
    const res = await signIn('strapi', {
      username: identifier,
      password,
      callbackUrl: `${window.location.origin}${routes.page_route.auth.initial}`,
      redirect: false,
    });


    if (!res || res.error) {
      setSubmitting(false);
      setFieldError(
        'authentication',
        forms.messages.login.errors.not_authorized
      );
      return;
    }

    customRedirect();
  } catch (error) {
    console.log(error);
    setSubmitting(false);
  }
};

export const registrationFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  try {
    const payload = mapStudentCreationBody({ data });

    const student = await createStudent({ payload, token });
    // Enroll student
    const enrollmentPayload = mapStudentEnrollmentBody({
      data: {
        studentId: student.data.id,
        classId: payload.data.classe,
        schoolYearId: payload.data.schoolYear,
      },
    });
    await enrollStudent({ payload: enrollmentPayload, token });
    hasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError(
          'registration',
          forms.messages.registration.errors.already_exists
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError('registration', forms.messages.registration.errors.problem);
  } finally {
    setSubmitting(false);
  }
};


export const confirmEnrollmentFormHandler = async ({
  enrollment,
  student,
  data,
  setSubmitting,
  setFieldError,
  token,
  setHasSucceeded,
}) => {
  try {

    // Map the primary enrollment payment data
    const enrollmentPaymentPayload = mapPaymentBody({
      data: {
        amount: data.enrollmentFee,
        enrollmentId: enrollment,
        paymentType: 'enrollment',
      }
    });
    console.log('payment payload', enrollmentPaymentPayload);

    // Create the primary enrollment payment
    const payment = await createPayment({
      payload: enrollmentPaymentPayload,
      token,
    });

    // Define a mapping from fee keys to their associated payment types
    const feeMapping = {
      monthlyFee: 'monthly',
      blouseFee: 'blouse',
      examFee: 'exam',
      parentContributionFee: 'parentContribution'
    };

    // For each additional fee, create a separate payment record if a fee is provided.
    for (const [feeKey, paymentType] of Object.entries(feeMapping)) {
      const feeValue = data[feeKey];
      if (feeValue != null && feeValue !== 0) {
        const extraPaymentPayload = mapPaymentBody({
          data: {
            amount: feeValue,
            enrollmentId: enrollment,
            paymentType: paymentType,
            monthOf: paymentType === 'monthly' ? data.monthOf : null,
          }
        });
        console.log(`Extra payment payload for ${feeKey}:`, extraPaymentPayload);
        await createPayment({
          payload: extraPaymentPayload,
          token,
        });
      }
    }

    setHasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError(
          'payment',
          forms.messages.payment.errors.already_exists
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError('payment', forms.messages.payment.errors.problem);
  } finally {
    setSubmitting(false);
  }
};
export const confirmStudentFormHandler = async ({
  student,
  data,
  setSubmitting,
  setFieldError,
  token,
  setHasSucceeded,
}) => {

  const payload = mapStudentConfirmationBody({ data });

  confirmStudent({ payload, token, student })
    .then(() => {
      setHasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'registration',
            forms.messages.registration.errors.already_exists
          );
        }
      }

      setFieldError('registration', forms.messages.registration.errors.problem);
      return;
    });

  setSubmitting(false);
};
// handle monthly payment


export const monthlyPaymentFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  setHasSucceeded,
}) => {
  try {
    const payload = mapPaymentBody({ data: { ...data, paymentType: 'monthly' } });

    await createPayment({ payload, token });
    setHasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError(
          'payment',
          forms.messages.payment.errors.already_exists
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError('payment', forms.messages.payment.errors.problem);
  } finally {
    setSubmitting(false);
  }
};

// handle student enrollment
export const studentEnrollmentFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  try {
    const payload = mapStudentEnrollmentBody({ data });
    console.log('enroll', payload);

    await enrollStudent({ payload, token });
    hasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError(
          'enrollment',
          forms.messages.enrollment.errors.already_exists
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError('enrollment', forms.messages.registration.errors.problem);
  } finally {
    setSubmitting(false);
  }
};

export const createClassroomFormHandler = async ({
  school,
  schoolYear,
  data,
  setSubmitting,
  setFieldError,
  token,
  action,
}) => {
  const { level, letter } = data;


  getSchool({
    addOns: `filters[$and][0][id][$eq]=${school}&filters[$and][1][classes][schoolYear][id][$eq]=${schoolYear}&filters[$and][1][classes][level][$eq]=${level}&filters[$and][1][classes][letter][$eq]=${letter}&populate=classes`,
    token,
  })
    .then((resp) => {
      const { data: found } = resp;
      if (found.length) {
        setSubmitting(false);
        return setFieldError('schoolCreation', 'Cette classe existe déjà');
      }

      createClassroom({
        payload: mapClassBody({ payload: { ...data, school, schoolYear } }),
        token,
      }).then(() => {
        action(true);
        window.location.reload();
      });
    })
    .catch((err) => {
      setFieldError(
        'schoolCreation',
        'Un problème est survenu lors de la création'
      );
      setSubmitting(false);
    });
};

export const monthValidationHandler = async ({ id, user_token }) => {
  const payload = mapMonthCreationBody({ payload: id });

  persistPayment({ payload, user_token }).then(() => window.location.reload());
};

// school creation form handler

export const schoolCreationFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  hasSucceeded,
  token,
}) => {
  const payload = mapSchoolCreationBody({ data });
  createSchool({ payload, token })
    .then(() => {
      setSubmitting(false);
      hasSucceeded(true);
      // window.location.reload();
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'school creation',
            forms.messages.school.creation.errors.already_exists
          );
        }
      }

      setFieldError(
        'school creation',
        forms.messages.school.creation.errors.problem
      );
      return;
    });
};

// school update form handler

export const schoolUpdateFormHandler = async ({
  school,
  data,
  setSubmitting,
  setFieldError,
  hasSucceeded,
  token,
}) => {
  const payload = mapSchoolCreationBody({ data });
  updateSchool({ school, payload, token })
    .then(() => {
      setSubmitting(false);
      hasSucceeded(true);
      // window.location.reload();
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'school creation',
            forms.messages.school.creation.errors.already_exists
          );
        }
      }

      setFieldError(
        'school creation',
        forms.messages.school.creation.errors.problem
      );
      return;
    });
};
// user creation form handler
export const userCreationFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {

  const payload = mapUserCreationBody({ data });
  console.log('user data', payload);

  createUser({ payload, token })
    .then(() => {
      hasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'registration',
            forms.messages.registration.errors.already_exists
          );
        }
      }

      setFieldError('registration', forms.messages.registration.errors.problem);
      return;
    });

  setSubmitting(false);
};

//  teacher recruitment form handler
export const teacherRecruitmentFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  const payload = mapTeacherCreationBody({ data });

  console.log('payload', payload);

  createTeacher({ payload, token })
    .then(() => {
      hasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'recruitment',
            forms.messages.teacher.recruitment.errors.already_exists
          );
        }
      }
      setFieldError(
        'recruitment',
        forms.messages.teacher.recruitment.errors.problem
      );
      return;
    });

  setSubmitting(false);
};

export const teacherUpdateFormHandler = async ({
  teacher,
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  const payload = mapTeacherCreationBody({ data });


  updateTeacher({ teacher, payload, token })
    .then(() => {
      hasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'recruitment',
            forms.messages.teacher.recruitment.errors.already_exists
          );
        }
      }
      setFieldError(
        'recruitment',
        forms.messages.teacher.recruitment.errors.problem
      );
      return;
    });

  setSubmitting(false);
};


export const schoolYearCreationFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  const payload = mapSchoolYearCreationBody({ data });

  createSchoolYear({ payload, token })
    .then(() => {
      hasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'School year creation',
            forms.messages.schoolYear.creation.errors.already_exists
          );
        }
      }
      setFieldError(
        'School year creation',
        forms.messages.schoolYear.creation.errors.problem
      );
      return;
    });

  setSubmitting(false);
};

export const schoolYearUpdateFormHandler = async ({
  schoolYear,
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  const payload = mapSchoolYearCreationBody({ data });

  updateSchoolYear({ schoolYear, payload, token })
    .then(() => {
      hasSucceeded(true);
      setSubmitting(false);
    })
    .catch((err) => {
      if (err?.data) {
        const { data } = err?.data;
        setSubmitting(false);
        if (data?.message?.includes('exists')) {
          return setFieldError(
            'School year creation',
            forms.messages.schoolYear.creation.errors.already_exists
          );
        }
      }
      setFieldError(
        'School year creation',
        forms.messages.schoolYear.creation.errors.problem
      );
      return;
    });

  setSubmitting(false);
};
