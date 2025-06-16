
import type { ValidationResult } from './types';

export class ProjectValidation {
  static validateProjectData(projectData: any, rowNumber: number): ValidationResult {
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
}
