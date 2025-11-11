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
 * Normalize any month-like value into a 1-12 month index.
 * Accepts numbers, numeric strings, Date objects, or ISO strings.
 * @param {number|string|Date|null|undefined} value
 * @returns {number|null}
 */
export const normalizeMonthIndex = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getMonth() + 1;
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getMonth() + 1;
    }
  }

  return null;
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
