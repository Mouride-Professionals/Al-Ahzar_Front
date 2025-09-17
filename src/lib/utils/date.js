/**
 * Date utility functions for school year management
 */

/**
 * Generate expected months array from school year start and end dates
 * @param {string} startDate - ISO date string for school year start
 * @param {string} endDate - ISO date string for school year end
 * @returns {number[]} Array of month numbers (1-12)
 */
export const generateExpectedMonths = (startDate, endDate) => {
  if (!startDate || !endDate) {
    // Fallback to default academic year months (october to July)
    return [10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  const current = new Date(start);

  while (current <= end) {
    const month = current.getMonth() + 1; // getMonth() returns 0-11, we want 1-12
    if (!months.includes(month)) {
      months.push(month);
    }

    // Move to next month
    current.setMonth(current.getMonth() + 1);
    current.setDate(1); // Ensure we don't skip months due to day overflow
  }

  return months;
};

/**
 * Get month name from month number
 * @param {number} monthNum - Month number (1-12)
 * @returns {string} Short month name
 */
export const getMonthName = (monthNum) => {
  const date = new Date();
  date.setMonth(monthNum - 1);
  return date.toLocaleString('default', { month: 'short' });
};
