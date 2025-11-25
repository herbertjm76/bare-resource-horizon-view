
import type { MappedTeamMember } from './types';

export class TeamDataMapping {
  static mapRowToTeamMember(
    row: any[], 
    columnMapping: Record<string, string>,
    companyId: string,
    practiceAreas?: any[]
  ): MappedTeamMember {
    const member: Partial<MappedTeamMember> = {
      company_id: companyId,
      invitation_type: 'pre_registered',
      status: 'pending',
      code: this.generateCode()
    };

    // Map fields based on column mapping
    Object.entries(columnMapping).forEach(([columnIndex, fieldName]) => {
      const value = row[parseInt(columnIndex)];
      
      if (value === null || value === undefined || value === '') {
        return;
      }

      switch (fieldName) {
        case 'first_name':
          member.first_name = String(value).trim();
          break;
        case 'last_name':
          member.last_name = String(value).trim();
          break;
        case 'email':
          member.email = String(value).trim().toLowerCase();
          break;
        case 'job_title':
          member.job_title = String(value).trim();
          break;
        case 'department':
          member.department = String(value).trim();
          break;
        case 'location':
          member.location = String(value).trim();
          break;
        case 'weekly_capacity':
          member.weekly_capacity = this.parseNumber(value);
          break;
        case 'role':
          member.role = String(value).trim();
          break;
        case 'practice_area':
          // Handle practice area with fuzzy matching
          if (practiceAreas && practiceAreas.length > 0) {
            const areaName = String(value).toLowerCase().trim();
            const matchedArea = practiceAreas.find(pa => {
              const name = pa.name.toLowerCase();
              return name === areaName ||
                     name.includes(areaName) ||
                     areaName.includes(name);
            });
            if (matchedArea) {
              member.practice_area = matchedArea.name;
            }
          }
          break;
      }
    });

    // Set default values for required fields
    if (!member.first_name) {
      member.first_name = 'Unknown';
    }
    // Don't set default for last_name - allow it to be empty
    if (!member.weekly_capacity) {
      member.weekly_capacity = 40;
    }

    return member as MappedTeamMember;
  }

  private static parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    const numStr = String(value).replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(numStr);
    return isNaN(parsed) ? 40 : parsed;
  }

  private static generateCode(): string {
    return `PRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
