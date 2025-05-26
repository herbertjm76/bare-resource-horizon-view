
import React from 'react';
import { Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

interface WeekResourceSummaryProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const WeekResourceSummary: React.FC<WeekResourceSummaryProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Calculate summary statistics
  const totalMembers = members.length;
  const totalProjects = projects.length;
  
  // Calculate total allocated hours
  const totalAllocatedHours = allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
  
  // Calculate members with allocations
  const membersWithAllocations = new Set(
    allocations.filter(a => a.hours > 0).map(a => a.resource_id)
  ).size;
  
  // Calculate projects with allocations
  const projectsWithAllocations = new Set(
    allocations.filter(a => a.hours > 0).map(a => a.project_id)
  ).size;
  
  // Calculate utilization metrics
  const totalCapacity = members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
  const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
  
  // Calculate over/under allocated members
  const memberStats = members.map(member => {
    const memberAllocations = allocations.filter(a => a.resource_id === member.id);
    const memberHours = memberAllocations.reduce((sum, a) => sum + (a.hours || 0), 0);
    const capacity = member.weekly_capacity || 40;
    return {
      ...member,
      allocatedHours: memberHours,
      capacity,
      utilizationRate: capacity > 0 ? (memberHours / capacity) * 100 : 0
    };
  });
  
  const overAllocatedMembers = memberStats.filter(m => m.utilizationRate > 100).length;
  const underAllocatedMembers = memberStats.filter(m => m.utilizationRate < 80).length;
  const wellAllocatedMembers = memberStats.filter(m => m.utilizationRate >= 80 && m.utilizationRate <= 100).length;
  
  // Average hours per member
  const avgHoursPerMember = totalMembers > 0 ? Math.round(totalAllocatedHours / totalMembers) : 0;

  return (
    <div className="mb-4 relative">
      {/* Glass morphism background container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(45deg, #895CF7 0%, #5669F7 55%, #E64FC4 100%)' }} />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        
        {/* Top highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(120%_30%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_70%)]" />
        
        <div className="relative z-10 p-4">
          {/* Four rounded square cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Team Allocation Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Team Members</div>
                    <div className="text-xl font-bold text-white">{totalMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3 text-green-300" />
                      <span className="text-white/90">Allocated</span>
                    </div>
                    <span className="font-medium text-white">{membersWithAllocations}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-orange-300" />
                      <span className="text-white/90">Unallocated</span>
                    </div>
                    <span className="font-medium text-white">{totalMembers - membersWithAllocations}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Utilization */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Utilization</div>
                    <div className="text-xl font-bold text-white">{utilizationPercentage}%</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Total Hours</span>
                    <span className="font-medium text-white">{totalAllocatedHours}h</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Capacity</span>
                    <span className="font-medium text-white">{totalCapacity}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Active Projects</div>
                    <div className="text-xl font-bold text-white">{projectsWithAllocations}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Total Projects</span>
                    <span className="font-medium text-white">{totalProjects}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Avg hrs/member</span>
                    <span className="font-medium text-white">{avgHoursPerMember}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allocation Balance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Well Allocated</div>
                    <div className="text-xl font-bold text-white">{wellAllocatedMembers}</div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Over-allocated</span>
                    <span className="font-medium text-white text-red-300">{overAllocatedMembers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/90">Under-allocated</span>
                    <span className="font-medium text-white text-yellow-300">{underAllocatedMembers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
