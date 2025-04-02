import { formatPhoneNumber } from './formatters';

export const mapTeacherCreationBody = ({ data }) => {
  return {
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      birthDate: data.birthDate,
      birthPlace: data.birthPlace,
      address: data.address,
      email: data.email,
      phoneNumber: data.phoneNumber,
      maritalStatus: data.maritalStatus,
      academicDegree: data.academicDegree,
      professionalDegrees: data.professionalDegrees,
      disciplines: data.disciplines,
      language: data.language,
      subjects: data.subjects,
      contractType: data.contractType,
      level: data.level,
      salary: data.salary,
      registrationNumber: data.registrationNumber,
      generation: data.generation,
      salaryPerHour: data.salaryPerHour,
      hoursNumber: data.hoursNumber,
      additionalResponsibilities: data.additionalResponsibilities,
      countryFrom: data.countryFrom,
      arrivalDate: data.arrivalDate,
      previousInstitutes: data.previousInstitutes,
      school: data.school,
    },
  };
};

export const mapTeachersDataTable = ({ teachers }) => {
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
          address,
          birthDate,
          birthPlace,
          maritalStatus,
          academicDegree,
          professionalDegrees,
          disciplines,
          language,
          subjects,
          contractType,
          level,
          salary,
          registrationNumber,
          generation,
          salaryPerHour,
          hoursNumber,
          additionalResponsibilities,
          countryFrom,
          arrivalDate,
          previousInstitutes,
          createdAt,
          school,
        },
      } = teacher;

      return {
        id,
        firstname,
        lastname,
        phoneNumber: formatPhoneNumber(phoneNumber),
        email,
        gender,
        address,
        birthDate,
        birthPlace,
        maritalStatus,
        academicDegree,
        professionalDegrees,
        disciplines,
        language,
        subjects,
        contractType,
        level,
        salary,
        registrationNumber,
        generation,
        salaryPerHour,
        hoursNumber,
        additionalResponsibilities,
        countryFrom,
        arrivalDate: arrivalDate,
        previousInstitutes,
        createdAt: createdAt,
        school: school?.data?.attributes.name,
      };
    });
  }
};
