import { formatPhoneNumber } from './formatters';

export const mapTeacherCreationBody = ({ data }) => {
    return {
        data: {
            firstname: data.firstname,
            lastname: data.lastname,
            gender: data.sex,
            // dateOfBirth: formatDate(data),
            // birthPlace: data.birthplace,
            email: data.email,
            phoneNumber: data.phoneNumber,
        },
    };
}; export const mapTeachersDataTable = ({ teachers }) => {
    if (teachers && Array.isArray(teachers.data) && teachers.data.length) {
        const { data } = teachers;

        return data.map((teacher) => {
            const {
                id,
                attributes: {
                    firstname,
                    lastname,
                    phoneNumber,
                    email,
                    gender,
                    createdAt,
                },
            } = teacher;


            return {
                id,
                firstname,
                lastname,
                phoneNumber: formatPhoneNumber(phoneNumber),
                email,
                gender,
                createdAt
            };
        });
    }
};
