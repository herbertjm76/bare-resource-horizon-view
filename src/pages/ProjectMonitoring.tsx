import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowBreadcrumbs } from '@/components/workflow/WorkflowBreadcrumbs';
import { BarChart3, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const ProjectMonitoring = () => {
  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <WorkflowBreadcrumbs />
        <StandardizedPageHeader
          title="Progress Monitoring"
          description="Track project status, milestones, and performance metrics"
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Project Status Dashboard
              </CardTitle>
              <CardDescription>
                Real-time status tracking across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Status Dashboard Coming Soon
                <div className="text-sm mt-2">
                  This will show project progress, milestone completion, and timeline adherence
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Risk Indicators
              </CardTitle>
              <CardDescription>
                Early warning system for project risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Risk Management Coming Soon
                <div className="text-sm mt-2">
                  This will identify at-risk projects, resource conflicts, and schedule delays
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Key performance indicators and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance Analytics Coming Soon
                <div className="text-sm mt-2">
                  This will track efficiency metrics, quality indicators, and team productivity
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Reporting Tools
              </CardTitle>
              <CardDescription>
                Generate comprehensive project reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Report Generator Coming Soon
                <div className="text-sm mt-2">
                  This will provide customizable reports for stakeholders and management
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StandardLayout>
  );
};

export default ProjectMonitoring;