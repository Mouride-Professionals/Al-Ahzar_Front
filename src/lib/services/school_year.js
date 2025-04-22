// create School Year

import { routes } from "@theme";
import { fetcher } from "../api";

export const createSchoolYear = async ({ payload, token }) => {

  const {
    alazhar: {
      create: { school_year },
    },
  } = routes.api_route;
  return await fetcher({
    uri: school_year,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};

export const updateSchoolYear = async ({ schoolYear, payload, token }) => {
  return await fetcher({
    uri: routes.api_route.alazhar.update.school_year.replace('%id', schoolYear),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};


// set School Year as current

export const setCurrentSchoolYear = async (schoolYear, token) => {
  return await fetcher({
    uri: `${routes.api_route.alazhar.update.school_year.replace('%id', schoolYear)}/set-current`,
    options: {
      method: 'PUT',
      body: {
        data: {},
      },
    },
    user_token: token,
  });
};

//set School Year as ended

export const endSchoolYear = async (schoolYear, token) => {
  return await fetcher({
    uri: `${routes.api_route.alazhar.update.school_year.replace('%id', schoolYear)}/set-ended`,
    options: {
      method: 'PUT',
      body: {
        data: {},
      },
    },
    user_token: token,
  });
};