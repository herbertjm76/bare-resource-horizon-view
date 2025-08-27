import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertTriangle, 
  DollarSign, 
  UserPlus,
  Calendar,
  ArrowRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkflowProject, WorkflowMember, AllocationGap } from '@/hooks/useWorkflowData';

interface WorkflowGapAnalysisProps {
  projectsWithoutFees: WorkflowProject[];
  pendingMembers: WorkflowMember[];
  underAllocatedMonths: AllocationGap[];
}

export const WorkflowGapAnalysis: React.FC<WorkflowGapAnalysisProps> = ({
  projectsWithoutFees,
  pendingMembers,
  underAllocatedMonths
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDaysAgo = (dateString?: string) => {
    if (!dateString) return '';
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="grid gap-6">
      {/* Projects Without Fees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-destructive" />
            Projects Without Fees
            <Badge variant="destructive">{projectsWithoutFees.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectsWithoutFees.length === 0 ? (
            <div className="text-center py-6">
              <DollarSign className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                All projects have fees configured!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">
                  {projectsWithoutFees.length} project{projectsWithoutFees.length !== 1 ? 's' : ''} missing fee configuration
                </span>
              </div>
              
              <div className="space-y-3">
                {projectsWithoutFees.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Code: {project.code} • Status: {project.status}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/projects`)}
                    >
                      Configure Fee
                    </Button>
                  </div>
                ))}
              </div>
              
              {projectsWithoutFees.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/projects')}
                >
                  View All {projectsWithoutFees.length} Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Member Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-warning" />
            Pending Invitations
            <Badge variant="outline">{pendingMembers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingMembers.length === 0 ? (
            <div className="text-center py-6">
              <UserPlus className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                All team members are active!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">
                  {pendingMembers.length} member{pendingMembers.length !== 1 ? 's' : ''} haven't accepted invitations
                </span>
              </div>
              
              <div className="space-y-3">
                {pendingMembers.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.email} • Invited {getDaysAgo(member.inviteDate)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate('/team')}
                    >
                      Resend Invite
                    </Button>
                  </div>
                ))}
              </div>
              
              {pendingMembers.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/team')}
                >
                  Manage All Invitations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Under-allocated Months */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-warning" />
            Under-allocated Months
            <Badge variant="outline">{underAllocatedMonths.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {underAllocatedMonths.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Team utilization looks healthy!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                <TrendingDown className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">
                  {underAllocatedMonths.length} month{underAllocatedMonths.length !== 1 ? 's' : ''} below 70% utilization
                </span>
              </div>
              
              <div className="space-y-3">
                {underAllocatedMonths.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{month.month}</h4>
                      <p className="text-sm text-muted-foreground">
                        {month.allocatedHours}h allocated of {month.totalHours}h available
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-warning">
                        {Math.round(month.utilizationRate)}%
                      </div>
                      <Badge variant="outline">
                        {month.availableHours}h available
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/project-resourcing')}
              >
                Plan Resource Allocation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};