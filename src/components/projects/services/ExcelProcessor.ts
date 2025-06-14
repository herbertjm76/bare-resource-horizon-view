
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface ExcelParseResult {
  data: any[];
  headers: string[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  errors: string[];
}

export class ExcelProcessor {
  async parseExcelFile(file: File): Promise<ExcelParseResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          const headers = jsonData[0] as string[];
          const data = jsonData.slice(1).filter(row => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          
          resolve({ headers, data });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  }

  async importProjects(
    data: any[], 
    columnMapping: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    const errors: string[] = [];
    let successCount = 0;
    const total = data.length;

    // Get company ID from context (we'll need to pass this in)
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!profile?.company_id) {
      throw new Error('No company found for user');
    }

    const companyId = profile.company_id;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      onProgress?.((i / total) * 100);

      try {
        const projectData = this.mapRowToProject(row, columnMapping, companyId);
        const validationErrors = this.validateProjectData(projectData, i + 2); // +2 for header and 0-index
        
        if (validationErrors.length > 0) {
          errors.push(...validationErrors);
          continue;
        }

        await this.insertProject(projectData);
        successCount++;
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    onProgress?.(100);

    return {
      success: errors.length === 0,
      successCount,
      errors
    };
  }

  private mapRowToProject(row: any[], columnMapping: Record<string, string>, companyId: string) {
    const project: any = {
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Map required fields
    Object.entries(columnMapping).forEach(([excelColumn, projectField]) => {
      const columnIndex = parseInt(excelColumn);
      const value = row[columnIndex];
      
      if (value !== undefined && value !== null && value !== '') {
        switch (projectField) {
          case 'target_profit_percentage':
            project[projectField] = this.parseNumber(value);
            break;
          case 'status':
            project[projectField] = this.mapStatus(value);
            break;
          default:
            project[projectField] = String(value).trim();
        }
      }
    });

    // Set default values for required fields
    if (!project.code) project.code = `PROJ-${Date.now()}`;
    if (!project.name) project.name = 'Imported Project';
    if (!project.current_stage) project.current_stage = 'Planning';
    if (!project.country) project.country = 'Unknown';
    if (!project.target_profit_percentage) project.target_profit_percentage = 0;
    if (!project.status) project.status = 'Planning';

    return project;
  }

  private validateProjectData(projectData: any, rowNumber: number): string[] {
    const errors: string[] = [];

    if (!projectData.code || projectData.code.length === 0) {
      errors.push(`Row ${rowNumber}: Project code is required`);
    }

    if (!projectData.name || projectData.name.length === 0) {
      errors.push(`Row ${rowNumber}: Project name is required`);
    }

    if (projectData.target_profit_percentage < 0 || projectData.target_profit_percentage > 100) {
      errors.push(`Row ${rowNumber}: Target profit percentage must be between 0 and 100`);
    }

    return errors;
  }

  private async insertProject(projectData: any): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .insert(projectData);

    if (error) {
      throw error;
    }
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }

  private mapStatus(value: any): string {
    const statusMap: Record<string, string> = {
      'planning': 'Planning',
      'in progress': 'In Progress',
      'complete': 'Complete',
      'on hold': 'On Hold',
      'cancelled': 'Cancelled'
    };

    const normalized = String(value).toLowerCase().trim();
    return statusMap[normalized] || 'Planning';
  }
}
