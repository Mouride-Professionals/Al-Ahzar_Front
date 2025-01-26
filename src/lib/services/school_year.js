// create School Year

export const createSchoolYear = async ({ payload, token }) => {
  const {
    alazhar: {
      create: { school },
    },
  } = routes.api_route;
  return await fetcher({
    uri: school,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token: token,
  });
};