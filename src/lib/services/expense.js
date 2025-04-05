import { routes } from "@theme";
import { fetcher } from "../api";

export const createExpense = async ({ payload, token }) => {

    const {
        alazhar: {
            create: { expense },
        },
    } = routes.api_route;
    return await fetcher({
        uri: expense,
        options: {
            method: 'POST',
            body: payload,
        },
        user_token: token,
    });
};