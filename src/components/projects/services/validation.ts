
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

    // Enhanced validation with suggestions
    if (validationContext) {
      // Office validation with suggestions
      if (!projectData.office_id && projectData.country) {
        const countrySuggestions = validationContext.offices?.filter(o => 
          o.country.toLowerCase().includes(projectData.country!.toLowerCase())
        );
        
        if (countrySuggestions && countrySuggestions.length > 0) {
          suggestions.push(`Row ${rowNumber}: Consider mapping to office: ${countrySuggestions[0].city}, ${countrySuggestions[0].country}`);
        } else {
          warnings.push(`Row ${rowNumber}: Country "${projectData.country}" not found in office locations`);
          suggestions.push(`Row ${rowNumber}: Will create new office entry for "${projectData.country}"`);
        }
      }

      // Manager validation with suggestions
      if (!projectData.project_manager_id && projectData.country) {
        const managerSuggestions = validationContext.managers?.slice(0, 3);
        if (managerSuggestions && managerSuggestions.length > 0) {
          suggestions.push(`Row ${rowNumber}: Available managers: ${managerSuggestions.map(m => `${m.first_name} ${m.last_name}`).join(', ')}`);
        }
      }

      // Status validation
      if (projectData.status && validationContext.validStatuses && !validationContext.validStatuses.includes(projectData.status)) {
        warnings.push(`Row ${rowNumber}: Status "${projectData.status}" is not a standard status`);
        const statusSuggestion = this.findClosestMatch(projectData.status, validationContext.validStatuses);
        if (statusSuggestion) {
          suggestions.push(`Row ${rowNumber}: Did you mean "${statusSuggestion}"?`);
        }
      }

      // Currency validation
      if (projectData.currency && validationContext.validCurrencies && !validationContext.validCurrencies.includes(projectData.currency)) {
        warnings.push(`Row ${rowNumber}: Currency "${projectData.currency}" is not commonly used`);
        suggestions.push(`Row ${rowNumber}: Common currencies: USD, EUR, GBP`);
      }
    }

    // Standard warnings for missing optional but important fields
    if (!projectData.office_id) {
      warnings.push(`Row ${rowNumber}: No office assigned, will use default`);
    }

    if (!projectData.project_manager_id) {
      warnings.push(`Row ${rowNumber}: No project manager assigned`);
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
