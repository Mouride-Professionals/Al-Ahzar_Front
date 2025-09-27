import { ClassTitle } from '@utils/tools/mappers';
import { formatDate, formatPhoneNumber } from './formatters';

export const mapStudentCreationBody = ({ data }) => {
  return {
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.sex,
      socialStatus: data.socialCategory,
      dateOfBirth: formatDate(data),
      birthPlace: data.birthplace,
      tutorLastname: data.parent_lastname,
      tutorFirstname: data.parent_firstname,
      tutorPhoneNumber: data.parent_phone,
      classe: data.class_letter,
      schoolYear: data.schoolYear,
    },
  };
};

export const mapStudentEnrollmentBody = ({ data }) => {
  return {
    data: {
      enrollmentDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      student: data.studentId, // Assuming you have the student ID in the data
      class: data.classId, // Assuming you have the class ID in the data
      schoolYear: data.schoolYearId, // Assuming you have the school year ID in the data
      socialStatus: data.socialCategory,
      enrollmentType: data.enrollmentType,
    },
  };
};

export const mapStudentConfirmationBody = ({ data }) => {
  return {
    data: {
      type: data.studentType,
      socialStatus: data.socialCategory,
      registrationComment: data.comment,
    },
  };
};
export const mapPaymentBody = ({ data }) => {
  return {
    data: {
      amount: data.amount,
      monthOf: data.monthOf,
      enrollment: data.enrollmentId,
      paymentType: data.paymentType,
      motive: data.motive,
      comment: data.comment,
    },
  };
};

export const mapPaymentDetailBody = ({ data }) => {
  return {
    data: {
      payment: data.paymentId,
      monthlyFee: data.monthlyFee,
      enrollmentFee: data.enrollmentFee,
      blouseFee: data.blouseFee,
      examFee: data.examFee,
      parentContributionFee: data.parentContributionFee,
    },
  };
};

export const mapStudentsDataTable = ({ students }) => {
  if (students && Array.isArray(students.data) && students.data.length) {
    const { data } = students;

    return data.map((student) => {
      const {
        id,
        attributes: {
          firstname,
          lastname,
          tutorFirstname,
          tutorLastname,
          tutorPhoneNumber,
          createdAt,
          classe,
          type,
          socialStatus,
          registrationComment,
          payments,
          // optional identifier coming from students table
          studentIdentifier,
        },
      } = student;
      let level = students.defaultLevel || 'N/A';

      if (classe?.data) {
        const {
          data: { attributes },
        } = classe;
        level = `${attributes.level} ${attributes.letter}`;
      }

      var current_month = new Date().toLocaleDateString().split('/')[0];

      const isCurrentMonthPaid = payments?.data?.find(
        (rp) =>
          new Date(rp.attributes.monthOf).toLocaleDateString().split('/')[0] ===
          current_month
      )
        ? true
        : false;

      return {
        id,
        firstname,
        lastname,
        // expose student identifier for data tables (read-only, provided by backend)
        student_identifier: studentIdentifier,
        level,
        parent_firstname: tutorFirstname,
        parent_lastname: tutorLastname,
        parent_phone: formatPhoneNumber(tutorPhoneNumber),
        registered_at: createdAt.split('T')[0].split('-').reverse().join('/'),
        type,
        socialStatus,
        registrationComment,
        payments,
        isCurrentMonthPaid,
      };
    });
  }
};
export const mapStudentsDataTableForEnrollments = ({ enrollments }) => {
  if (
    enrollments &&
    Array.isArray(enrollments.data) &&
    enrollments.data.length
  ) {
    const { data } = enrollments;

    return data.map((enrollment) => {
      const {
        id,
        attributes: {
          enrollmentDate,
          // enrollmentNumber is provided by the backend on the enrollment entity
          enrollmentNumber,
          schoolYear: {
            data: { id: schoolYearId },
          },
          student: {
            data: {
              id: studentId,
              attributes: {
                firstname,
                lastname,
                tutorFirstname,
                tutorLastname,
                tutorPhoneNumber,
                type,
                socialStatus,
                registrationComment,
                // optional identifier from student entity
                studentIdentifer,

                createdAt,
              },
            },
          },
          payments,
          class: classroom,
        },
      } = enrollment;

      let formattedLevel = enrollments.defaultLevel || 'N/A';

      if (classroom?.data) {
        const {
          data: {
            attributes: { level, letter },
          },
        } = classroom;
        formattedLevel = `${level} ${letter}`;
      }
      const currentMonth = new Date().toLocaleDateString().split('/')[0];

      const isCurrentMonthPaid = payments?.data?.find(
        (rp) =>
          new Date(rp.attributes.monthOf).toLocaleDateString().split('/')[0] ===
          currentMonth
      )
        ? true
        : false;

      return {
        id: studentId,
        firstname,
        lastname,
        // expose backend-provided identifiers (read-only fields)
        student_identifier: studentIdentifer,
        enrollment_number: enrollmentNumber,
        schoolYear: schoolYearId,
        level: formattedLevel,
        parent_firstname: tutorFirstname,
        parent_lastname: tutorLastname,
        parent_phone: formatPhoneNumber(tutorPhoneNumber),
        type,
        socialStatus,
        registrationComment,
        registered_at: createdAt.split('T')[0].split('-').reverse().join('/'),
        enrollment_date: enrollmentDate
          .split('T')[0]
          .split('-')
          .reverse()
          .join('/'),
        enrollment_id: id,
        payments,
        isCurrentMonthPaid,
      };
    });
  }
  return [];
};

// Helper function to find the appropriate category for the level
const gradeLevels = ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
const intermediateLevels = ['a 6eme', 'a 5eme', 'a 4eme', 'a 3eme'];
const upperIntermediateLevels = ['a 2nd', 'a 1ere', 'Terminale'];

const getCategory = (level) => {
  if (gradeLevels.includes(level)) {
    return 'grade';
  } else if (intermediateLevels.includes(level)) {
    return 'intermediate';
  } else if (upperIntermediateLevels.includes(level)) {
    return 'upperIntermediate';
  } else {
    return null;
  }
};

export const mapClassesByLevel = ({ classes }) => {
  if (classes) {
    const { data } = classes;

    const transformedData = {
      grade: [],
      intermediate: [],
      upperIntermediate: [],
    };

    // Group the data by their levels
    data.forEach((item) => {
      const {
        id,
        attributes: {
          level,
          letter,
          enrollments: { data: enrollments },
        },
      } = item;

      const category = getCategory(level);
      if (category) {
        const existingLevel = transformedData[category].find(
          (entry) => entry.name === level
        );

        if (existingLevel) {
          existingLevel.students.push(enrollments.length);
          existingLevel.classId.push(id);
          existingLevel.sections.push(letter);
        } else {
          transformedData[category].push({
            classId: [id],
            students: [enrollments.length],
            name: level,
            sections: [letter],
          });
        }
      }
    });

    // Sort levels within each category
    transformedData.grade.sort(
      (a, b) => gradeLevels.indexOf(a.name) - gradeLevels.indexOf(b.name)
    );
    transformedData.intermediate.sort(
      (a, b) =>
        intermediateLevels.indexOf(a.name) - intermediateLevels.indexOf(b.name)
    );
    transformedData.upperIntermediate.sort(
      (a, b) =>
        upperIntermediateLevels.indexOf(a.name) -
        upperIntermediateLevels.indexOf(b.name)
    );

    return transformedData;
  }

  return {};
};

export const mapClassesAndLetters = ({ classes }) => {
  var classesMap = [];
  var sectionsMap = [];
  var cyclesMap = [];

  const { data } = classes;

  data.map(function (item) {
    classesMap.push(item.attributes.level);
    sectionsMap = sectionsMap.concat({
      name: item.attributes.letter,
      value: item.id,
    });
    cyclesMap = cyclesMap.concat(item.attributes.cycle);
  });

  // Remove duplicates and sort the arrays
  classesMap = Array.from(new Set(classesMap)).sort();
  sectionsMap = Array.from(new Set(sectionsMap)).sort();
  cyclesMap = Array.from(new Set(cyclesMap)).sort();

  return {
    classes: classesMap,
    sections: sectionsMap,
    cycles: cyclesMap,
  };
};

// Enhanced function to get filtered classes based on selected cycle
export const getClassesByCycle = ({ classes, selectedCycle }) => {
  if (!selectedCycle) return [];

  const { data } = classes;
  const filteredClasses = data
    .filter((item) => item.attributes.cycle === selectedCycle)
    .map((item) => item.attributes.level);

  return Array.from(new Set(filteredClasses)).sort();
};

// Enhanced function to get filtered class letters based on selected cycle and level
export const getClassLettersByCycleAndLevel = ({
  classes,
  selectedCycle,
  selectedLevel,
}) => {
  if (!selectedCycle || !selectedLevel) return [];

  const { data } = classes;
  const filteredLetters = data
    .filter(
      (item) =>
        item.attributes.cycle === selectedCycle &&
        item.attributes.level === selectedLevel
    )
    .map((item) => ({
      name: item.attributes.letter,
      value: item.id,
    }));

  return filteredLetters;
};

export const mapToOptions = ({ data }) => {
  return data.map((option) =>
    typeof option == 'object'
      ? { name: ClassTitle(option.name), value: option.value }
      : { name: ClassTitle(option), value: option }
  );
};
