import { persistPayment } from '@services/payment';
import { createClassroom, getSchool } from '@services/school';
import { confirmStudent, createStudent } from '@services/student';
import { forms, routes } from '@theme';
import { mapMonthCreationBody } from '@utils/mappers/payment';
import {
  mapStudentConfirmationBody,
  mapStudentCreationBody,
} from '@utils/mappers/student';
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
    console.log("res", res);

    window.location.assign(redirectOnSuccess);
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
  const payload = mapStudentCreationBody({ data });

  createStudent({ payload, token })
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

export const createClassromFormHandler = async ({
  school,
  data,
  setSubmitting,
  setFieldError,
  token,
  action,
}) => {
  const { level, letter } = data;


  getSchool({
    addOns: `filters[$and][0][id][$eq]=${school}&filters[$and][1][classes][level][$eq]=${level}&filters[$and][1][classes][letter][$eq]=${letter}&populate=classes`,
    token,
  })
    .then((resp) => {

      const {
        data: found,
      } = resp;
      if (found.length) {
        setSubmitting(false);
        return setFieldError('schoolCreation', 'Cette classe existe déjà');
      }


      createClassroom({
        payload: mapClassBody({ payload: { ...data, school } }),
        token,
      }).then(() => {
        action(true);
        window.location.reload();
      })
    })
    .catch((
      err
    ) => {
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
