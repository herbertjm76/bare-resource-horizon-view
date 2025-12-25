import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Briefcase, User, UserCheck } from 'lucide-react';
import type { TeamCompositionItem } from '@/hooks/useStageTeamComposition';

interface TeamCompositionTableProps {
  items: TeamCompositionItem[];
  onDelete: (itemId: string) => void;
  isDeleting?: boolean;
  showBudget?: boolean;
}

export const TeamCompositionTable: React.FC<TeamCompositionTableProps> = ({
  items,
  onDelete,
  isDeleting = false,
  showBudget = false
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">No resources allocated to this stage</p>
        <p className="text-xs text-muted-foreground mt-1">Add resources using the form above</p>
      </div>
    );
  }

  const totals = {
    quantity: items.reduce((sum, item) => sum + item.plannedQuantity, 0),
    hours: items.reduce((sum, item) => sum + item.totalPlannedHours, 0),
    budget: items.reduce((sum, item) => sum + item.totalBudgetAmount, 0)
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="py-2 px-4 text-left font-medium">Type</th>
            <th className="py-2 px-4 text-left font-medium">Resource</th>
            <th className="py-2 px-4 text-right font-medium">Qty</th>
            <th className="py-2 px-4 text-right font-medium">Hrs/Person</th>
            <th className="py-2 px-4 text-right font-medium">Total Hrs</th>
            {showBudget && (
              <th className="py-2 px-4 text-right font-medium">Budget</th>
            )}
            <th className="py-2 px-4 text-center font-medium w-16">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t hover:bg-muted/30 transition-colors">
              <td className="py-2 px-4">
                {item.referenceType === 'role' ? (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Briefcase className="h-3 w-3" />
                    Role
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1 font-normal">
                    {item.memberType === 'pre_registered' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <UserCheck className="h-3 w-3" />
                    )}
                    {item.memberType === 'pre_registered' ? 'Pending' : 'Member'}
                  </Badge>
                )}
              </td>
              <td className="py-2 px-4 font-medium">{item.referenceName}</td>
              <td className="py-2 px-4 text-right">{item.plannedQuantity}</td>
              <td className="py-2 px-4 text-right">{item.plannedHoursPerPerson}</td>
              <td className="py-2 px-4 text-right font-medium">{item.totalPlannedHours}</td>
              {showBudget && (
                <td className="py-2 px-4 text-right">
                  ${item.totalBudgetAmount.toLocaleString()}
                </td>
              )}
              <td className="py-2 px-4 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
          {/* Totals row */}
          <tr className="border-t bg-muted/50 font-medium">
            <td className="py-2 px-4" colSpan={2}>Total</td>
            <td className="py-2 px-4 text-right">{totals.quantity}</td>
            <td className="py-2 px-4 text-right">—</td>
            <td className="py-2 px-4 text-right">{totals.hours}</td>
            {showBudget && (
              <td className="py-2 px-4 text-right">${totals.budget.toLocaleString()}</td>
            )}
            <td className="py-2 px-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
