
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Calendar, Calculator } from 'lucide-react';

interface ProjectFinancialTabProps {
  form: any;
  onChange: (key: string, value: any) => void;
  financialMetrics?: {
    total_budget: number;
    total_spent: number;
    total_revenue: number;
    profit_margin: number;
    budget_variance: number;
    schedule_variance: number;
  };
}

export const ProjectFinancialTab: React.FC<ProjectFinancialTabProps> = ({
  form,
  onChange,
  financialMetrics
}) => {
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
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      {financialMetrics && (
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
                ${financialMetrics.total_budget?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total project budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${financialMetrics.total_revenue?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total revenue recognized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialMetrics.profit_margin?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Current profit margin
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
              <Label htmlFor="budget_amount">Budget Amount</Label>
              <Input
                id="budget_amount"
                type="number"
                placeholder="0.00"
                value={form.budget_amount || ''}
                onChange={(e) => onChange('budget_amount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_hours">Budget Hours</Label>
              <Input
                id="budget_hours"
                type="number"
                placeholder="0"
                value={form.budget_hours || ''}
                onChange={(e) => onChange('budget_hours', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Contract Dates */}
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

      {/* Financial Variance Indicators */}
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
                    ${financialMetrics.budget_variance?.toLocaleString() || 0}
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
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
