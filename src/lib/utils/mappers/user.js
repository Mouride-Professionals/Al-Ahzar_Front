// This function builds the body for creating a new user.
export const mapUserCreationBody = ({ data }) => {
    return {
        data: {
            username: data.username,           // required and unique
            email: data.email,                 // required email field
            password: data.password,           // required (Strapi will hash it)
            firstname: data.firstname,         // optional first name
            lastname: data.lastname,           // optional last name
            confirmed: data.confirmed ?? false, // default false if not provided
            blocked: data.blocked ?? false,
            role: data.role,                   // either an object or id; adjust as needed
            school: data.school,
        },
    };
};

// This function transforms the raw users data from Strapi into a table-friendly format.
export const mapUsersDataTable = ({ users }) => {
    if (users && Array.isArray(users) && users.length) {
        return users.map((user) => {
            const {
                id,
                username,
                email,
                firstname,
                lastname,
                confirmed,
                blocked,
                role,
                school,
                createdAt,

            } = user;

            return {
                id,
                username,
                email,
                firstname,
                lastname,
                confirmed,
                blocked,
                // Assuming role is a relation, we extract the name from role.data.attributes
                role: role || 'N/A',
                // Similarly extract the school names, if assigned
                school: school,
                createdAt,
            };
        });
    }
    return [];
};