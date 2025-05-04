
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addDays, format } from 'date-fns';
import { formatWeekKey } from '../utils';

// Extend the jsPDF types
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
 * Export the weekly allocations table to PDF
 */
export const exportToPDF = async (selectedWeek: Date, weekLabel: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create new PDF document in landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Get company name or use default
      const companyName = document.querySelector('.company-name')?.textContent || 'Team';
      
      // Add header
      pdf.setFontSize(16);
      pdf.text(`${companyName} - Weekly Resource Overview`, 14, 15);
      
      pdf.setFontSize(12);
      pdf.text(weekLabel, 14, 22);
      
      // Add timestamp
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')}`, 14, 27);
      pdf.setTextColor(0, 0, 0);

      // Get table data
      const { headers, data } = getTableData();

      // Prepare the table configuration
      pdf.autoTable({
        startY: 32,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [110, 89, 165], // Matches brand color
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 250]
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Name column
          1: { cellWidth: 15 }, // Office column
          // Project columns can be adjusted as needed
        },
        margin: { top: 30 },
        didDrawPage: (data) => {
          // Add footer with page number
          const pageNumber = pdf.internal.getNumberOfPages();
          const totalPages = pageNumber;
          pdf.setFontSize(8);
          pdf.text(
            `Page ${pageNumber} of ${totalPages}`,
            pdf.internal.pageSize.width - 20,
            pdf.internal.pageSize.height - 10
          );
        }
      });

      // Generate file name based on the week start date
      const weekStart = formatWeekKey(selectedWeek);
      const fileName = `Weekly_Overview_${weekStart}.pdf`;

      // Save PDF
      pdf.save(fileName);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
