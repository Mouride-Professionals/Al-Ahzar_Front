import { routes } from '@theme';
import { fetcher } from 'src/lib/api';

export const getClassrooms = async ({ filters, token }) => {
  const classRoomRoute = filters
    ? `${routes.api_route.alazhar.get.class.all}&${filters}`
    : routes.api_route.alazhar.get.class.all;

  return await fetcher({
    uri: classRoomRoute,
    user_token: token,
  });
};

export const getSchool = async ({ addOns, school, token }) => {
  const {
    alazhar: {
      get: {
        schools: { all, detail },
      },
    },
  } = routes.api_route;
  const schoolRoute = addOns
    ? `${all}?${addOns}`
    : detail.replace('%id', school);

  return await fetcher({
    uri: schoolRoute,
    user_token: token,
  });


};

export const createClassroom = async ({ payload, token }) => {
  const {
    alazhar: {
      create: { classroom },
    },
  } = routes.api_route;
  return await fetcher({
    uri: classroom,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};
