
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
      // Only validate essential required fields
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

      // Company ID validation (system requirement)
      if (!projectData.company_id) {
        errors.push(`Row ${rowNumber}: Company ID is missing - this is a system error`);
      }

      // Optional field validations - only validate if provided
      if (projectData.target_profit_percentage !== undefined) {
        if (typeof projectData.target_profit_percentage === 'number') {
          if (projectData.target_profit_percentage < 0 || projectData.target_profit_percentage > 100) {
            warnings.push(`Row ${rowNumber}: Target profit percentage should be between 0 and 100, got ${projectData.target_profit_percentage} - using default value`);
          }
        } else {
          warnings.push(`Row ${rowNumber}: Target profit percentage should be a number - using default value`);
        }
      }

      // Enhanced validation with context - all optional
      if (validationContext) {
        // Country validation - only if provided
        if (projectData.country) {
          const normalizedCountry = projectData.country.toLowerCase().trim();
          
          if (normalizedCountry === 'unknown' || normalizedCountry === 'n/a' || normalizedCountry === '') {
            suggestions.push(`Row ${rowNumber}: Country field can be updated later in project settings`);
          } else {
            // Check if country exists in office locations
            const officeInCountry = validationContext.offices?.find(o => 
              o.country.toLowerCase().includes(normalizedCountry) ||
              normalizedCountry.includes(o.country.toLowerCase())
            );
            
            if (!officeInCountry && validationContext.offices && validationContext.offices.length > 0) {
              suggestions.push(`Row ${rowNumber}: Country "${projectData.country}" not found in office locations - can be updated later`);
            }
          }
        }

        // Office assignment - informational only
        if (!projectData.office_id && validationContext.offices && validationContext.offices.length > 0) {
          suggestions.push(`Row ${rowNumber}: Office assignment can be set later in project settings`);
        }

        // Manager assignment - informational only
        if (!projectData.project_manager_id && validationContext.managers && validationContext.managers.length > 0) {
          suggestions.push(`Row ${rowNumber}: Project manager can be assigned later in project settings`);
        }

        // Status validation - only if provided
        if (projectData.status && validationContext.validStatuses && !validationContext.validStatuses.includes(projectData.status)) {
          const suggestion = this.findClosestMatch(projectData.status, validationContext.validStatuses);
          suggestions.push(`Row ${rowNumber}: Status "${projectData.status}" will use default - can be updated later${suggestion ? ` (Did you mean "${suggestion}"?)` : ''}`);
        }

        // Currency validation - only if provided
        if (projectData.currency && validationContext.validCurrencies && !validationContext.validCurrencies.includes(projectData.currency)) {
          suggestions.push(`Row ${rowNumber}: Currency "${projectData.currency}" will use USD default - can be updated later`);
        }
      }

      // Data quality suggestions - non-blocking
      if (projectData.code && projectData.name && projectData.code.toLowerCase() === projectData.name.toLowerCase()) {
        suggestions.push(`Row ${rowNumber}: Consider using more descriptive project names to differentiate from codes`);
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
