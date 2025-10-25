import { createExpense } from '@services/expense';
import { cancelPayment, persistPayment } from '@services/payment';
import {
  createClassroom,
  createSchool,
  getSchool,
  updateClassroom,
  updateSchool,
} from '@services/school';
import { createSchoolYear, updateSchoolYear } from '@services/school_year';
import {
  confirmStudent,
  createPayment,
  createStudent,
  enrollStudent,
  updateEnrollment,
  updateStudent,
} from '@services/student';
import { createTeacher, updateTeacher } from '@services/teacher';
import { createUser, updateUser } from '@services/user';
import { forms } from '@theme';
import { mapExpenseCreationBody } from '@utils/mappers/expense';
import { mapMonthCreationBody } from '@utils/mappers/payment';
import { mapSchoolCreationBody } from '@utils/mappers/school';
import { mapSchoolYearCreationBody } from '@utils/mappers/school_year';
import {
  mapPaymentBody,
  mapStudentConfirmationBody,
  mapStudentCreationBody,
  mapStudentEnrollmentBody,
} from '@utils/mappers/student';
import { mapTeacherCreationBody } from '@utils/mappers/teacher';
import { mapUserCreationBody } from '@utils/mappers/user';
import { mapClassBody } from '@utils/tools/mappers';
import { signIn } from 'next-auth/react';

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
      redirect: false,
    });

    if (!res || res.error) {
      setSubmitting(false);
      setFieldError(
        'authentication',
        forms.messages.login.errors.not_authorized
      );

      return { error: res?.error || 'Authentication failed' };
    }

    return { success: true, callbackUrl: redirectOnSuccess };
  } catch (error) {
    console.error('Login error:', error);
    setSubmitting(false);
    setFieldError(
      'authentication',
      'An unexpected error occurred. Please try again.'
    );
    return { error: error.message };
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
    const studentPayload = mapStudentCreationBody({ data });

    const student = await createStudent({ payload: studentPayload, token });
    // Enroll student
    const enrollmentPayload = mapStudentEnrollmentBody({
      data: {
        studentId: student.data.id,
        classId: studentPayload.data.classe,
        schoolYearId: studentPayload.data.schoolYear,
        socialCategory: studentPayload.data.socialStatus,
        enrollmentType: 'Nouveau',
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
      },
    });

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
      parentContributionFee: 'parentContribution',
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
          },
        });
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
        setFieldError('payment', forms.messages.payment.errors.already_exists);
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
    const payload = mapPaymentBody({
      data: { ...data, paymentType: 'monthly' },
    });

    await createPayment({ payload, token });
    setHasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError('payment', forms.messages.payment.errors.already_exists);
        setSubmitting(false);
        return;
      }
    }
    setFieldError('payment', forms.messages.payment.errors.problem);
  } finally {
    setSubmitting(false);
  }
};

export const addPaymentFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  try {
    const payload = mapPaymentBody({ data });
    await createPayment({ payload, token });
    hasSucceeded(true);
  } catch (err) {
    console.error('Error adding payment:', err);
    if (err?.data) {
      const { data: errorData } = err.data;
      if (errorData?.message?.includes('exists')) {
        setFieldError('payment', forms.messages.payment.errors.already_exists);
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
    data.classId = data.classroom;
    const payload = mapStudentEnrollmentBody({ data });

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

export const updateClassroomFormHandler = async ({
  classId,
  data,
  setSubmitting,
  setFieldError,
  token,
  action,
}) => {
  try {
    await updateClassroom({
      classId,
      payload: mapClassBody({ payload: data }),
      token,
    });
    action(true);
    // window.location.reload();
  } catch (err) {
    setFieldError(
      'schoolCreation',
      'Un problème est survenu lors de la modification'
    );
    setSubmitting(false);
  }
};

export const monthValidationHandler = async ({ id, user_token }) => {
  const payload = mapMonthCreationBody({ payload: id });

  persistPayment({ payload, user_token }).then(() => window.location.reload());
};

// school creation form handler

export const schoolCreationFormHandler = async ({
  data,
  bannerFile,
  setSubmitting,
  setFieldError,
  hasSucceeded,
  token,
}) => {
  // Map the school creation payload
  let payload = mapSchoolCreationBody({ data });

  // If a banner file is provided, use FormData for the payload
  if (bannerFile && bannerFile.size !== 0) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload.data));
    formData.append('files.banner', bannerFile, bannerFile.name);
    payload = formData;
  }

  createSchool({ payload, token })
    .then(() => {
      setSubmitting(false);
      hasSucceeded(true);
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
  bannerFile,
  setSubmitting,
  setFieldError,
  hasSucceeded,
  token,
}) => {
  let payload = mapSchoolCreationBody({ data });

  if (bannerFile) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    formData.append('files.banner', bannerFile, bannerFile.name);
    payload = formData;
  }

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
  try {
    // Map the user creation payload
    //add default password to user
    const defaultPassword = 'Passer@123';
    const payload = mapUserCreationBody({
      data: {
        ...data,
        password: defaultPassword,
      },
    });

    // Attempt to create the user and update its role
    const user = await createUser({ payload, token });

    const role = data.role;
    await updateUser({
      user: user.user.id,
      payload: {
        role: role,
      },
      token,
    });

    setSubmitting(false);
    hasSucceeded(true);
  } catch (err) {
    console.error('Error creating user:', err);

    // Handle specific error cases
    if (err?.data) {
      const { data: errorData } = err.data;

      // Check if the error message indicates the user already exists
      if (errorData?.message?.includes('exists')) {
        setFieldError(
          'registration',
          forms.messages.registration.errors.already_exists
        );
        return;
      }

      // Handle other specific error messages
      setFieldError(
        'registration',
        errorData?.message || forms.messages.registration.errors.problem
      );
    } else {
      // Handle general errors
      setFieldError(
        'registration',
        err?.message || forms.messages.registration.errors.problem
      );
    }
  } finally {
    // Ensure the submitting state is reset
    setSubmitting(false);
  }
};
// export const userCreationFormHandler = async ({
//   data,
//   setSubmitting,
//   setFieldError,
//   token,
//   hasSucceeded,
// }) => {

//   const payload = mapUserCreationBody({ data });

//   createUser({ payload, token })
//     .then(() => {
//       hasSucceeded(true);
//       setSubmitting(false);
//     })
//     .catch((err) => {
//       if (err?.data) {
//         const { data } = err?.data;
//         setSubmitting(false);
//         if (data?.message?.includes('exists')) {
//           return setFieldError(
//             'registration',
//             forms.messages.registration.errors.already_exists
//           );
//         }
//       }

//       setFieldError('registration', forms.messages.registration.errors.problem);
//       return;
//     });

//   setSubmitting(false);
// };

//  teacher recruitment form handler
export const teacherRecruitmentFormHandler = async ({
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  const payload = mapTeacherCreationBody({ data });

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

export const studentUpdateFormHandler = async ({
  student,
  enrollment, // Add enrollment ID parameter for updating enrollment if needed
  data,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  try {
    const studentPayload = mapStudentCreationBody({ data });

    // Update student information
    await updateStudent({ student, payload: studentPayload, token });

    // Check if enrollment-related data has changed and update if needed
    if (enrollment) {
      const enrollmentData = {};
      let hasEnrollmentChanges = false;

      // Check if class has changed (class_letter contains the class ID)
      if (data.class_letter && studentPayload.data.classe) {
        enrollmentData.class = studentPayload.data.classe;
        hasEnrollmentChanges = true;
      }

      // Check if social status has changed
      if (data.socialCategory && studentPayload.data.socialStatus) {
        enrollmentData.socialStatus = studentPayload.data.socialStatus;
        hasEnrollmentChanges = true;
      }

      // Update enrollment if there are changes
      if (hasEnrollmentChanges) {
        const enrollmentPayload = { data: enrollmentData };
        await updateEnrollment({
          enrollment,
          payload: enrollmentPayload,
          token,
        });
      }
    }

    hasSucceeded(true);
  } catch (err) {
    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('exists')) {
        setFieldError(
          'registration',
          forms.messages.student.registration.errors.already_exists
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError(
      'registration',
      forms.messages.student.registration.errors.problem
    );
  } finally {
    setSubmitting(false);
  }
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

export const expenseCreationFormHandler = async ({
  token,
  data,
  setSubmitting,
  setFieldError,
  hasSucceeded,
}) => {
  try {
    const payload = mapExpenseCreationBody({ data });

    await createExpense({ token, payload });
    hasSucceeded(true);
  } catch (err) {
    console.error('Error creating expense:', err);
    if (err?.data) {
      const { data: errorData } = err.data;
      // If errorData.message exists, use it, else fall back to a standard error message.
      setFieldError(
        'expense creation',
        errorData?.message || 'Erreur lors de la création de la dépense'
      );
    } else {
      setFieldError(
        'general',
        err?.message || 'Erreur lors de la création de la dépense'
      );
    }
  } finally {
    setSubmitting(false);
  }
};

export const paymentCancellationHandler = async ({
  paymentId,
  cancellationReason,
  setSubmitting,
  setFieldError,
  token,
  hasSucceeded,
}) => {
  try {
    const payload = {
      data: {
        status: 'cancelled',
        cancellationReason: cancellationReason,
        cancelledAt: new Date().toISOString(),
      },
    };

    await cancelPayment({ paymentId, payload, token });
    hasSucceeded(true);
  } catch (err) {
    console.log('Error cancelling payment:', err);

    if (err?.data) {
      const { data } = err?.data;
      if (data?.message?.includes('not found')) {
        setFieldError(
          'cancellation',
          forms.messages.payment.cancellation.errors.not_found
        );
        setSubmitting(false);
        return;
      }
      if (data?.message?.includes('already cancelled')) {
        setFieldError(
          'cancellation',
          forms.messages.payment.cancellation.errors.already_cancelled
        );
        setSubmitting(false);
        return;
      }
    }
    setFieldError(
      'cancellation',
      forms.messages.payment.cancellation.errors.problem
    );
  } finally {
    setSubmitting(false);
  }
};
