export const mapClassBody = ({ payload }) => {
  const { level, letter, grade, name, school } = payload;
  return {
    data: {
      cycle: grade,
      name,
      etablissement: school,
      level,
      letter,
    },
  };
};

export const ClassTitle = (name) => {
  if (name.startsWith('a')) {
    return name.replace(/a/, '');
  }

  return name;
};



export const mapFormInitialValues = (schemaNodes, initialData = {}) => {
  // Initialize default values for all schema nodes
  const initialValues = schemaNodes.reduce((obj, key) => {

    if (key === 'salaryPerHour' || key === 'hoursNumber' || key === 'salary') {
      obj[key] = 0;
      return obj;
    }
    if (key === 'subjects' || key === 'professionalDegrees' || key === 'disciplines') {
      obj[key] = [];
      return obj;
    }
    if (key === 'arrivalDate') {
      obj[key] = null;
      return obj;
    }

    obj[key] = '';
    return obj;
  }, {});

  // Override default values with initialData if provided
  Object.keys(initialData).forEach((key) => {
    if (initialValues.hasOwnProperty(key)) {
      initialValues[key] = initialData[key] ?? initialValues[key];
    }
  });

  return initialValues;
};

export const dateFormatter = (date) => {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(date);
};
