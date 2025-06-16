
import type { MappedProject } from './types';

export class DataMapping {
  static mapRowToProject(
    row: any[], 
    columnMapping: Record<string, string>, 
    companyId: string,
    offices: any[],
    managers: any[]
  ): MappedProject {
    const project: MappedProject = {
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
            (project as any)[projectField] = String(value).trim();
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

  private static parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }

  private static mapStatus(value: any): string {
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
}
