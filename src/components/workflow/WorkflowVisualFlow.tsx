import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FolderPlus, 
  Users, 
  Calendar,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkflowHealthScore } from '@/hooks/useWorkflowData';

interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  healthScore: number;
  issueCount: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface WorkflowVisualFlowProps {
  healthScore: WorkflowHealthScore;
  projectIssues: number;
  memberIssues: number;
  allocationIssues: number;
}

export const WorkflowVisualFlow: React.FC<WorkflowVisualFlowProps> = ({
  healthScore,
  projectIssues,
  memberIssues,
  allocationIssues
}) => {
  const navigate = useNavigate();

  const getStageStatus = (score: number): 'healthy' | 'warning' | 'critical' => {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const stages: WorkflowStage[] = [
    {
      id: 'projects',
      title: 'Project Creation',
      description: 'Define projects, set budgets, configure stages',
      icon: FolderPlus,
      route: '/projects',
      healthScore: healthScore.projects,
      issueCount: projectIssues,
      status: getStageStatus(healthScore.projects)
    },
    {
      id: 'members',
      title: 'Member Input',
      description: 'Invite team members, assign roles, configure profiles',
      icon: Users,
      route: '/team',
      healthScore: healthScore.members,
      issueCount: memberIssues,
      status: getStageStatus(healthScore.members)
    },
    {
      id: 'allocations',
      title: 'Hour Allocation',
      description: 'Assign resources to projects, plan capacity',
      icon: Calendar,
      route: '/project-resourcing',
      healthScore: healthScore.allocations,
      issueCount: allocationIssues,
      status: getStageStatus(healthScore.allocations)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Workflow Health Score</h3>
              <p className="text-sm text-muted-foreground">
                Overall system configuration completeness
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{healthScore.overall}%</div>
              <Badge variant={getStageStatus(healthScore.overall) === 'healthy' ? 'default' : 'destructive'}>
                {getStageStatus(healthScore.overall) === 'healthy' ? 'Healthy' : 'Needs Attention'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Flow */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage, index) => {
            const StatusIcon = getStatusIcon(stage.status);
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} className="relative">
                <Card className={`transition-all hover:shadow-md ${
                  stage.status === 'critical' ? 'ring-2 ring-destructive/20' : ''
                }`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${getStatusColor(stage.status)}`}>
                          <StageIcon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${
                            stage.status === 'healthy' ? 'text-success' : 'text-destructive'
                          }`} />
                          <span className="text-2xl font-bold">{stage.healthScore}%</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-semibold text-base">{stage.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stage.description}
                        </p>
                      </div>

                      {/* Issues Indicator */}
                      {stage.issueCount > 0 && (
                        <div className={`p-3 rounded-lg ${getStatusColor(stage.status)}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {stage.issueCount} issue{stage.issueCount !== 1 ? 's' : ''} found
                            </span>
                            <Badge variant="outline">
                              Action Needed
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => navigate(stage.route)}
                        variant={stage.status === 'critical' ? 'default' : 'outline'}
                        className="w-full"
                        size="sm"
                      >
                        {stage.status === 'critical' ? 'Fix Issues' : 'Review'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow Connector */}
                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-background border rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};