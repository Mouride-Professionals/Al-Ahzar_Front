export const mapMonthCreationBody = ({ payload }) => {
  // Create a new Date object with the desired date
  const date = new Date(); // Note that month is zero-based (0 = January, 9 = October)

  // Get the year, month, and day from the date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's zero-based
  const day = String(date.getDate()).padStart(2, '0');

  // Combine the components into the desired format
  const formattedDate = `${year}-${month}-${day}`;

  return {
    data: {
      monthOf: formattedDate,
      isPaid: false,
      eleve: payload,
    },
  };
};
