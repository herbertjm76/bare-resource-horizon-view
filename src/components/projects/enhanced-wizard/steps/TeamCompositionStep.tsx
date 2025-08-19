import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Users, MapPin, Calculator } from 'lucide-react';
import { useRateCalculations } from '@/hooks/project-financial/useRateCalculations';
import { ProjectWizardData } from '../ProjectSetupWizard';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';

interface TeamCompositionStepProps {
  data: ProjectWizardData;
  onUpdate: (updates: Partial<ProjectWizardData>) => void;
}

export const TeamCompositionStep: React.FC<TeamCompositionStepProps> = ({ data, onUpdate }) => {
  const [selectedStage, setSelectedStage] = useState(data.selectedStages[0] || '');
  const { office_stages } = useOfficeSettings();
  const { availableReferences, getRateForReference, calculateBudget, calculateTotalHours } = useRateCalculations(data.rateBasisStrategy);

  const currentStageComposition = data.teamComposition[selectedStage] || [];
  
  const addTeamMember = () => {
    const newComposition = [...currentStageComposition, {
      referenceId: '',
      plannedQuantity: 1,
      plannedHoursPerPerson: 40,
      rateSnapshot: 0
    }];
    
    onUpdate({
      teamComposition: {
        ...data.teamComposition,
        [selectedStage]: newComposition
      }
    });
  };

  const updateTeamMember = (index: number, updates: Partial<typeof currentStageComposition[0]>) => {
    const newComposition = [...currentStageComposition];
    newComposition[index] = { ...newComposition[index], ...updates };
    
    // Auto-update rate snapshot when reference changes
    if (updates.referenceId) {
      newComposition[index].rateSnapshot = getRateForReference(updates.referenceId);
    }
    
    onUpdate({
      teamComposition: {
        ...data.teamComposition,
        [selectedStage]: newComposition
      }
    });
    
    // Recalculate totals
    updateTotals();
  };

  const removeTeamMember = (index: number) => {
    const newComposition = currentStageComposition.filter((_, i) => i !== index);
    onUpdate({
      teamComposition: {
        ...data.teamComposition,
        [selectedStage]: newComposition
      }
    });
    updateTotals();
  };

  const updateTotals = () => {
    const allCompositions = Object.values(data.teamComposition);
    const totalBudget = allCompositions.reduce((sum, composition) => sum + calculateBudget(composition), 0);
    const totalHours = allCompositions.reduce((sum, composition) => sum + calculateTotalHours(composition), 0);
    const budgetVariance = totalBudget - data.totalFee;
    
    onUpdate({ totalBudget, totalHours, budgetVariance });
  };

  const stageOptions = useMemo(() => {
    return data.selectedStages.map(stageId => {
      const stage = office_stages.find(s => s.id === stageId);
      return { id: stageId, name: stage?.name || 'Unknown Stage' };
    });
  }, [data.selectedStages, office_stages]);

  const stageBudget = calculateBudget(currentStageComposition);
  const stageHours = calculateTotalHours(currentStageComposition);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Plan Team Composition</h3>
        <p className="text-muted-foreground">
          Define how many people and hours are needed for each stage using {data.rateBasisStrategy === 'role_based' ? 'job roles' : 'office locations'}.
        </p>
      </div>

      {/* Stage Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data.rateBasisStrategy === 'role_based' ? <Users className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            Select Stage to Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stageOptions.map(stage => (
              <Button
                key={stage.id}
                variant={selectedStage === stage.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStage(stage.id)}
              >
                {stage.name}
                {data.teamComposition[stage.id]?.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {data.teamComposition[stage.id].length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Composition for Selected Stage */}
      {selectedStage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Team Composition - {stageOptions.find(s => s.id === selectedStage)?.name}</span>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span className="font-medium">${stageBudget.toLocaleString()}</span>
                  <span className="text-muted-foreground">({stageHours}h)</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStageComposition.map((member, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                <div className="col-span-4">
                  <Label>{data.rateBasisStrategy === 'role_based' ? 'Role' : 'Location'}</Label>
                  <Select
                    value={member.referenceId}
                    onValueChange={(value) => updateTeamMember(index, { referenceId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableReferences.map(ref => (
                        <SelectItem key={ref.id} value={ref.id}>
                          {ref.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={member.plannedQuantity}
                    onChange={(e) => updateTeamMember(index, { plannedQuantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>Hours/Person</Label>
                  <Input
                    type="number"
                    min="1"
                    value={member.plannedHoursPerPerson}
                    onChange={(e) => updateTeamMember(index, { plannedHoursPerPerson: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    value={member.rateSnapshot}
                    onChange={(e) => updateTeamMember(index, { rateSnapshot: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label>Total</Label>
                  <div className="text-sm font-medium py-2">
                    ${(member.plannedQuantity * member.plannedHoursPerPerson * member.rateSnapshot).toLocaleString()}
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button onClick={addTeamMember} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Total Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">${data.totalFee.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Project Fee</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">${data.totalBudget.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Planned Budget</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{data.totalHours.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              data.budgetVariance > 0 ? 'bg-destructive/10 text-destructive' : 'bg-green-50 text-green-700'
            }`}>
              <div className="text-2xl font-bold">
                {data.budgetVariance > 0 ? '+' : ''}${Math.abs(data.budgetVariance).toLocaleString()}
              </div>
              <div className="text-sm">
                {data.budgetVariance > 0 ? 'Over Budget' : 'Under Budget'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};