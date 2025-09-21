import { routes } from '@theme';
import { fetcher, serverFetch } from 'src/lib/api';

export const createStudent = async ({ payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.create.student,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const confirmStudent = async ({ student, payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.update.student.replace('%id', student),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};

export const updateStudent = async ({ student, payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.update.student.replace('%id', student),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};

//create student enrollment

export const enrollStudent = async ({ payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.create.enrollment,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const createPayment = async ({ payload, token }) => {
  return await fetcher({
    uri: '/payments',
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const createPaymentDetail = async ({ payload, token }) => {
  return await fetcher({
    uri: '/payment-details',
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const getStudentDetails = async ({ studentId, token }) => {
  return await serverFetch({
    uri: routes.api_route.alazhar.get.students.detail.replace('%id', studentId),
    user_token: token,
  });
};

export const updateEnrollment = async ({ enrollment, payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.update.enrollment.replace('%id', enrollment),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};
