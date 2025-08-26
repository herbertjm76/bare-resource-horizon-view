import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  DollarSign, 
  BarChart3, 
  FolderPlus,
  Target,
  TrendingUp
} from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';
import { useProjectData } from '@/components/dashboard/hooks/useProjectData';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  status: 'completed' | 'current' | 'pending' | 'blocked';
  completionRate: number;
  insights: string[];
  actionItems: string[];
}

export const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const { company } = useCompany();
  const { projects, isLoading } = useProjectData(company?.id);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'project-setup',
      title: 'Project Setup',
      description: 'Define project scope, objectives, and initial configuration',
      icon: FolderPlus,
      route: '/projects',
      status: projects.length > 0 ? 'completed' : 'current',
      completionRate: projects.length > 0 ? 100 : 0,
      insights: [
        projects.length === 0 ? 'No projects have been created yet' : `${projects.length} projects configured`,
        'Project templates and standards need definition',
        'Stakeholder roles and responsibilities require clarification'
      ],
      actionItems: [
        'Create your first project',
        'Define project categories and types',
        'Set up project approval workflows'
      ]
    },
    {
      id: 'resource-planning',
      title: 'Resource Planning',
      description: 'Allocate team members and resources to projects',
      icon: Users,
      route: '/project-resourcing',
      status: projects.length > 0 ? 'current' : 'pending',
      completionRate: 25,
      insights: [
        'Team capacity planning is incomplete',
        'Skill matrix needs to be established',
        'Resource allocation conflicts may exist'
      ],
      actionItems: [
        'Map team skills and availability',
        'Create resource allocation matrix',
        'Set up capacity planning tools'
      ]
    },
    {
      id: 'financial-control',
      title: 'Financial Control',
      description: 'Budget planning, cost tracking, and financial oversight',
      icon: DollarSign,
      route: '/financial-control',
      status: projects.length > 0 ? 'current' : 'pending',
      completionRate: 10,
      insights: [
        'Budget baselines are not established',
        'Cost tracking mechanisms missing',
        'Financial reporting automation needed'
      ],
      actionItems: [
        'Define budget categories and codes',
        'Set up cost tracking workflows',
        'Implement financial reporting dashboards'
      ]
    },
    {
      id: 'progress-monitoring',
      title: 'Progress Monitoring',
      description: 'Track project progress, milestones, and deliverables',
      icon: BarChart3,
      route: '/project-monitoring',
      status: 'pending',
      completionRate: 5,
      insights: [
        'Milestone tracking system not configured',
        'Progress reporting templates missing',
        'Automated status updates needed'
      ],
      actionItems: [
        'Create milestone templates',
        'Set up progress tracking metrics',
        'Configure automated reporting'
      ]
    }
  ];

  const overallProgress = workflowSteps.reduce((acc, step) => acc + step.completionRate, 0) / workflowSteps.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'current': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'blocked': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Clock;
      case 'pending': return Target;
      case 'blocked': return AlertTriangle;
      default: return Clock;
    }
  };

  const criticalInsights = [
    {
      type: 'warning',
      title: 'Workflow Initialization Required',
      description: projects.length === 0 
        ? 'Your workflow setup is in the initial stage. Start by creating your first project to unlock the full workflow capabilities.'
        : 'Good progress on project setup! Focus on resource planning and financial controls next.',
      priority: 'high'
    },
    {
      type: 'info',
      title: 'Resource Planning Gap',
      description: 'Team capacity and skill mapping are essential for effective project delivery. This step significantly impacts project success rates.',
      priority: 'medium'
    },
    {
      type: 'warning',
      title: 'Financial Controls Missing',
      description: 'Without proper budget tracking and financial controls, projects risk cost overruns and budget mismanagement.',
      priority: 'high'
    }
  ];

  return (
    <StandardLayout
      title="Project Workflow Overview"
    >
      <div className="space-y-6">
        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Workflow Completion Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                {overallProgress < 25 && "Your workflow is in the early stages. Focus on completing project setup first."}
                {overallProgress >= 25 && overallProgress < 50 && "Good start! Continue with resource planning and financial setup."}
                {overallProgress >= 50 && overallProgress < 75 && "Excellent progress! You're building a robust project management foundation."}
                {overallProgress >= 75 && "Outstanding! Your workflow setup is nearly complete."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Critical Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalInsights.map((insight, index) => (
                <div key={index} className="flex gap-3 p-4 rounded-lg border bg-muted/30">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    insight.priority === 'high' ? 'text-orange-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                    {insight.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <div className="grid gap-6">
          {workflowSteps.map((step, index) => {
            const StatusIcon = getStatusIcon(step.status);
            const StepIcon = step.icon;
            
            return (
              <Card key={step.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(step.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {step.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {step.completionRate}%
                      </span>
                    </div>
                  </div>
                  <Progress value={step.completionRate} className="h-1" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Current Insights</h4>
                      <ul className="space-y-1">
                        {step.insights.map((insight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Action Items</h4>
                      <ul className="space-y-1">
                        {step.actionItems.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      onClick={() => navigate(step.route)}
                      variant={step.status === 'current' ? 'default' : 'outline'}
                      className="w-full sm:w-auto"
                    >
                      {step.status === 'completed' ? 'Review' : 'Continue Setup'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
                {index < workflowSteps.length - 1 && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-background border rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Create Your First Project</h4>
                    <p className="text-sm text-muted-foreground">Start your workflow journey by setting up your first project</p>
                  </div>
                  <Button onClick={() => navigate('/projects')}>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Complete Resource Planning</h4>
                      <p className="text-sm text-muted-foreground">Set up team allocation and capacity planning</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/project-resourcing')}>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Establish Financial Controls</h4>
                      <p className="text-sm text-muted-foreground">Configure budget tracking and cost management</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/financial-control')}>
                      Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};