
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Building2, MapPin, TrendingUp, UserCheck, UserPlus } from 'lucide-react';
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
  const activationRate = totalMembers > 0 ? Math.round((activeMembers.length / totalMembers) * 100) : 0;

  // Get top locations with counts
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
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Overview</h2>
        <p className="text-gray-600">Monitor your team composition and growth at a glance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Members Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                Team Size
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalMembers}</div>
              <div className="text-sm text-gray-600">Total Team Members</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Active</span>
                </div>
                <span className="font-semibold text-gray-900">{activeMembers.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="font-semibold text-gray-900">{preRegisteredMembers.length}</span>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-600">Activation Rate</span>
                  <span className="font-medium text-blue-700">{activationRate}%</span>
                </div>
                <Progress value={activationRate} className="h-2 bg-blue-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-500 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                Organization
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{Object.keys(departmentStats).length}</div>
              <div className="text-sm text-gray-600">Active Departments</div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(departmentStats)
                .filter(([_, count]) => count > 0)
                .map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${departmentColors[dept as keyof typeof departmentColors]}`}></div>
                      <span className="text-sm font-medium text-gray-700">{dept}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500">
                        {activeMembers.length > 0 ? Math.round((count / activeMembers.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              
              {Object.keys(departmentStats).length === 0 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">No departments assigned</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Locations Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-medium">
                Global Reach
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{Object.keys(locationStats).length}</div>
              <div className="text-sm text-gray-600">Countries/Regions</div>
            </div>
            
            <div className="space-y-3">
              {topLocations.length > 0 ? (
                <>
                  {topLocations.map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getLocationEmoji(location)}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {location === 'Unknown' ? 'Not specified' : location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-500">
                          {activeMembers.length > 0 ? Math.round((count / activeMembers.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(locationStats).length > 3 && (
                    <div className="pt-2 border-t border-purple-200">
                      <span className="text-xs text-gray-500">
                        +{Object.keys(locationStats).length - 3} more locations
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500">No locations specified</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
