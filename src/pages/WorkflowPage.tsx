import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp,
  ArrowRight,
  Activity,
  Target
} from 'lucide-react';
import { useWorkflowData } from '@/hooks/useWorkflowData';
import { WorkflowVisualFlow } from '@/components/workflow/WorkflowVisualFlow';
import { WorkflowGapAnalysis } from '@/components/workflow/WorkflowGapAnalysis';
import { useNavigate } from 'react-router-dom';

export const WorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    healthScore,
    projectsWithoutFees,
    pendingMembers,
    underAllocatedMonths,
    projects,
    members,
    allocationGaps,
    isLoading
  } = useWorkflowData();

  const totalIssues = projectsWithoutFees.length + pendingMembers.length + underAllocatedMonths.length;

  const getNextAction = () => {
    if (projectsWithoutFees.length > 0) {
      return {
        title: 'Configure Project Fees',
        description: `${projectsWithoutFees.length} projects need fee configuration`,
        action: () => navigate('/projects'),
        priority: 'high'
      };
    }
    if (pendingMembers.length > 0) {
      return {
        title: 'Follow up on Invitations',
        description: `${pendingMembers.length} members haven't accepted invitations`,
        action: () => navigate('/team'),
        priority: 'medium'
      };
    }
    if (underAllocatedMonths.length > 0) {
      return {
        title: 'Plan Resource Allocation',
        description: `${underAllocatedMonths.length} months have low utilization`,
        action: () => navigate('/project-resourcing'),
        priority: 'medium'
      };
    }
    return {
      title: 'Workflow Optimized',
      description: 'All workflow stages are healthy',
      action: () => navigate('/dashboard'),
      priority: 'low'
    };
  };

  const nextAction = getNextAction();

  if (isLoading) {
    return (
      <StandardLayout title="Workflow Overview">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Project Workflow">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold">{healthScore.overall}%</p>
                </div>
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issues Found</p>
                  <p className="text-2xl font-bold">{totalIssues}</p>
                </div>
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{members.length}</p>
                </div>
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual Workflow */}
        <WorkflowVisualFlow
          healthScore={healthScore}
          projectIssues={projectsWithoutFees.length}
          memberIssues={pendingMembers.length}
          allocationIssues={underAllocatedMonths.length}
        />

        {/* Priority Action */}
        {totalIssues > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Priority Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div>
                  <h4 className="font-medium">{nextAction.title}</h4>
                  <p className="text-sm text-muted-foreground">{nextAction.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={nextAction.priority === 'high' ? 'destructive' : 'secondary'}>
                    {nextAction.priority} priority
                  </Badge>
                  <Button onClick={nextAction.action}>
                    Take Action
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowGapAnalysis
              projectsWithoutFees={projectsWithoutFees}
              pendingMembers={pendingMembers}
              underAllocatedMonths={underAllocatedMonths}
            />
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
};