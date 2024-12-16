import { routes } from '@theme';
import { fetcher } from 'src/lib/api';

const {
  alazhar: {
    create: { payment },
  },
} = routes.api_route;

export const persistPayment = async ({ payload, user_token }) => {
  return await fetcher({
    uri: payment,
    options: {
      method: 'POST',
      body: payload,
    },
    user_token,
  });
};
