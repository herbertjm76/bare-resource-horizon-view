
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

    try {
      // Get company ID from context
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company found for user');
      }

      const companyId = profile.company_id;

      // Get validation context data
      const validationContext = await this.getValidationContext(companyId);

      // Ensure we have a default office for the company
      const defaultOfficeId = await this.ensureDefaultOffice(companyId);

      console.log(`Starting import of ${total} rows for company ${companyId} with default office ${defaultOfficeId}`);

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        onProgress?.((i / total) * 100);

        try {
          console.log(`Processing row ${i + 2}:`, row);

          const projectData = DataMapping.mapRowToProject(
            row, 
            columnMapping, 
            companyId, 
            validationContext.offices, 
            validationContext.managers
          );
          
          console.log(`Mapped project data for row ${i + 2}:`, projectData);
          
          const validationResult = ProjectValidation.validateProjectData(
            projectData, 
            i + 2, // +2 for header and 0-index conversion
            validationContext
          );
          
          if (validationResult.errors.length > 0) {
            console.log(`Validation errors for row ${i + 2}:`, validationResult.errors);
            errors.push(...validationResult.errors);
            continue;
          }

          if (validationResult.warnings.length > 0) {
            warnings.push(...validationResult.warnings);
          }

          if (validationResult.suggestions && validationResult.suggestions.length > 0) {
            suggestions.push(...validationResult.suggestions);
          }

          await this.insertProject(projectData, defaultOfficeId);
          successCount++;
          console.log(`Successfully inserted project for row ${i + 2}`);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error(`Error processing row ${i + 2}:`, error);
          errors.push(`Row ${i + 2}: ${errorMessage}`);
        }
      }

      onProgress?.(100);

      console.log(`Import completed. Success: ${successCount}, Errors: ${errors.length}, Warnings: ${warnings.length}`);

      return {
        success: errors.length === 0,
        successCount,
        errors,
        warnings,
        suggestions
      };

    } catch (error) {
      console.error('Import process failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Import process failed';
      errors.push(`Import failed: ${errorMessage}`);
      
      return {
        success: false,
        successCount: 0,
        errors,
        warnings,
        suggestions
      };
    }
  }

  private static async ensureDefaultOffice(companyId: string): Promise<string> {
    try {
      // First, try to get an existing office
      let { data: offices, error: officesError } = await supabase
        .from('offices')
        .select('id')
        .limit(1);

      if (officesError) {
        console.error('Error fetching offices:', officesError);
      }

      if (offices && offices.length > 0) {
        console.log('Using existing office:', offices[0].id);
        return offices[0].id;
      }

      // No offices exist, create a default one
      console.log('No offices found, creating default office');
      const { data: newOffice, error: createOfficeError } = await supabase
        .from('offices')
        .insert({
          name: 'Default Office',
          country: 'Unknown'
        })
        .select('id')
        .single();

      if (createOfficeError) {
        console.error('Error creating default office:', createOfficeError);
        throw new Error('Failed to create default office');
      }

      console.log('Created default office:', newOffice.id);
      return newOffice.id;

    } catch (error) {
      console.error('Error ensuring default office:', error);
      throw new Error(`Failed to setup default office: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async getValidationContext(companyId: string): Promise<ValidationContext> {
    try {
      console.log('Fetching validation context for company:', companyId);

      // Get office data for mapping
      const { data: offices, error: officesError } = await supabase
        .from('office_locations')
        .select('id, city, country')
        .eq('company_id', companyId);

      if (officesError) {
        console.error('Error fetching offices:', officesError);
      }

      // Get manager data for mapping
      const { data: managers, error: managersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('company_id', companyId);

      if (managersError) {
        console.error('Error fetching managers:', managersError);
      }

      // Define valid statuses and currencies
      const validStatuses = ['Planning', 'In Progress', 'On Hold', 'Complete', 'Cancelled'];
      const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];

      const context = {
        offices: offices || [],
        managers: managers || [],
        validStatuses,
        validCurrencies
      };

      console.log('Validation context:', context);
      return context;

    } catch (error) {
      console.error('Error getting validation context:', error);
      return {
        offices: [],
        managers: [],
        validStatuses: ['Planning', 'In Progress', 'On Hold', 'Complete', 'Cancelled'],
        validCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK']
      };
    }
  }

  private static async insertProject(projectData: any, defaultOfficeId: string): Promise<void> {
    try {
      console.log('Inserting project:', projectData);

      // Ensure office_id is set - use default if not already set
      const finalProjectData = {
        ...projectData,
        office_id: defaultOfficeId
      };

      console.log('Final project data with office_id:', finalProjectData);

      const { error } = await supabase
        .from('projects')
        .insert(finalProjectData);

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

    } catch (error) {
      console.error('Failed to insert project:', error);
      throw error;
    }
  }
}
