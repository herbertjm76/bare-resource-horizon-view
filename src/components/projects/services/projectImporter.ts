
import { supabase } from '@/integrations/supabase/client';
import { DataMapping } from './dataMapping';
import { ProjectValidation } from './validation';
import type { ImportResult, ValidationContext } from './types';

export class ProjectImporter {
  static async importProjects(
    data: any[], 
    columnMapping: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
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

    // Get validation context data
    const validationContext = await this.getValidationContext(companyId);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      onProgress?.((i / total) * 100);

      try {
        const projectData = DataMapping.mapRowToProject(
          row, 
          columnMapping, 
          companyId, 
          validationContext.offices, 
          validationContext.managers
        );
        
        const validationResult = ProjectValidation.validateProjectData(
          projectData, 
          i + 2, // +2 for header and 0-index
          validationContext
        );
        
        if (validationResult.errors.length > 0) {
          errors.push(...validationResult.errors);
          continue;
        }

        if (validationResult.warnings.length > 0) {
          warnings.push(...validationResult.warnings);
        }

        if (validationResult.suggestions && validationResult.suggestions.length > 0) {
          suggestions.push(...validationResult.suggestions);
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
      warnings,
      suggestions
    };
  }

  private static async getValidationContext(companyId: string): Promise<ValidationContext> {
    // Get office data for mapping
    const { data: offices } = await supabase
      .from('office_locations')
      .select('id, city, country')
      .eq('company_id', companyId);

    // Get manager data for mapping
    const { data: managers } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('company_id', companyId)
      .in('role', ['owner', 'admin', 'member']);

    // Define valid statuses and currencies
    const validStatuses = ['Planning', 'In Progress', 'On Hold', 'Complete', 'Cancelled'];
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];

    return {
      offices: offices || [],
      managers: managers || [],
      validStatuses,
      validCurrencies
    };
  }

  private static async insertProject(projectData: any): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .insert(projectData);

    if (error) {
      throw error;
    }
  }
}
