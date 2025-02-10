
// Map the school year creation body
export const mapSchoolYearCreationBody = ({ data }) => {
  return {
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    },
  };
};

// Map school year data for a DataTable-friendly format
export const mapSchoolYearsDataTable = ({ schoolYears }) => {
  if (schoolYears && Array.isArray(schoolYears.data) && schoolYears.data.length) {
    return schoolYears.data.map((schoolYear) => {
      const {
        id,
        attributes: { name, startDate, endDate, description, isActive, isCurrent , isEnded },
      } = schoolYear;
      return {
        id,
        name,
        startDate,
        endDate,
        description,
        isActive,
        isCurrent,
        isEnded

      };
    });
  }
  return [];
};



