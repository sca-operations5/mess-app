
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function exportToCSV(data, filename, filterDate = null) {
  let filteredData = data;

  if (filterDate && Array.isArray(data)) {
    const dateString = format(filterDate, 'yyyy-MM-dd');
    filteredData = data.filter(item => item.date === dateString);
  }

  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    console.error("No data available for the selected criteria.");
    // Optionally show a toast message to the user
    return false; // Indicate that no file was generated
  }

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const finalFilename = filterDate
    ? `${filename}_${format(filterDate, 'yyyy-MM-dd')}.xlsx`
    : `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
  return true; // Indicate success
}
  