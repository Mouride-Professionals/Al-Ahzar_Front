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

export const mapFormInitialValues = (arr) =>
  arr.reduce((obj, key) => {
    obj[key] = '';
    return obj;
  }, {});

export const dateFormatter = (date) => {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(date);
};
