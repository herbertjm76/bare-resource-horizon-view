
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Calendar, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface TeamMemberPerformanceProps {
  memberId: string;
}

export const TeamMemberPerformance: React.FC<TeamMemberPerformanceProps> = ({ memberId }) => {
  // Mock performance data - in a real app, this would come from your performance tracking system
  const performanceData = {
    overallRating: 4.2,
    recentProjects: 8,
    onTimeDelivery: 95,
    clientSatisfaction: 4.6,
    skillGrowth: 'Strong',
    lastReview: '2024-01-15',
    nextReview: '2024-07-15',
    goals: [
      { title: 'Complete React certification', status: 'in_progress', dueDate: '2024-08-30' },
      { title: 'Lead one project independently', status: 'completed', dueDate: '2024-03-31' },
      { title: 'Mentor junior developer', status: 'pending', dueDate: '2024-09-15' }
    ],
    strengths: ['Problem-solving', 'Team collaboration', 'Technical expertise'],
    areasForImprovement: ['Time estimation', 'Documentation'],
    recentFeedback: [
      {
        source: 'Project Manager',
        feedback: 'Excellent work on the dashboard redesign. Great attention to detail.',
        date: '2024-05-20'
      },
      {
        source: 'Client',
        feedback: 'Very responsive and delivered exactly what we needed.',
        date: '2024-05-15'
      }
    ]
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getGoalIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Performance Overview</h2>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRatingColor(performanceData.overallRating)}`}>
              {performanceData.overallRating}/5.0
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current performance level</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performanceData.onTimeDelivery}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Project delivery rate</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Client Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {performanceData.clientSatisfaction}/5.0
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average client rating</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {performanceData.recentProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Projects this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Development */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-theme-primary" />
            Goals & Development
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {performanceData.goals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getGoalIcon(goal.status)}
                  <div>
                    <h4 className="font-medium text-foreground">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={`${getGoalStatusColor(goal.status)} border`}>
                  {goal.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <TrendingUp className="h-5 w-5" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceData.areasForImprovement.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-foreground">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-theme-primary" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceData.recentFeedback.map((feedback, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{feedback.source}</span>
                <span className="text-sm text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</span>
              </div>
              <p className="text-foreground text-sm italic">"{feedback.feedback}"</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Review Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-theme-primary" />
            Review Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Last Review</h4>
              <p className="text-blue-600">{new Date(performanceData.lastReview).toLocaleDateString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Next Review</h4>
              <p className="text-green-600">{new Date(performanceData.nextReview).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
