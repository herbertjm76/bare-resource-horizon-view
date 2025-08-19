import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectBasicInfoStep } from './steps/ProjectBasicInfoStep';
import { RateBasisStep } from './steps/RateBasisStep';
import { StageConfigurationStep } from './steps/StageConfigurationStep';
import { TeamCompositionStep } from './steps/TeamCompositionStep';
import { BudgetValidationStep } from './steps/BudgetValidationStep';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProjectWizardData {
  // Basic Info
  code: string;
  name: string;
  managerId: string;
  country: string;
  officeId: string;
  status: string;
  totalFee: number;
  currency: string;
  
  // Rate Basis
  rateBasisStrategy: 'role_based' | 'location_based';
  
  // Stages
  selectedStages: string[];
  stageTimelines: Record<string, { weeks: number; startDate: string }>;
  
  // Team Composition (per stage)
  teamComposition: Record<string, Array<{
    referenceId: string;
    plannedQuantity: number;
    plannedHoursPerPerson: number;
    rateSnapshot: number;
  }>>;
  
  // Calculated totals
  totalBudget: number;
  totalHours: number;
  budgetVariance: number;
}

interface ProjectSetupWizardProps {
  onSubmit: (data: ProjectWizardData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Project details and total fee' },
  { id: 'rate-basis', title: 'Rate Strategy', description: 'Choose rate calculation method' },
  { id: 'stages', title: 'Stage Setup', description: 'Configure project stages and timelines' },
  { id: 'team', title: 'Team Planning', description: 'Plan team composition per stage' },
  { id: 'validation', title: 'Budget Review', description: 'Review and validate budget calculations' }
];

export const ProjectSetupWizard: React.FC<ProjectSetupWizardProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<ProjectWizardData>({
    code: '',
    name: '',
    managerId: '',
    country: '',
    officeId: '',
    status: 'Planning',
    totalFee: 0,
    currency: 'USD',
    rateBasisStrategy: 'role_based',
    selectedStages: [],
    stageTimelines: {},
    teamComposition: {},
    totalBudget: 0,
    totalHours: 0,
    budgetVariance: 0
  });

  const updateWizardData = (updates: Partial<ProjectWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return wizardData.code && wizardData.name && wizardData.totalFee > 0;
      case 1: // Rate Basis
        return wizardData.rateBasisStrategy;
      case 2: // Stages
        return wizardData.selectedStages.length > 0;
      case 3: // Team Composition
        return Object.keys(wizardData.teamComposition).length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(wizardData);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{STEPS[currentStep].title}</span>
            <span>Step {currentStep + 1} of {STEPS.length}</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {STEPS[currentStep].description}
          </p>
        </div>
      </DialogHeader>

      <div className="py-6">
        {currentStep === 0 && (
          <ProjectBasicInfoStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        )}
        
        {currentStep === 1 && (
          <RateBasisStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        )}
        
        {currentStep === 2 && (
          <StageConfigurationStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        )}
        
        {currentStep === 3 && (
          <TeamCompositionStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        )}
        
        {currentStep === 4 && (
          <BudgetValidationStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        )}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handlePrevious}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>

        <div className="flex gap-2">
          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !canProceed()}
            >
              Create Project
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};