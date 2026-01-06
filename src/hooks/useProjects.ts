/**
 * @fileoverview Projects data hook
 * 
 * React Query hook for fetching and caching project data with proper
 * company context handling and sorting options.
 * 
 * @module hooks/useProjects
 * 
 * @example
 * ```ts
 * import { useProjects } from '@/hooks/useProjects';
 * 
 * function ProjectList() {
 *   const { projects, isLoading, error, refetch } = useProjects('name', 'asc');
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *   
 *   return (
 *     <ul>
 *       {projects.map(p => <li key={p.id}>{p.name}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_PROJECTS, DEMO_TEAM_MEMBERS } from '@/data/demoData';
import { logger } from '@/utils/logger';
import type { Database } from '@/integrations/supabase/types';

/** Project row type from database with relations */
type ProjectRow = Database['public']['Tables']['projects']['Row'];

/** Extended project type with joined relations */
export interface ProjectWithRelations {
  id: string;
  name: string;
  code: string;
  status: string;
  country: string;
  department: string | null;
  current_stage: string;
  stages: string[] | null;

  // May be returned as null/undefined depending on permissions & query shape
  currency?: string | null;
  target_profit_percentage?: number | null;

  // IDs are always available from the projects table / secure RPC
  project_manager_id?: string | null;
  office_id?: string | null;

  // Optional financial fields (may be masked for non-admins in get_projects_secure)
  budget_amount?: number | null;
  budget_hours?: number | null;
  consumed_hours?: number | null;
  average_rate?: number | null;
  blended_rate?: number | null;
  financial_status?: string | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;

  // Relations may be omitted for users who don't have permission to read related tables
  project_manager?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  office?: {
    id: string;
    name: string;
    country: string;
  } | null;
}

/**
 * Available sort fields for projects
 * - 'name': Sort alphabetically by project name
 * - 'code': Sort by project code
 * - 'status': Sort by project status
 * - 'created': Sort by creation date
 */
export type ProjectSortBy = 'name' | 'code' | 'status' | 'created';

/**
 * Hook return type with projects data and loading states
 */
interface UseProjectsResult {
  /** Array of project records (empty array if loading or no projects) */
  projects: ProjectWithRelations[];
  /** True while data is being fetched */
  isLoading: boolean;
  /** Error object if fetch failed, null otherwise */
  error: Error | null;
  /** Function to manually refetch projects */
  refetch: () => void;
}

/**
 * Fetches projects for the current company with sorting and caching
 * 
 * This hook:
 * - Waits for company context to be ready before fetching
 * - Caches results using React Query
 * - Includes related data (project manager, office)
 * - Handles loading and error states properly
 * 
 * @param sortBy - Field to sort by (default: 'created')
 * @param sortDirection - Sort direction: 'asc' or 'desc' (default: 'asc')
 * @returns {UseProjectsResult} Projects data, loading state, and error
 * 
 * @example
 * ```ts
 * // Sort by name ascending
 * const { projects } = useProjects('name', 'asc');
 * 
 * // Sort by creation date descending (newest first)
 * const { projects } = useProjects('created', 'desc');
 * 
 * // Manual refetch after mutation
 * const { refetch } = useProjects();
 * await createProject(data);
 * refetch();
 * ```
 */
export const useProjects = (
  sortBy: ProjectSortBy = 'created', 
  sortDirection: 'asc' | 'desc' = 'asc',
  options?: { enabled?: boolean }
): UseProjectsResult => {
  const { isDemoMode } = useDemoAuth();
  const { companyId, isReady, isLoading: companyLoading, error: companyError } = useCompanyId();
  
  const { data: projects, isLoading: queryLoading, error, refetch } = useQuery({
    queryKey: ['projects', companyId, sortBy, sortDirection, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        const demoProjectsWithRelations: ProjectWithRelations[] = DEMO_PROJECTS.map(p => {
          const manager = DEMO_TEAM_MEMBERS.find(m => m.id === p.project_manager_id);
          return {
            id: p.id,
            name: p.name,
            code: p.code,
            status: p.status,
            country: p.country,
            department: p.department || null,
            target_profit_percentage: 25,
            current_stage: p.current_stage,
            stages: p.stages || null,
            currency: p.currency || null,
            project_manager: manager ? {
              id: manager.id,
              first_name: manager.first_name,
              last_name: manager.last_name,
              avatar_url: manager.avatar_url
            } : null,
            office: {
              id: p.office_id,
              name: p.department || 'Main Office',
              country: p.country
            }
          };
        });
        return demoProjectsWithRelations;
      }

      // Safety check - should never happen if enabled is correct
      if (!companyId) {
        logger.warn('useProjects: queryFn called without companyId');
        return [];
      }

      logger.log('useProjects: Fetching projects for company:', companyId);

      try {
        // Use SECURITY DEFINER RPC to avoid RLS failures on joins (profiles/offices)
        const { data, error } = await supabase.rpc('get_projects_secure', {
          p_company_id: companyId
        });

        if (error) {
          // Enhanced error logging for debugging
          logger.error('useProjects: Error fetching projects (rpc:get_projects_secure):', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            companyId,
            route: window.location.pathname
          });

          if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
            toast.error('Session expired. Please sign in again.');
          } else if (error.code === '42501' || error.message?.includes('permission denied')) {
            toast.error('Access denied. Please contact your administrator.');
          } else {
            toast.error(`Failed to load projects: ${error.message || 'Unknown error'}`);
          }

          throw error;
        }

        const projects = (data || []) as unknown as ProjectWithRelations[];

        // Client-side sorting (RPC doesn't guarantee order)
        const ascending = sortDirection === 'asc';
        const sorted = [...projects].sort((a, b) => {
          const dir = ascending ? 1 : -1;

          const safe = (v: unknown) => (v ?? '') as any;

          switch (sortBy) {
            case 'code':
              return String(safe(a.code)).localeCompare(String(safe(b.code))) * dir;
            case 'status':
              return String(safe(a.status)).localeCompare(String(safe(b.status))) * dir;
            case 'created':
              // created_at isn't returned by RPC; keep stable order
              return String(safe(a.id)).localeCompare(String(safe(b.id)));
            case 'name':
            default:
              return String(safe(a.name)).localeCompare(String(safe(b.name))) * dir;
          }
        });

        logger.log('useProjects: Fetched', sorted.length, 'projects');
        return sorted;
      } catch (err: any) {
        logger.error('useProjects: Exception:', {
          message: err?.message,
          companyId,
          route: window.location.pathname
        });
        throw err;
      }
    },
    // Enable in demo mode OR when company context is ready, but allow caller to override
    enabled: options?.enabled ?? (isDemoMode || isReady),
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: !isDemoMode,
    staleTime: isDemoMode ? Infinity : 0,
    // Keep previous data while refetching to prevent flicker
    placeholderData: (previousData) => previousData,
  });

  // Determine proper loading state
  const isLoading = isDemoMode ? false : (companyLoading || (isReady && queryLoading));

  return {
    projects: projects || [],
    isLoading,
    error: isDemoMode ? null : (error || (companyError ? new Error(companyError) : null)),
    refetch
  };
};
