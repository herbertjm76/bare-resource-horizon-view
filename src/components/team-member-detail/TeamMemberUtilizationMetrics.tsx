
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Target, BarChart3 } from 'lucide-react';
import { useIndividualUtilization } from '@/hooks/useIndividualUtilization';

interface TeamMemberUtilizationMetricsProps {
  memberId: string;
}

export const TeamMemberUtilizationMetrics: React.FC<TeamMemberUtilizationMetricsProps> = ({ memberId }) => {
  // Create a minimal team member object that matches the Profile interface structure
  const teamMemberForUtilization = [{
    id: memberId,
    email: '', // Required by Profile interface
    role: 'member' as const, // Required by Profile interface  
    weekly_capacity: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_id: null, // Will be handled by the hook
    first_name: null,
    last_name: null,
    job_title: null,
    bio: null,
    city: null,
    state: null,
    phone: null,
    postal_code: null,
    address: null,
    social_twitter: null,
    social_linkedin: null,
    emergency_contact_phone: null,
    date_of_birth: null,
    department: null,
    location: null,
    country: null,
    emergency_contact_name: null,
    start_date: null,
    manager_id: null,
    avatar_url: null
  }];

  const { getIndividualUtilization, isLoading } = useIndividualUtilization(teamMemberForUtilization);
  const utilization = getIndividualUtilization(memberId);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-green-600';
    return 'text-blue-600';
  };

  const getUtilizationBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-50 border-red-200';
    if (percentage >= 75) return 'bg-orange-50 border-orange-200';
    if (percentage >= 50) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Utilization Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Utilization Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 7-Day Utilization */}
        <Card className={`border-2 ${getUtilizationBgColor(utilization.days7)}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">7-Day Period</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization.days7)}`}>
              {utilization.days7}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Current week performance</p>
          </CardContent>
        </Card>

        {/* 30-Day Utilization */}
        <Card className={`border-2 ${getUtilizationBgColor(utilization.days30)}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">30-Day Period</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization.days30)}`}>
              {utilization.days30}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Monthly average</p>
          </CardContent>
        </Card>

        {/* 90-Day Utilization */}
        <Card className={`border-2 ${getUtilizationBgColor(utilization.days90)}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">90-Day Period</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization.days90)}`}>
              {utilization.days90}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Quarterly trend</p>
          </CardContent>
        </Card>

        {/* Capacity Status */}
        <Card className="border-2 bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Capacity Status</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {utilization.days7 < 75 ? 'Available' : utilization.days7 < 90 ? 'Optimal' : 'Overloaded'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
