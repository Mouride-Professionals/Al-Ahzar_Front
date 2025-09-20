import { routes } from '@theme';
import { fetcher } from 'src/lib/api';

const {
  alazhar: {
    create: { payment },
    update: { payment: updatePayment },
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

export const cancelPayment = async ({ paymentId, payload, token }) => {
  return await fetcher({
    uri: updatePayment.replace('%id', paymentId),
    options: {
      method: 'PUT',
      body: payload,
    },
    user_token: token,
  });
};
