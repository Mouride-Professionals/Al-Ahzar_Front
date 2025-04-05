// @utils/mappers/expense.js
import { dateFormatter } from "@utils/tools/mappers"; // Assuming you have this utility

// Maps form data to a Strapi-compatible payload for creating an expense
export const mapExpenseCreationBody = ({ data }) => {
  return {
    data: {
      expenseDate: data.expenseDate, // Expected as ISO string (e.g., "2025-04-01")
      amount: data.amount, // Decimal or number
      category: data.category, // One of: "Utilities", "Salaries", "Supplies", "Maintenance", "Other"
      description: data.description, // Optional text
      school: data.school, // School ID (e.g., from a dropdown)
      schoolYear: data.schoolYear, // SchoolYear ID (e.g., from a dropdown)
    },
  };
};

// Maps Strapi expense API response to a format for the ExpenseDataSet table
export const mapExpensesDataTable = ({ expenses }) => {
  if (expenses && Array.isArray(expenses.data) && expenses.data.length) {
    const { data } = expenses;

    return data.map((expense) => {
      const {
        id,
        attributes: {
          expenseDate,
          amount,
          category,
          description,
          school,
          schoolYear,
          createdAt,
          updatedAt,
        },
      } = expense;

      return {
        id,
        expenseDate, // Kept as raw ISO string for sorting/filtering; formatted in table
        amount: Number(amount), // Ensure numeric for display/export
        category,
        description: description || "N/A", // Default if empty
        school: school?.data?.attributes?.name || "N/A", // Nested school name
        schoolYear: schoolYear?.data?.attributes?.name || "N/A", // Nested school year name
        createdAt, // Optional: for auditing
        updatedAt, // Optional: for auditing
      };
    });
  }
  return []; // Return empty array if no data
};