import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Briefcase, User, UserCheck, Percent } from 'lucide-react';
import type { TeamCompositionItem } from '@/hooks/useStageTeamComposition';

interface TeamCompositionTableProps {
  items: TeamCompositionItem[];
  onDelete: (itemId: string) => void;
  isDeleting?: boolean;
  showBudget?: boolean;
  contractedWeeks?: number;
}

export const TeamCompositionTable: React.FC<TeamCompositionTableProps> = ({
  items,
  onDelete,
  isDeleting = false,
  showBudget = false,
  contractedWeeks = 0
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">No resources allocated to this stage</p>
        <p className="text-xs text-muted-foreground mt-1">Add resources using the form above</p>
      </div>
    );
  }

  // Calculate allocation % from hours (assuming 40hr week base)
  const getWeeklyPercent = (totalHours: number) => {
    if (contractedWeeks <= 0) return Math.round((totalHours / 40) * 100);
    const weeklyHours = totalHours / contractedWeeks;
    return Math.round((weeklyHours / 40) * 100);
  };

  const totals = {
    hours: items.reduce((sum, item) => sum + item.totalPlannedHours, 0),
    budget: items.reduce((sum, item) => sum + item.totalBudgetAmount, 0)
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="py-2 px-4 text-left font-medium">Role</th>
            <th className="py-2 px-4 text-left font-medium">Person</th>
            <th className="py-2 px-4 text-right font-medium">Allocation</th>
            <th className="py-2 px-4 text-right font-medium">Total Hrs</th>
            {showBudget && (
              <th className="py-2 px-4 text-right font-medium">Budget</th>
            )}
            <th className="py-2 px-4 text-center font-medium w-16">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const weeklyPercent = getWeeklyPercent(item.totalPlannedHours);
            
            return (
              <tr key={item.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">
                      {item.referenceType === 'role' 
                        ? item.referenceName 
                        : item.roleName || 'No role'
                      }
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  {item.referenceType === 'member' ? (
                    <div className="flex items-center gap-2">
                      {item.memberType === 'pre_registered' ? (
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                      )}
                      <span>{item.referenceName}</span>
                      {item.memberType === 'pre_registered' && (
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Percent className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{weeklyPercent}%</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right font-medium">{Math.round(item.totalPlannedHours)}</td>
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
            );
          })}
          {/* Totals row */}
          <tr className="border-t bg-muted/50 font-medium">
            <td className="py-2 px-4" colSpan={2}>Total ({items.length} resources)</td>
            <td className="py-2 px-4 text-right">—</td>
            <td className="py-2 px-4 text-right">{Math.round(totals.hours)}</td>
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
