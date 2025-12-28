import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

export interface WorkflowProject {
  id: string;
  name: string;
  code: string;
  status: string;
  hasFee: boolean;
  hasProfit: boolean;
  profitMargin?: number;
  revenue?: number;
  missingFees: number;
}

export interface WorkflowMember {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending';
  isPending: boolean;
  role?: string;
  avatar_url?: string;
  inviteDate?: string;
}

export interface AllocationGap {
  month: string;
  totalHours: number;
  allocatedHours: number;
  availableHours: number;
  utilizationRate: number;
  isUnderAllocated: boolean;
}

export interface WorkflowHealthScore {
  projects: number;
  members: number;
  allocations: number;
  overall: number;
}

export interface WorkflowData {
  projects: WorkflowProject[];
  members: WorkflowMember[];
  allocationGaps: AllocationGap[];
  healthScore: WorkflowHealthScore;
  isLoading: boolean;
  projectsWithoutFees: WorkflowProject[];
  pendingMembers: WorkflowMember[];
  underAllocatedMonths: AllocationGap[];
}

export const useWorkflowData = (): WorkflowData => {
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<WorkflowProject[]>([]);
  const [members, setMembers] = useState<WorkflowMember[]>([]);
  const [allocationGaps, setAllocationGaps] = useState<AllocationGap[]>([]);

  useEffect(() => {
    if (!company?.id) return;
    fetchWorkflowData();
  }, [company?.id, workWeekHours]);

  const fetchWorkflowData = async () => {
    if (!company?.id) return;

    try {
      setIsLoading(true);

      // Fetch projects with stages/fees
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          code,
          status,
          project_stages(fee, stage_name),
          project_fees(fee)
        `)
        .eq('company_id', company.id);

      if (projectsError) throw projectsError;

      // Transform projects data
      const transformedProjects: WorkflowProject[] = (projectsData || []).map(project => {
        const totalFees = (project.project_fees || []).reduce((sum, fee) => sum + (fee.fee || 0), 0);
        const stageFees = (project.project_stages || []).reduce((sum, stage) => sum + (stage.fee || 0), 0);
        const totalRevenue = totalFees + stageFees;
        
        return {
          id: project.id,
          name: project.name,
          code: project.code,
          status: project.status,
          hasFee: totalRevenue > 0,
          hasProfit: totalRevenue > 0,
          revenue: totalRevenue,
          profitMargin: totalRevenue > 0 ? 15 : 0,
          missingFees: totalRevenue > 0 ? 0 : 1
        };
      });

      // Fetch team members (active)
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .eq('company_id', company.id);

      if (activeMembersError) throw activeMembersError;

      // Fetch pending invites
      const { data: pendingInvites, error: pendingError } = await supabase
        .from('invites')
        .select('id, email, first_name, last_name, role, avatar_url, created_at')
        .eq('company_id', company.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Transform members data
      const transformedActiveMembers: WorkflowMember[] = (activeMembers || []).map(member => ({
        id: member.id,
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
        email: member.email,
        status: 'active',
        isPending: false,
        avatar_url: member.avatar_url
      }));

      const transformedPendingMembers: WorkflowMember[] = (pendingInvites || []).map(invite => ({
        id: invite.id,
        name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || 'Pending User',
        email: invite.email || '',
        status: 'pending',
        isPending: true,
        role: invite.role,
        avatar_url: invite.avatar_url,
        inviteDate: invite.created_at
      }));

      const allMembers = [...transformedActiveMembers, ...transformedPendingMembers];

      // Generate allocation gaps for next 3 months
      const currentDate = new Date();
      const months = [];
      
      for (let i = 0; i < 3; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Simulate allocation data (in real implementation, fetch from project_resource_allocations)
        // Use workWeekHours from settings for capacity calculation
        const totalHours = transformedActiveMembers.length * (workWeekHours * 4); // workWeekHours/week * 4 weeks
        const allocatedHours = Math.floor(totalHours * (0.6 + Math.random() * 0.3)); // 60-90% allocated
        const availableHours = totalHours - allocatedHours;
        const utilizationRate = totalHours > 0 ? (allocatedHours / totalHours) * 100 : 0;
        
        months.push({
          month: monthName,
          totalHours,
          allocatedHours,
          availableHours,
          utilizationRate,
          isUnderAllocated: utilizationRate < 70
        });
      }

      setProjects(transformedProjects);
      setMembers(allMembers);
      setAllocationGaps(months);

    } catch (error) {
      console.error('Error fetching workflow data:', error);
      toast.error('Failed to load workflow data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate derived data
  const projectsWithoutFees = useMemo(() => 
    projects.filter(p => !p.hasFee), [projects]);
  
  const pendingMembers = useMemo(() => 
    members.filter(m => m.isPending), [members]);
  
  const underAllocatedMonths = useMemo(() => 
    allocationGaps.filter(gap => gap.isUnderAllocated), [allocationGaps]);

  // Calculate health scores
  const healthScore = useMemo((): WorkflowHealthScore => {
    const projectsScore = projects.length > 0 
      ? Math.round(((projects.length - projectsWithoutFees.length) / projects.length) * 100)
      : 0;
    
    const membersScore = members.length > 0 
      ? Math.round(((members.length - pendingMembers.length) / members.length) * 100)
      : 100;
    
    const allocationsScore = allocationGaps.length > 0 
      ? Math.round(((allocationGaps.length - underAllocatedMonths.length) / allocationGaps.length) * 100)
      : 100;
    
    const overall = Math.round((projectsScore + membersScore + allocationsScore) / 3);

    return {
      projects: projectsScore,
      members: membersScore,
      allocations: allocationsScore,
      overall
    };
  }, [projects, members, allocationGaps, projectsWithoutFees, pendingMembers, underAllocatedMonths]);

  return {
    projects,
    members,
    allocationGaps,
    healthScore,
    isLoading,
    projectsWithoutFees,
    pendingMembers,
    underAllocatedMonths
  };
};