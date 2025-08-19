import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowBreadcrumbs } from '@/components/workflow/WorkflowBreadcrumbs';
import { DollarSign, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const FinancialControl = () => {
  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <WorkflowBreadcrumbs />
        <StandardizedPageHeader
          title="Financial Control Center"
          description="Monitor burn rates, budget variance, and financial health across all projects"
          icon={DollarSign}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Burn Rate Overview
              </CardTitle>
              <CardDescription>
                Real-time spending rate across active projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Burn Rate Dashboard Coming Soon
                <div className="text-sm mt-2">
                  This will show live burn rate metrics, budget runway calculations, and spending alerts
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Budget Alerts
              </CardTitle>
              <CardDescription>
                Projects requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Budget Alert System Coming Soon
                <div className="text-sm mt-2">
                  This will show over-budget projects, variance warnings, and recommended actions
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Portfolio Health
              </CardTitle>
              <CardDescription>
                Overall financial performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Portfolio Analytics Coming Soon
                <div className="text-sm mt-2">
                  This will show profitability trends, resource utilization, and ROI analysis
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common financial management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Quick Actions Panel Coming Soon
                <div className="text-sm mt-2">
                  This will provide shortcuts for budget adjustments, cost reallocations, and financial reports
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StandardLayout>
  );
};

export default FinancialControl;