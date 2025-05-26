
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, MapPin, UserCheck, UserPlus } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMembersSummaryProps {
  teamMembers: TeamMember[];
}

export const TeamMembersSummary: React.FC<TeamMembersSummaryProps> = ({
  teamMembers
}) => {
  // Calculate active and preregistered members
  const activeMembers = teamMembers.filter(member => !('isPending' in member && member.isPending));
  const preRegisteredMembers = teamMembers.filter(member => 'isPending' in member && member.isPending);
  
  // Calculate department distribution for active members only
  const departmentStats = activeMembers.reduce((acc, member) => {
    const department = (member as any).department || 'Unassigned';
    const normalizedDept = department.toLowerCase();
    
    if (normalizedDept.includes('architecture')) {
      acc['Architecture'] = (acc['Architecture'] || 0) + 1;
    } else if (normalizedDept.includes('landscape')) {
      acc['Landscape'] = (acc['Landscape'] || 0) + 1;
    } else {
      acc['Unassigned'] = (acc['Unassigned'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate location distribution
  const locationStats = activeMembers.reduce((acc, member) => {
    const location = (member as any).location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get location emoji mapping
  const getLocationEmoji = (location: string) => {
    const emojiMap: Record<string, string> = {
      'US': '🇺🇸',
      'UK': '🇬🇧', 
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'BR': '🇧🇷',
      'IN': '🇮🇳',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'Unknown': '🌍'
    };
    return emojiMap[location] || '🌍';
  };

  const totalMembers = activeMembers.length + preRegisteredMembers.length;

  // Get top locations with counts (limit to 3)
  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Department breakdown with colors
  const departmentColors = {
    'Architecture': 'bg-blue-500',
    'Landscape': 'bg-green-500', 
    'Unassigned': 'bg-gray-400'
  };

  return (
    <div className="mb-6">
      <Card className="bg-brand-gray text-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-semibold">Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Members */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/80">Total Members</div>
                  <div className="text-2xl font-bold text-white">{totalMembers}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-300" />
                    <span className="text-white/90">Active</span>
                  </div>
                  <span className="font-medium text-white">{activeMembers.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-orange-300" />
                    <span className="text-white/90">Pending</span>
                  </div>
                  <span className="font-medium text-white">{preRegisteredMembers.length}</span>
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/80">Departments</div>
                  <div className="text-2xl font-bold text-white">{Object.keys(departmentStats).length}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {Object.entries(departmentStats)
                  .filter(([_, count]) => count > 0)
                  .slice(0, 2)
                  .map(([dept, count]) => (
                    <div key={dept} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${departmentColors[dept as keyof typeof departmentColors]} opacity-80`}></div>
                        <span className="text-white/90">{dept}</span>
                      </div>
                      <span className="font-medium text-white">{count}</span>
                    </div>
                  ))}
                
                {Object.keys(departmentStats).length === 0 && (
                  <div className="text-sm text-white/70">No departments assigned</div>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/80">Locations</div>
                  <div className="text-2xl font-bold text-white">{Object.keys(locationStats).length}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {topLocations.length > 0 ? (
                  <>
                    {topLocations.slice(0, 2).map(([location, count]) => (
                      <div key={location} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getLocationEmoji(location)}</span>
                          <span className="text-white/90">
                            {location === 'Unknown' ? 'Not specified' : location}
                          </span>
                        </div>
                        <span className="font-medium text-white">{count}</span>
                      </div>
                    ))}
                    
                    {Object.keys(locationStats).length > 2 && (
                      <div className="text-sm text-white/70">
                        +{Object.keys(locationStats).length - 2} more
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-white/70">No locations specified</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
