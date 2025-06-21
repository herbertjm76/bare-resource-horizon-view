
import type { ValidationResult, MappedProject } from './types';

export class ProjectValidation {
  static validateProjectData(
    projectData: MappedProject, 
    rowNumber: number,
    validationContext?: {
      offices?: Array<{ id: string; city: string; country: string }>;
      managers?: Array<{ id: string; first_name: string; last_name: string }>;
      validStatuses?: string[];
      validCurrencies?: string[];
    }
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Required field validation with specific error messages
      if (!projectData.code || projectData.code.trim().length === 0) {
        errors.push(`Row ${rowNumber}: Project code is required and cannot be empty`);
      } else if (projectData.code.length > 50) {
        errors.push(`Row ${rowNumber}: Project code cannot exceed 50 characters`);
      }

      if (!projectData.name || projectData.name.trim().length === 0) {
        errors.push(`Row ${rowNumber}: Project name is required and cannot be empty`);
      } else if (projectData.name.length > 200) {
        errors.push(`Row ${rowNumber}: Project name cannot exceed 200 characters`);
      }

      // Company ID validation
      if (!projectData.company_id) {
        errors.push(`Row ${rowNumber}: Company ID is missing - this is a system error`);
      }

      // Data type validation
      if (typeof projectData.target_profit_percentage === 'number') {
        if (projectData.target_profit_percentage < 0 || projectData.target_profit_percentage > 100) {
          errors.push(`Row ${rowNumber}: Target profit percentage must be between 0 and 100, got ${projectData.target_profit_percentage}`);
        }
      } else if (projectData.target_profit_percentage !== undefined) {
        errors.push(`Row ${rowNumber}: Target profit percentage must be a number`);
      }

      // Enhanced validation with context
      if (validationContext) {
        // Country and office validation
        if (projectData.country) {
          const normalizedCountry = projectData.country.toLowerCase().trim();
          
          // Check for "unknown" or similar placeholder values
          if (normalizedCountry === 'unknown' || normalizedCountry === 'n/a' || normalizedCountry === '') {
            warnings.push(`Row ${rowNumber}: Country marked as "Unknown" - project will be created without office assignment`);
            suggestions.push(`Row ${rowNumber}: Please update the country field with a valid country name`);
          } else {
            // Check if country exists in office locations
            const officeInCountry = validationContext.offices?.find(o => 
              o.country.toLowerCase().includes(normalizedCountry) ||
              normalizedCountry.includes(o.country.toLowerCase())
            );
            
            if (!officeInCountry && validationContext.offices && validationContext.offices.length > 0) {
              warnings.push(`Row ${rowNumber}: Country "${projectData.country}" not found in office locations`);
              suggestions.push(`Row ${rowNumber}: Available office countries: ${validationContext.offices.map(o => o.country).join(', ')}`);
            }
          }
        }

        // Office assignment validation
        if (!projectData.office_id) {
          warnings.push(`Row ${rowNumber}: No office assigned, will use default or create without office`);
          if (validationContext.offices && validationContext.offices.length > 0) {
            suggestions.push(`Row ${rowNumber}: Available offices: ${validationContext.offices.map(o => `${o.city}, ${o.country}`).join('; ')}`);
          }
        }

        // Manager validation with suggestions
        if (!projectData.project_manager_id) {
          warnings.push(`Row ${rowNumber}: No project manager assigned`);
          if (validationContext.managers && validationContext.managers.length > 0) {
            const managerNames = validationContext.managers
              .slice(0, 3)
              .map(m => `${m.first_name} ${m.last_name}`)
              .join(', ');
            suggestions.push(`Row ${rowNumber}: Available managers: ${managerNames}${validationContext.managers.length > 3 ? ` and ${validationContext.managers.length - 3} more` : ''}`);
          }
        }

        // Status validation
        if (projectData.status && validationContext.validStatuses && !validationContext.validStatuses.includes(projectData.status)) {
          const suggestion = this.findClosestMatch(projectData.status, validationContext.validStatuses);
          warnings.push(`Row ${rowNumber}: Status "${projectData.status}" is not a standard status`);
          if (suggestion) {
            suggestions.push(`Row ${rowNumber}: Did you mean "${suggestion}"? Valid statuses: ${validationContext.validStatuses.join(', ')}`);
          }
        }

        // Currency validation
        if (projectData.currency && validationContext.validCurrencies && !validationContext.validCurrencies.includes(projectData.currency)) {
          warnings.push(`Row ${rowNumber}: Currency "${projectData.currency}" is not commonly used`);
          suggestions.push(`Row ${rowNumber}: Common currencies: ${validationContext.validCurrencies.slice(0, 5).join(', ')}`);
        }
      }

      // Additional data quality checks
      if (projectData.code && projectData.name && projectData.code.toLowerCase() === projectData.name.toLowerCase()) {
        warnings.push(`Row ${rowNumber}: Project code and name are identical - consider using more descriptive names`);
      }

      // Check for potentially truncated data
      if (projectData.name && projectData.name.length === 255) {
        warnings.push(`Row ${rowNumber}: Project name may have been truncated at 255 characters`);
      }

    } catch (error) {
      errors.push(`Row ${rowNumber}: Validation error - ${error instanceof Error ? error.message : 'Unknown validation error'}`);
    }

    return { errors, warnings, suggestions };
  }

  private static findClosestMatch(input: string, validOptions: string[]): string | null {
    const inputLower = input.toLowerCase();
    
    // Exact match first
    const exactMatch = validOptions.find(option => option.toLowerCase() === inputLower);
    if (exactMatch) return exactMatch;

    // Partial match
    const partialMatch = validOptions.find(option => 
      option.toLowerCase().includes(inputLower) || inputLower.includes(option.toLowerCase())
    );
    
    return partialMatch || null;
  }
}
