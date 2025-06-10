
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Calculator, Clock, Target } from 'lucide-react';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { CurrentStageIndicator } from '../components/CurrentStageIndicator';
import type { FinancialMetrics } from '../hooks/useProjectFinancialMetrics';

interface ProjectFinancialTabProps {
  form: any;
  onChange: (key: string, value: any) => void;
  financialMetrics?: FinancialMetrics;
  officeStages?: Array<{ id: string; name: string; color?: string }>;
}

export const ProjectFinancialTab: React.FC<ProjectFinancialTabProps> = ({
  form,
  onChange,
  financialMetrics,
  officeStages = []
}) => {
  // Calculate derived budget amount from stage fees
  const derivedBudgetAmount = useMemo(() => {
    if (!form.stageFees) return 0;
    return Object.values(form.stageFees).reduce((total: number, stage: any) => {
      const fee = parseFloat(String(stage?.fee || '0'));
      return total + (isNaN(fee) ? 0 : fee);
    }, 0);
  }, [form.stageFees]);

  // Calculate budget hours from derived budget and blended rate
  const derivedBudgetHours = useMemo(() => {
    const rate = parseFloat(String(form.blended_rate || form.avgRate || '0'));
    return rate > 0 ? Number(derivedBudgetAmount) / Number(rate) : 0;
  }, [derivedBudgetAmount, form.blended_rate, form.avgRate]);

  const getVarianceColor = (variance: number) => {
    if (variance > 10) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'on track': return 'default';
      case 'at risk': return 'destructive';
      case 'delayed': return 'destructive';
      case 'over budget': return 'destructive';
      case 'under budget': return 'secondary';
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  const consumedHours = parseFloat(String(form.consumed_hours || '0'));
  const hoursProgress = derivedBudgetHours > 0 ? (consumedHours / derivedBudgetHours) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Current Stage Progress */}
      {form.current_stage && officeStages.length > 0 && (
        <CurrentStageIndicator
          currentStage={form.current_stage}
          allStages={officeStages}
          completionPercentage={hoursProgress}
        />
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${derivedBudgetAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Calculated from stage fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hours Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consumedHours.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {derivedBudgetHours.toFixed(0)} budgeted hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Burn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialMetrics?.burn_rate ? financialMetrics.burn_rate.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              hours per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hours Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressIndicator
              label="Hours Used"
              current={consumedHours}
              total={derivedBudgetHours}
              unit="hrs"
              variant="hours"
            />
          </CardContent>
        </Card>

        {financialMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressIndicator
                label="Budget Spent"
                current={financialMetrics.total_spent}
                total={derivedBudgetAmount}
                unit="$"
                variant="budget"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_amount">Budget Amount (Calculated)</Label>
              <Input
                id="budget_amount"
                type="number"
                value={derivedBudgetAmount.toFixed(2)}
                readOnly
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Automatically calculated from stage fees
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_hours">Budget Hours (Calculated)</Label>
              <Input
                id="budget_hours"
                type="number"
                value={derivedBudgetHours.toFixed(2)}
                readOnly
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Budget amount ÷ blended rate
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consumed_hours">Consumed Hours</Label>
              <Input
                id="consumed_hours"
                type="number"
                placeholder="0"
                value={form.consumed_hours || ''}
                onChange={(e) => onChange('consumed_hours', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blended_rate">Blended Rate</Label>
              <Input
                id="blended_rate"
                type="number"
                placeholder="0.00"
                value={form.blended_rate || ''}
                onChange={(e) => onChange('blended_rate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="financial_status">Financial Status</Label>
            <Select
              value={form.financial_status || 'On Track'}
              onValueChange={(value) => onChange('financial_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Over Budget">Over Budget</SelectItem>
                <SelectItem value="Under Budget">Under Budget</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contract Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Contract Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_start_date">Contract Start Date</Label>
              <Input
                id="contract_start_date"
                type="date"
                value={form.contract_start_date || ''}
                onChange={(e) => onChange('contract_start_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={form.contract_end_date || ''}
                onChange={(e) => onChange('contract_end_date', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Financial Health */}
      {financialMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Variance</span>
                  <Badge variant={Math.abs(financialMetrics.budget_variance) > 1000 ? 'destructive' : 'default'}>
                    ${financialMetrics.budget_variance.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {financialMetrics.budget_variance > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`text-sm ${getVarianceColor(financialMetrics.budget_variance)}`}>
                    {financialMetrics.budget_variance > 0 ? 'Over budget' : 'Under budget'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge variant={getStatusBadgeVariant(form.financial_status)}>
                    {form.financial_status || 'On Track'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Profit Margin: {financialMetrics.profit_margin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {financialMetrics.consumed_hours.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Hours Consumed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {financialMetrics.budget_hours.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Budget Hours</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {((consumedHours / derivedBudgetHours) * 100).toFixed(1) || 0}%
                </div>
                <div className="text-xs text-muted-foreground">Hours Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
