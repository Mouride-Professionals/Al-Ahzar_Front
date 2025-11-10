const DEFAULT_STUDENT_LABELS = {
  student_identifier: 'Student ID',
  firstname: 'First Name',
  lastname: 'Last Name',
  level: 'Class',
  type: 'Enrollment Type',
  socialStatus: 'Social Status',
  guardian: 'Guardian',
  guardian_phone: 'Guardian Phone',
  registered_at: 'Registration Date',
  enrollment_date: 'Start Date',
  enrollment_number: 'Enrollment Number',
  registrationComment: 'Comment',
  isCurrentMonthPaid: 'Current Month Paid',
};

const DEFAULT_BOOLEAN_LABELS = { true: 'Yes', false: 'No' };
const DEFAULT_SINGLE_VALUE_LABEL = 'Value';

const getLabel = (key, labels) => labels?.[key] ?? DEFAULT_STUDENT_LABELS[key] ?? key;

const normalizeCellValue = (value, booleanLabels = DEFAULT_BOOLEAN_LABELS) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? booleanLabels.true : booleanLabels.false;
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeCellValue(item, booleanLabels))
      .filter((item) => item !== '')
      .join(', ');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
};

const STUDENT_FIELD_MAPPERS = [
  { key: 'student_identifier', value: (row) => row.student_identifier ?? '' },
  { key: 'firstname', value: (row) => row.firstname ?? '' },
  { key: 'lastname', value: (row) => row.lastname ?? '' },
  { key: 'level', value: (row) => row.level ?? '' },
  { key: 'type', value: (row) => row.type ?? '' },
  { key: 'socialStatus', value: (row) => row.socialStatus ?? '' },
  {
    key: 'guardian',
    value: (row) => [row.parent_firstname, row.parent_lastname].filter(Boolean).join(' ').trim(),
  },
  { key: 'guardian_phone', value: (row) => row.parent_phone ?? '' },
  { key: 'registered_at', value: (row) => row.registered_at ?? '' },
  { key: 'enrollment_date', value: (row) => row.enrollment_date ?? '' },
  { key: 'enrollment_number', value: (row) => row.enrollment_number ?? '' },
  { key: 'registrationComment', value: (row) => row.registrationComment ?? '' },
  {
    key: 'isCurrentMonthPaid',
    value: (row, { booleanLabels }) =>
      row.isCurrentMonthPaid ? booleanLabels.true : booleanLabels.false,
  },
];

const prepareStudentExport = (array, { labels, booleanLabels }) => {
  return array.map((row) =>
    STUDENT_FIELD_MAPPERS.reduce((acc, field) => {
      const header = getLabel(field.key, labels);
      const cellValue = field.value(row, { booleanLabels });
      acc[header] = normalizeCellValue(cellValue, booleanLabels);
      return acc;
    }, {})
  );
};

const prepareExportDataset = (array, options = {}) => {
  if (!Array.isArray(array) || !array.length) return [];

  const {
    labels,
    booleanLabels = DEFAULT_BOOLEAN_LABELS,
    singleValueLabel = DEFAULT_SINGLE_VALUE_LABEL,
  } = options;

  const first = array[0] || {};
  const studentKeys = ['firstname', 'student_identifier', 'parent_firstname'];

  if (studentKeys.every((key) => Object.prototype.hasOwnProperty.call(first, key))) {
    return prepareStudentExport(array, { labels, booleanLabels });
  }

  return array.map((row) => {
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      return Object.entries(row).reduce((acc, [key, value]) => {
        const header = labels?.[key] ?? key;
        acc[header] = normalizeCellValue(value, booleanLabels);
        return acc;
      }, {});
    }
    return { [singleValueLabel]: normalizeCellValue(row, booleanLabels) };
  });
};

export const convertArrayOfObjectsToCSV = (array) => {
  let result;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

export const downloadCSV = (array) => {
  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename =
    new Date().toLocaleDateString().split('/').reverse().join('_') +
    '_al_azhard_students_export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
};

let xlsxModulePromise;

const loadXlsxModule = async () => {
  if (typeof window === 'undefined') return null;
  if (!xlsxModulePromise) {
    xlsxModulePromise = import('xlsx');
  }
  try {
    return await xlsxModulePromise;
  } catch (err) {
    xlsxModulePromise = undefined;
    throw err;
  }
};

export const downloadExcel = async (array, options = {}) => {
  if (typeof window === 'undefined' || !Array.isArray(array) || !array.length) return;

  const normalizedOptions =
    typeof options === 'string' ? { sheetName: options } : options || {};

  const { sheetName = 'Export', filename, ...datasetOptions } = normalizedOptions;

  const dataset = prepareExportDataset(array, datasetOptions);
  if (!dataset.length) return;

  const xlsx = await loadXlsxModule();
  if (!xlsx) return;

  const utils = xlsx.utils ?? xlsx?.default?.utils;
  const writeFile = xlsx.writeFile ?? xlsx?.default?.writeFile;

  if (!utils || !writeFile) return;

  const worksheet = utils.json_to_sheet(dataset);
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31) || 'Sheet1');

  const defaultFilename =
    new Date().toLocaleDateString().split('/').reverse().join('_') +
    '_al_azhard_students_export.xlsx';

  const finalName = filename ?? defaultFilename;
  const sanitizedFilename = finalName.toLowerCase().endsWith('.xlsx')
    ? finalName
    : `${finalName}.xlsx`;

  writeFile(workbook, sanitizedFilename, { bookType: 'xlsx' });
};
