
import { utils, write } from 'xlsx';
import { formatWeekKey } from '../utils';
import { saveAs } from 'file-saver';

/**
 * Get all team members and their allocations from the table
 */
const getTableData = (): { headers: string[], data: any[][] } => {
  // Get the table element
  const table = document.querySelector('.weekly-table') as HTMLTableElement;
  if (!table) {
    throw new Error('Table not found');
  }

  // Get headers
  const headerRow = table.querySelector('thead tr') as HTMLTableRowElement;
  const headers: string[] = [];
  
  if (headerRow) {
    Array.from(headerRow.cells).forEach(cell => {
      // Get header text or tooltip content
      let headerText = '';
      const tooltipTrigger = cell.querySelector('[data-state="closed"]');
      if (tooltipTrigger) {
        headerText = tooltipTrigger.textContent || '';
      } else {
        headerText = cell.textContent || '';
      }
      headers.push(headerText.trim());
    });
  }

  // Get data rows
  const tableBody = table.querySelector('tbody') as HTMLTableSectionElement;
  const data: any[][] = [];
  
  if (tableBody) {
    Array.from(tableBody.rows).forEach(row => {
      const rowData: any[] = [];
      Array.from(row.cells).forEach(cell => {
        // For editable cells, get the input value
        const input = cell.querySelector('input');
        if (input) {
          rowData.push(input.value);
        } else {
          // For regular cells, get the text content
          rowData.push(cell.textContent || '');
        }
      });
      data.push(rowData);
    });
  }

  return { headers, data };
};

/**
 * Export the weekly allocations table to Excel
 */
export const exportToExcel = async (selectedWeek: Date, weekLabel: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Get company name or use default
      const companyName = document.querySelector('.company-name')?.textContent || 'Team';
      
      // Get table data
      const { headers, data } = getTableData();
      
      // Create workbook and worksheet
      const wb = utils.book_new();
      const ws = utils.aoa_to_sheet([headers, ...data]);
      
      // Add title information
      ws['!rows'] = [{ hpt: 25 }]; // Increase height of the first row
      
      // Auto-size columns
      const colWidths = headers.map((header, index) => {
        // Calculate the maximum width needed for this column
        const maxWidth = Math.max(
          header.length,
          ...data.map(row => String(row[index] || '').length)
        );
        return Math.min(Math.max(10, maxWidth + 2), 50); // Min 10, max 50 chars
      });
      
      ws['!cols'] = colWidths.map(width => ({ wch: width }));
      
      // Add the worksheet to the workbook
      utils.book_append_sheet(wb, ws, "Weekly Overview");
      
      // Generate file name based on the week start date
      const weekStart = formatWeekKey(selectedWeek);
      const fileName = `Weekly_Overview_${weekStart}.xlsx`;
      
      // Generate binary string and create Blob
      const wbout = write(wb, { bookType: 'xlsx', type: 'binary' });
      const buf = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
      }
      
      // Create Blob and save file
      const blob = new Blob([buf], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
      
      resolve();
    } catch (error) {
      console.error('Error generating Excel:', error);
      reject(error);
    }
  });
};
