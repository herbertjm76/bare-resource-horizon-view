
import { supabase } from '@/integrations/supabase/client';
import { DataMapping } from './dataMapping';
import { ProjectValidation } from './validation';
import type { ImportResult } from './types';

export class ProjectImporter {
  static async importProjects(
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
        const projectData = DataMapping.mapRowToProject(row, columnMapping, companyId, offices || [], managers || []);
        const validationResult = ProjectValidation.validateProjectData(projectData, i + 2); // +2 for header and 0-index
        
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

  private static async insertProject(projectData: any): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .insert(projectData);

    if (error) {
      throw error;
    }
  }
}
