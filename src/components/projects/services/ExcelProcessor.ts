
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export interface ExcelParseResult {
  data: any[];
  headers: string[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  errors: string[];
  warnings: string[];
}

export class ExcelProcessor {
  async parseExcelFile(file: File): Promise<ExcelParseResult> {
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
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1).filter(row => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          
          resolve({ headers, data: rows });
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
    const warnings: string[] = [];
    let successCount = 0;
    const total = data.length;

    // Get company ID from context
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!profile?.company_id) {
      throw new Error('No company found for user');
    }

    const companyId = profile.company_id;

    // Get office data for mapping
    const { data: offices } = await supabase
      .from('office_locations')
      .select('*')
      .eq('company_id', companyId);

    // Get manager data for mapping
    const { data: managers } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('company_id', companyId)
      .in('role', ['owner', 'admin', 'member']);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      onProgress?.((i / total) * 100);

      try {
        const projectData = this.mapRowToProject(row, columnMapping, companyId, offices || [], managers || []);
        const validationResult = this.validateProjectData(projectData, i + 2); // +2 for header and 0-index
        
        if (validationResult.errors.length > 0) {
          errors.push(...validationResult.errors);
          continue;
        }

        if (validationResult.warnings.length > 0) {
          warnings.push(...validationResult.warnings);
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
      errors,
      warnings
    };
  }

  private mapRowToProject(
    row: any[], 
    columnMapping: Record<string, string>, 
    companyId: string,
    offices: any[],
    managers: any[]
  ) {
    const project: any = {
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Map fields based on column mapping
    Object.entries(columnMapping).forEach(([excelColumnIndex, projectField]) => {
      const columnIndex = parseInt(excelColumnIndex);
      const value = row[columnIndex];
      
      if (value !== undefined && value !== null && value !== '') {
        switch (projectField) {
          case 'target_profit_percentage':
            project[projectField] = this.parseNumber(value);
            break;
          case 'status':
            project[projectField] = this.mapStatus(value);
            break;
          case 'project_manager_name':
            // Map manager name to ID
            const managerName = String(value).trim().toLowerCase();
            const manager = managers.find(m => 
              `${m.first_name} ${m.last_name}`.toLowerCase().includes(managerName) ||
              managerName.includes(m.first_name.toLowerCase()) ||
              managerName.includes(m.last_name.toLowerCase())
            );
            if (manager) {
              project.project_manager_id = manager.id;
            }
            break;
          case 'office_name':
            // Map office name to ID
            const officeName = String(value).trim().toLowerCase();
            const office = offices.find(o => 
              o.city.toLowerCase().includes(officeName) ||
              o.country.toLowerCase().includes(officeName) ||
              officeName.includes(o.city.toLowerCase())
            );
            if (office) {
              project.office_id = office.id;
              project.country = office.country;
            }
            break;
          default:
            project[projectField] = String(value).trim();
        }
      }
    });

    // Set default values for required fields if not provided
    if (!project.code) project.code = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    if (!project.name) project.name = 'Imported Project';
    if (!project.current_stage) project.current_stage = 'Planning';
    if (!project.country && !project.office_id) project.country = 'Unknown';
    if (project.target_profit_percentage === undefined) project.target_profit_percentage = 0;
    if (!project.status) project.status = 'Planning';
    if (!project.currency) project.currency = 'USD';

    // If no office is mapped, try to find a default office for the country
    if (!project.office_id && project.country && project.country !== 'Unknown') {
      const defaultOffice = offices.find(o => o.country === project.country);
      if (defaultOffice) {
        project.office_id = defaultOffice.id;
      }
    }

    return project;
  }

  private validateProjectData(projectData: any, rowNumber: number): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!projectData.code || projectData.code.length === 0) {
      errors.push(`Row ${rowNumber}: Project code is required`);
    }

    if (!projectData.name || projectData.name.length === 0) {
      errors.push(`Row ${rowNumber}: Project name is required`);
    }

    // Data validation
    if (projectData.target_profit_percentage < 0 || projectData.target_profit_percentage > 100) {
      errors.push(`Row ${rowNumber}: Target profit percentage must be between 0 and 100`);
    }

    // Warnings for missing optional but important fields
    if (!projectData.office_id) {
      warnings.push(`Row ${rowNumber}: No office found for this project, using default`);
    }

    if (!projectData.project_manager_id) {
      warnings.push(`Row ${rowNumber}: No project manager assigned`);
    }

    return { errors, warnings };
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
      'in-progress': 'In Progress',
      'active': 'In Progress',
      'complete': 'Complete',
      'completed': 'Complete',
      'finished': 'Complete',
      'on hold': 'On Hold',
      'on-hold': 'On Hold',
      'paused': 'On Hold',
      'cancelled': 'Cancelled',
      'canceled': 'Cancelled'
    };

    const normalized = String(value).toLowerCase().trim();
    return statusMap[normalized] || 'Planning';
  }

  generateTemplate(): string {
    const headers = [
      'Project Code *',
      'Project Name *',
      'Status',
      'Country',
      'Target Profit %',
      'Currency',
      'Project Manager Name',
      'Office Name'
    ];

    const sampleData = [
      'PROJ-001',
      'Sample Project Alpha',
      'Planning',
      'United States',
      '15',
      'USD',
      'John Doe',
      'New York Office'
    ];

    return `${headers.join(',')}\n${sampleData.join(',')}`;
  }
}
