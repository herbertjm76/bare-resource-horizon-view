import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Calculator, Clock, DollarSign } from 'lucide-react';
import { ProjectWizardData } from '../ProjectSetupWizard';

interface BudgetValidationStepProps {
  data: ProjectWizardData;
  onUpdate: (updates: Partial<ProjectWizardData>) => void;
}

export const BudgetValidationStep: React.FC<BudgetValidationStepProps> = ({ data }) => {
  const budgetUtilization = data.totalFee > 0 ? (data.totalBudget / data.totalFee) * 100 : 0;
  const isOverBudget = data.budgetVariance > 0;
  const isUnderBudget = data.budgetVariance < -1000; // Significantly under budget
  const isPerfectBudget = Math.abs(data.budgetVariance) <= 1000;

  const getValidationStatus = () => {
    if (isPerfectBudget) return { icon: CheckCircle, color: 'text-green-600', text: 'Excellent' };
    if (isOverBudget) return { icon: XCircle, color: 'text-red-600', text: 'Over Budget' };
    if (isUnderBudget) return { icon: AlertTriangle, color: 'text-amber-600', text: 'Under Budget' };
    return { icon: CheckCircle, color: 'text-green-600', text: 'Good' };
  };

  const status = getValidationStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Budget Validation & Review</h3>
        <p className="text-muted-foreground">
          Review your project setup and budget calculations before creating the project.
        </p>
      </div>

      {/* Budget Status Alert */}
      <Alert className={`border-2 ${
        isOverBudget ? 'border-red-200 bg-red-50' : 
        isUnderBudget ? 'border-amber-200 bg-amber-50' : 
        'border-green-200 bg-green-50'
      }`}>
        <StatusIcon className={`h-4 w-4 ${status.color}`} />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="font-medium">Budget Status: {status.text}</span>
            <Badge variant={isOverBudget ? 'destructive' : isUnderBudget ? 'secondary' : 'default'}>
              {isOverBudget ? '+' : ''}${Math.abs(data.budgetVariance).toLocaleString()} variance
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4" />
              Project Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalFee.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total contract value</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="w-4 h-4" />
              Planned Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalBudget.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Based on team composition</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalHours.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Planned effort</div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Planned Budget vs Project Fee</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(budgetUtilization, 100)} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>${data.totalFee.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Composition Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Composition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(data.teamComposition).map(([stageId, composition]) => {
              const totalMembers = composition.reduce((sum, item) => sum + item.plannedQuantity, 0);
              const totalHours = composition.reduce((sum, item) => sum + (item.plannedQuantity * item.plannedHoursPerPerson), 0);
              const totalCost = composition.reduce((sum, item) => sum + (item.plannedQuantity * item.plannedHoursPerPerson * item.rateSnapshot), 0);
              
              return (
                <div key={stageId} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Stage {stageId}</h4>
                    <Badge variant="outline">{composition.length} {data.rateBasisStrategy === 'role_based' ? 'roles' : 'locations'}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">People: </span>
                      <span className="font-medium">{totalMembers}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hours: </span>
                      <span className="font-medium">{totalHours}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost: </span>
                      <span className="font-medium">${totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {(isOverBudget || isUnderBudget) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {isOverBudget && (
                <>
                  <li>• Consider reducing team size or hours per person in some stages</li>
                  <li>• Review if all selected stages are necessary for this project</li>
                  <li>• Negotiate a higher project fee with the client</li>
                </>
              )}
              {isUnderBudget && (
                <>
                  <li>• Consider adding buffer time for quality assurance</li>
                  <li>• Review if additional expertise or team members are needed</li>
                  <li>• Ensure all project requirements are properly scoped</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};