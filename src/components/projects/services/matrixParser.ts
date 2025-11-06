import * as XLSX from 'xlsx';

export interface MatrixParseResult {
  projects: Array<{
    code: string;
    name: string;
    status: string;
    fte: number;
    allocations: Record<string, number>; // person name -> hours/percentage
  }>;
  people: string[];
  dateRange?: string;
}

export class MatrixParser {
  static async parseMatrixFile(file: File): Promise<MatrixParseResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result;
          if (!fileData) {
            reject(new Error('Failed to read file data'));
            return;
          }
          
          const workbook = XLSX.read(fileData, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          // Find the date range row (usually first row with date pattern)
          let dateRange: string | undefined;
          let peopleRowIndex = -1;
          let dataStartIndex = -1;
          
          // Scan for key rows
          for (let i = 0; i < Math.min(20, jsonData.length); i++) {
            const firstCell = String(jsonData[i]?.[0] || '').trim();
            
            // Look for date range pattern
            if (!dateRange && /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(firstCell)) {
              dateRange = firstCell;
            }
            
            // Look for the people row (has "Status" and "FTE" followed by names)
            if (peopleRowIndex === -1 && firstCell.toLowerCase().includes('status')) {
              const secondCell = String(jsonData[i]?.[2] || '').trim();
              // Check if we have people names after FTE column
              if (secondCell && !secondCell.toLowerCase().includes('category')) {
                peopleRowIndex = i;
              }
            }
            
            // Find first project row (starts with project code pattern)
            if (dataStartIndex === -1 && /^\d+\.\d+/.test(firstCell)) {
              dataStartIndex = i;
              break;
            }
          }
          
          if (peopleRowIndex === -1 || dataStartIndex === -1) {
            reject(new Error('Could not detect matrix format. Please ensure the file has a header row with people names and project rows starting with codes.'));
            return;
          }
          
          // Extract people names (starting from column 3, after code/status/FTE)
          const peopleRow = jsonData[peopleRowIndex];
          const people: string[] = [];
          
          for (let colIndex = 3; colIndex < peopleRow.length; colIndex++) {
            const name = String(peopleRow[colIndex] || '').trim();
            if (name && name.length > 0 && !name.toLowerCase().includes('intern')) {
              people.push(name);
            }
          }
          
          // Extract project rows
          const projects: MatrixParseResult['projects'] = [];
          
          for (let rowIndex = dataStartIndex; rowIndex < jsonData.length; rowIndex++) {
            const row = jsonData[rowIndex];
            const firstCell = String(row[0] || '').trim();
            
            // Skip empty rows, category headers, or separator rows
            if (!firstCell || 
                firstCell.toLowerCase().includes('active projects') ||
                firstCell.toLowerCase().includes('enterprise') ||
                firstCell.toLowerCase().includes('category') ||
                firstCell === 'CATEGORY') {
              continue;
            }
            
            // Match project code pattern
            const match = firstCell.match(/^([\d.]+)\s+(.+)$/);
            if (!match) continue;
            
            const code = match[1].trim();
            const name = match[2].trim();
            const status = String(row[1] || 'Active').trim();
            const fteStr = String(row[2] || '0').trim();
            const fte = parseFloat(fteStr) || 0;
            
            // Extract allocations for each person
            const allocations: Record<string, number> = {};
            
            for (let personIndex = 0; personIndex < people.length; personIndex++) {
              const colIndex = 3 + personIndex;
              const cellValue = String(row[colIndex] || '').trim();
              
              if (cellValue) {
                // Parse percentage or hours
                let hours = 0;
                if (cellValue.includes('%')) {
                  // Convert percentage to hours (assume 40 hour week)
                  const percentage = parseFloat(cellValue.replace('%', '')) || 0;
                  hours = (percentage / 100) * 40;
                } else {
                  hours = parseFloat(cellValue) || 0;
                }
                
                if (hours > 0) {
                  allocations[people[personIndex]] = hours;
                }
              }
            }
            
            projects.push({ code, name, status, fte, allocations });
          }
          
          if (projects.length === 0) {
            reject(new Error('No valid project rows found in the matrix'));
            return;
          }
          
          resolve({ projects, people, dateRange });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  }
}
