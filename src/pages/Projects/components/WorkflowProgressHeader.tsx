import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkflowStep {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface WorkflowProgressHeaderProps {
  onNewProject: () => void;
}

export const WorkflowProgressHeader: React.FC<WorkflowProgressHeaderProps> = ({
  onNewProject
}) => {
  const steps: WorkflowStep[] = [
    { name: 'Setup Projects', status: 'current' },
    { name: 'Resource Planning', status: 'upcoming' },
    { name: 'Weekly Allocation', status: 'upcoming' },
    { name: 'Performance Review', status: 'upcoming' }
  ];

  return (
    <div className="space-y-4">
      {/* Workflow progress with integrated CTA */}
      <div className="bg-gradient-to-r from-brand-violet/5 to-brand-purple/5 border border-brand-violet/10 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-violet/10 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-brand-violet" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Project Setup & Planning
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Create and manage projects with integrated financial planning and team composition
                </p>
              </div>
            </div>

            {/* Workflow steps */}
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.name} className="flex items-center">
                  <Badge 
                    variant={step.status === 'current' ? 'default' : step.status === 'completed' ? 'secondary' : 'outline'}
                    className={`
                      px-3 py-1 text-xs font-medium
                      ${step.status === 'current' ? 'bg-brand-violet text-white' : ''}
                      ${step.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                      ${step.status === 'upcoming' ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {step.name}
                  </Badge>
                  {index < steps.length - 1 && (
                    <div className="w-2 h-px bg-border mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Primary CTA integrated into workflow */}
          <Button onClick={onNewProject} size="lg" className="bg-brand-violet hover:bg-brand-violet/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project Wizard
          </Button>
        </div>
      </div>
    </div>
  );
};