import { routes } from '@theme';
import { fetcher } from 'src/lib/api';

export const createUser = async ({ payload, token }) => {
    const { data: newPayload } = payload;

    return await fetcher({
        // uri: routes.api_route.alazhar.create.user,
        uri: "/auth/local/register",
        options: {
            method: 'POST',
            body: newPayload,
        },
        user_token: token,
    });
};
//assign role to user
export const assignRole = async ({ user, role, token }) => {


    const payload = {

        role: role,
        firstname: 'Sylla',
        lastname: 'Bamba'
    }
    return await fetcher({
        uri: routes.api_route.alazhar.update.user.replace('%id', user),
        options: {
            method: 'PUT',
            body: payload,
        },
        user_token: `${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    });
};


export const updateUser = async ({ user, payload, token }) => {
    return await fetcher({
        uri: routes.api_route.alazhar.update.user.replace('%id', user),
        options: {
            method: 'PUT',
            body: payload,
        },
        user_token: token,
    });
};
export const assignUser = async ({ user, school, token }) => {
    const payload = {
        data: {
            school: school,
        },
    }
    return await fetcher({
        uri: routes.api_route.alazhar.update.user.replace('%id', user),
        options: {
            method: 'PUT',
            body: payload,
        },
        user_token: token,
    });
};
