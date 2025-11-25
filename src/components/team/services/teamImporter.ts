
import { supabase } from '@/integrations/supabase/client';
import { TeamDataMapping } from './teamDataMapping';
import type { ImportResult } from './types';

export class TeamImporter {
  static async importTeamMembers(
    data: any[], 
    columnMapping: Record<string, string>,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      failed: 0,
      errors: [],
      warnings: [],
      suggestions: []
    };

    try {
      // Get current user's company
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const companyId = profile.company_id;
      
      // Fetch practice areas for matching
      const { data: practiceAreas } = await supabase
        .from('office_practice_areas')
        .select('id, name')
        .eq('company_id', companyId);
      
      const totalRows = data.length;
      
      // Process each row
      for (let i = 0; i < totalRows; i++) {
        try {
          const row = data[i];
          const memberData = TeamDataMapping.mapRowToTeamMember(
            row, 
            columnMapping, 
            companyId,
            practiceAreas || undefined
          );

          // Check if email already exists (if provided)
          if (memberData.email) {
            const { data: existing } = await supabase
              .from('invites')
              .select('id')
              .eq('company_id', companyId)
              .eq('email', memberData.email)
              .single();

            if (existing) {
              result.warnings.push(`Row ${i + 1}: Email ${memberData.email} already exists, skipped`);
              result.failed++;
              continue;
            }
          }

          // Insert team member as pre-registered invite
          const { error } = await supabase
            .from('invites')
            .insert({
              ...memberData,
              created_by: user.id
            });

          if (error) {
            result.errors.push(`Row ${i + 1}: ${error.message}`);
            result.failed++;
          } else {
            result.imported++;
          }
        } catch (error) {
          result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.failed++;
        }

        // Update progress
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalRows) * 100));
        }
      }

      result.success = result.imported > 0;
      
      if (result.imported > 0) {
        result.suggestions.push(`Successfully imported ${result.imported} team member(s)`);
      }
      if (result.failed > 0) {
        result.suggestions.push(`${result.failed} row(s) failed to import`);
      }

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.success = false;
    }

    return result;
  }
}
