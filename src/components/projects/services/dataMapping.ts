
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

    try {
      // Map fields based on column mapping
      Object.entries(columnMapping).forEach(([excelColumnIndex, projectField]) => {
        const columnIndex = parseInt(excelColumnIndex);
        const rawValue = row[columnIndex];
        
        // Skip null, undefined, or empty string values
        if (rawValue === undefined || rawValue === null || rawValue === '') {
          return;
        }

        const value = String(rawValue).trim();
        if (value === '') return;

        switch (projectField) {
          case 'target_profit_percentage':
            const numValue = this.parseNumber(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
              project[projectField] = numValue;
            }
            break;
          case 'status':
            project[projectField] = this.mapStatus(value);
            break;
          case 'project_manager_name':
            // Only attempt mapping if managers are available
            if (managers && managers.length > 0) {
              const managerName = value.toLowerCase();
              const manager = managers.find(m => {
                const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
                const firstName = m.first_name.toLowerCase();
                const lastName = m.last_name.toLowerCase();
                
                return fullName === managerName ||
                       fullName.includes(managerName) ||
                       managerName.includes(firstName) ||
                       managerName.includes(lastName) ||
                       firstName.startsWith(managerName) ||
                       lastName.startsWith(managerName);
              });
              if (manager) {
                project.project_manager_id = manager.id;
              }
            }
            break;
          case 'office_name':
            // Only attempt mapping if offices are available
            if (offices && offices.length > 0) {
              const officeName = value.toLowerCase();
              const office = offices.find(o => {
                const city = o.city.toLowerCase();
                const country = o.country.toLowerCase();
                
                return city === officeName ||
                       country === officeName ||
                       city.includes(officeName) ||
                       country.includes(officeName) ||
                       officeName.includes(city) ||
                       officeName.includes(country);
              });
              if (office) {
                project.temp_office_location_id = office.id;
                project.country = office.country;
              }
            }
            break;
          case 'country':
            // Accept any country value, validation will handle it
            const normalizedCountry = value.toLowerCase();
            if (normalizedCountry !== 'unknown' && normalizedCountry !== 'n/a' && normalizedCountry !== 'tbd') {
              project.country = value;
            }
            break;
          case 'currency':
            // Accept any 3-letter currency code
            const currencyCode = value.toUpperCase();
            if (currencyCode.length === 3 && /^[A-Z]{3}$/.test(currencyCode)) {
              project.currency = currencyCode;
            }
            break;
          default:
            // Handle other string fields
            if (typeof projectField === 'string') {
              (project as any)[projectField] = value;
            }
        }
      });

      // Set smart defaults for required fields only if not provided
      if (!project.code) {
        project.code = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      }
      
      if (!project.name) {
        project.name = project.code || 'Imported Project';
      }

      // Set safe defaults for other required database fields
      if (!project.status) {
        project.status = 'Planning';
      }
      
      if (!project.current_stage) {
        project.current_stage = 'Planning';
      }
      
      // Only set default profit percentage if not provided
      if (project.target_profit_percentage === undefined) {
        project.target_profit_percentage = 15;
      }
      
      // Only set default currency if not provided
      if (!project.currency) {
        project.currency = 'USD';
      }

      // Handle country - set default if not provided
      if (!project.country) {
        project.country = 'Unknown';
      }

    } catch (error) {
      console.error('Error mapping row to project:', error);
      throw new Error(`Failed to map data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return project;
  }

  private static parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    
    // Remove common non-numeric characters but preserve decimal points and negative signs
    const cleanValue = String(value).replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleanValue);
    
    return isNaN(parsed) ? 0 : parsed;
  }

  private static mapStatus(value: any): string {
    const statusMap: Record<string, string> = {
      'planning': 'Planning',
      'plan': 'Planning',
      'planned': 'Planning',
      'in progress': 'In Progress',
      'in-progress': 'In Progress',
      'inprogress': 'In Progress',
      'active': 'In Progress',
      'ongoing': 'In Progress',
      'current': 'In Progress',
      'complete': 'Complete',
      'completed': 'Complete',
      'finished': 'Complete',
      'done': 'Complete',
      'closed': 'Complete',
      'on hold': 'On Hold',
      'on-hold': 'On Hold',
      'onhold': 'On Hold',
      'paused': 'On Hold',
      'suspended': 'On Hold',
      'cancelled': 'Cancelled',
      'canceled': 'Cancelled',
      'terminated': 'Cancelled',
      'stopped': 'Cancelled'
    };

    const normalized = String(value).toLowerCase().trim();
    return statusMap[normalized] || 'Planning';
  }
}
