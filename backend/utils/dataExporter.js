/**
 * Converts an array of objects into a CSV string.
 * Supports dot notation for nested fields (e.g. 'company.companyName')
 * @param {Object[]} data - Array of database records
 * @param {string[]} fields - Fields to include as CSV headers/columns
 * @returns {string} Fully formatted CSV file content
 */
export const jsonToCSV = (data, fields) => {
  if (!data || data.length === 0) return '';

  const headers = fields.map(f => `"${f.toUpperCase().replace(/\./g, '_')}"`).join(',');
  
  const rows = data.map(item => {
    return fields.map(field => {
      let value = item;
      
      if (field.includes('.')) {
        const parts = field.split('.');
        for (const part of parts) {
          value = value ? value[part] : undefined;
        }
      } else {
        value = item[field];
      }

      if (value === undefined || value === null) {
        return '""';
      }

      // Format Dates
      if (value instanceof Date) {
        value = value.toISOString();
      }

      let stringVal = String(value);
      // Escape double quotes
      stringVal = stringVal.replace(/"/g, '""');
      
      // Wrap all items in double quotes for excel safety
      return `"${stringVal}"`;
    }).join(',');
  });

  return [headers, ...rows].join('\r\n');
};
export default jsonToCSV;
