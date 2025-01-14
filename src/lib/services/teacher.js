import { routes } from '@theme';
import { fetcher } from 'src/lib/api';

export const createTeacher = async ({ payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.create.teacher,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const updateTeacher = async ({ teacher, payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.update.teacher.replace('%id', teacher),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};
// export const confirmStudent = async ({ student, payload, token }) => {
//   return await fetcher({
//     uri: routes.api_route.alazhar.update.student.replace('%id', student),
//     options: {
//       method: 'PUT',
//       body: payload,
//     },
//     user_token: token,
//   });
// };
