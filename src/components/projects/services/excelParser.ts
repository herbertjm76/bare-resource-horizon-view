
import * as XLSX from 'xlsx';
import type { ExcelParseResult } from './types';

export class ExcelParser {
  static async parseExcelFile(file: File): Promise<ExcelParseResult> {
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
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          // Detect matrix format: look for project codes in first column
          let startRowIndex = 0;
          let isMatrixFormat = false;
          
          // Check if first column contains project codes (pattern: numbers.numbers)
          for (let i = 0; i < Math.min(10, jsonData.length); i++) {
            const firstCell = String(jsonData[i]?.[0] || '').trim();
            if (/^\d+\.\d+/.test(firstCell)) {
              isMatrixFormat = true;
              startRowIndex = i;
              break;
            }
          }
          
          let headers: string[];
          let rows: any[][];
          
          if (isMatrixFormat) {
            // For matrix format, use column indices as headers
            const maxColumns = Math.max(...jsonData.map(row => row?.length || 0));
            headers = Array.from({ length: maxColumns }, (_, i) => `Column ${i}`);
            
            // Start from the row where project codes begin
            rows = jsonData.slice(startRowIndex).filter(row => {
              const firstCell = String(row?.[0] || '').trim();
              // Only include rows that start with project codes or are data rows
              return Array.isArray(row) && 
                     row.some(cell => cell !== null && cell !== undefined && cell !== '') &&
                     firstCell !== '' &&
                     firstCell !== 'ACTIVE PROJECTS' &&
                     firstCell !== 'Enterprise' &&
                     firstCell !== 'CATEGORY';
            }) as any[][];
          } else {
            // Standard format: first row is headers
            headers = jsonData[0] as string[];
            rows = jsonData.slice(1).filter(row => 
              Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
            ) as any[][];
          }
          
          resolve({ 
            headers, 
            data: rows,
            rowCount: rows.length
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  }
}
