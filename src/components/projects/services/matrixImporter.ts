import { supabase } from '@/integrations/supabase/client';
import type { MatrixParseResult } from './matrixParser';
import type { ImportResult } from './types';

export class MatrixImporter {
  static async importMatrix(
    matrixData: MatrixParseResult,
    weekStartDate: string,
    onProgress?: (progress: number) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      successCount: 0,
      errors: [],
      warnings: [],
      suggestions: []
    };

    let failedCount = 0;

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

      // Get existing team members to match names
      const { data: teamMembers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('company_id', companyId);

      // Get existing invites (pre-registered members)
      const { data: invites } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email')
        .eq('company_id', companyId);

      // Get offices to assign a default office
      const { data: office } = await supabase
        .from('offices')
        .select('id')
        .limit(1)
        .maybeSingle();

      const defaultOfficeId = office?.id;
      if (!defaultOfficeId) {
        throw new Error('No office found. Please create at least one office first.');
      }

      const allPeople = [
        ...(teamMembers || []).map(m => ({ ...m, type: 'member' })),
        ...(invites || []).map(i => ({ ...i, type: 'invite' }))
      ];

      // Create a mapping of names to IDs
      const nameToId = new Map<string, string>();
      matrixData.people.forEach(personName => {
        const nameParts = personName.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        const match = allPeople.find(p => {
          const pFirstName = p.first_name?.toLowerCase() || '';
          const pLastName = p.last_name?.toLowerCase() || '';
          const fullName = `${pFirstName} ${pLastName}`.toLowerCase();
          const personFullName = personName.toLowerCase();

          return fullName === personFullName ||
                 pFirstName === firstName.toLowerCase() ||
                 (pLastName && pLastName === lastName.toLowerCase());
        });

        if (match) {
          nameToId.set(personName, match.id);
        } else {
          result.warnings.push(`Person "${personName}" not found in system. Allocations skipped.`);
        }
      });

      const totalProjects = matrixData.projects.length;
      
      // Process each project
      for (let i = 0; i < totalProjects; i++) {
        try {
          const project = matrixData.projects[i];

          // Check if project exists
          let projectId: string | null = null;
          const { data: existingProject } = await supabase
            .from('projects')
            .select('id')
            .eq('company_id', companyId)
            .eq('code', project.code)
            .maybeSingle();

          if (existingProject) {
            projectId = existingProject.id;
            result.warnings.push(`Project ${project.code} already exists. Updating allocations only.`);
          } else {
            // Create new project
            const statusMap: Record<string, "Planning" | "In Progress" | "On Hold" | "Complete"> = {
              'active': 'In Progress',
              'planning': 'Planning',
              'on hold': 'On Hold',
              'complete': 'Complete'
            };
            const mappedStatus = statusMap[project.status.toLowerCase()] || 'In Progress';
            
            const { data: newProject, error: projectError } = await supabase
              .from('projects')
              .insert([{
                code: project.code,
                name: project.name,
                company_id: companyId,
                office_id: defaultOfficeId,
                status: mappedStatus,
                current_stage: 'In Progress',
                target_profit_percentage: 15,
                currency: 'USD',
                country: 'Unknown'
              }])
              .select('id')
              .single();

            if (projectError) {
              result.errors.push(`Project ${project.code}: ${projectError.message}`);
              failedCount++;
              continue;
            }

            projectId = newProject.id;
            result.successCount++;
          }

          // Create allocations for this project
          let allocationsCreated = 0;
          for (const [personName, hours] of Object.entries(project.allocations)) {
            const resourceId = nameToId.get(personName);
            if (!resourceId) continue;

            // Check if allocation already exists
            const { data: existingAllocation } = await supabase
              .from('project_resource_allocations')
              .select('id')
              .eq('project_id', projectId)
              .eq('resource_id', resourceId)
              .eq('allocation_date', weekStartDate)
              .maybeSingle();

            if (existingAllocation) {
              // Update existing - use direct update since we have the specific ID
              // RULEBOOK: Matrix import is a bulk operation that uses direct DB access
              // but ensures proper resource_type and deduplication via unique constraint
              await supabase
                .from('project_resource_allocations')
                .update({ hours, resource_type: 'active' })
                .eq('id', existingAllocation.id);
            } else {
              // Create new - DB trigger will normalize allocation_date to week start
              // RULEBOOK: Matrix import uses direct insert with proper resource_type
              // Unique constraint prevents duplicates
              await supabase
                .from('project_resource_allocations')
                .insert({
                  company_id: companyId,
                  project_id: projectId,
                  resource_id: resourceId,
                  resource_type: 'active',
                  hours,
                  allocation_date: weekStartDate
                });
            }
            allocationsCreated++;
          }

          if (allocationsCreated > 0) {
            result.suggestions.push(`${project.code}: ${allocationsCreated} allocation(s) imported`);
          }

        } catch (error) {
          result.errors.push(`Project ${matrixData.projects[i].code}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedCount++;
        }

        // Update progress
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalProjects) * 100));
        }
      }

      result.success = result.successCount > 0 || result.warnings.length > 0;
      
      if (result.successCount > 0) {
        result.suggestions.unshift(`Successfully imported ${result.successCount} project(s)`);
      }
      if (failedCount > 0) {
        result.suggestions.push(`${failedCount} project(s) failed to import`);
      }
      if (nameToId.size < matrixData.people.length) {
        result.suggestions.push(`${matrixData.people.length - nameToId.size} people not found. Import team members first.`);
      }

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      result.success = false;
    }

    return result;
  }
}
