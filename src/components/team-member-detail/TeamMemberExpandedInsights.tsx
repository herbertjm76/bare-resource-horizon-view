
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamMemberExpandedInsightsProps {
  memberId: string;
}

export const TeamMemberExpandedInsights: React.FC<TeamMemberExpandedInsightsProps> = ({
  memberId
}) => {
  // Mock data - in real implementation, this would come from API calls
  const capacityData = {
    weeklyCapacity: 40,
    thisWeek: 30,
    thisMonth: 136,
    thisQuarter: 468,
    utilizationWeek: 75,
    utilizationMonth: 85,
    utilizationQuarter: 92
  };

  const currentProjects = [
    {
      id: '1',
      name: 'Project Alpha',
      status: 'Active',
      dueDate: 'June 15, 2025',
      progress: 60,
      priority: 'high'
    },
    {
      id: '2',
      name: 'Project Beta',
      status: 'Planning',
      dueDate: 'July 30, 2025',
      progress: 25,
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Project Gamma',
      status: 'Review',
      dueDate: 'June 8, 2025',
      progress: 95,
      priority: 'high'
    }
  ];

  const projectHistory = [
    {
      id: '1',
      name: 'Project Delta',
      completedDate: 'March 2025',
      totalHours: 127,
      status: 'completed'
    },
    {
      id: '2',
      name: 'Project Echo',
      completedDate: 'January 2025',
      totalHours: 89,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Project Foxtrot',
      completedDate: 'December 2024',
      totalHours: 156,
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Capacity - Expanded */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{capacityData.weeklyCapacity}h</div>
            <div className="text-sm text-blue-600">Weekly Capacity</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium">{capacityData.thisWeek}h</span>
            </div>
            <Progress value={capacityData.utilizationWeek} className="h-2 bg-blue-100" />
            <div className="text-xs text-gray-500 text-center">{capacityData.utilizationWeek}% utilized</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium">{capacityData.thisMonth}h</span>
            </div>
            <Progress value={capacityData.utilizationMonth} className="h-2 bg-green-100" />
            <div className="text-xs text-gray-500 text-center">{capacityData.utilizationMonth}% utilized</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Quarter</span>
              <span className="text-sm font-medium">{capacityData.thisQuarter}h</span>
            </div>
            <Progress value={capacityData.utilizationQuarter} className="h-2 bg-orange-100" />
            <div className="text-xs text-gray-500 text-center">{capacityData.utilizationQuarter}% utilized</div>
          </div>
        </CardContent>
      </Card>

      {/* Current Projects - Expanded */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-green-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg p-3 border border-green-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  {getPriorityIcon(project.priority)}
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Calendar className="h-3 w-3" />
                Due: {project.dueDate}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Project History - Expanded */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-purple-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projectHistory.map((project) => (
            <div key={project.id} className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{project.name}</h4>
                <Badge className={getStatusColor(project.status)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {project.completedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {project.totalHours}h
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
            <div className="text-sm font-medium text-purple-900 mb-1">Total Hours</div>
            <div className="text-xl font-bold text-purple-700">
              {projectHistory.reduce((sum, project) => sum + project.totalHours, 0)}h
            </div>
            <div className="text-xs text-gray-500">Across {projectHistory.length} projects</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
