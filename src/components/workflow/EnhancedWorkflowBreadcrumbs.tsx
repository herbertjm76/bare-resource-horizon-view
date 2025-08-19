import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkflowStep {
  label: string;
  href: string;
  completed?: boolean;
  current?: boolean;
}

export const EnhancedWorkflowBreadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getWorkflowSteps = (pathname: string): WorkflowStep[] => {
    const steps: WorkflowStep[] = [
      { 
        label: 'Project Setup & Planning', 
        href: '/projects',
        completed: pathname !== '/projects'
      },
      { 
        label: 'Resource Allocation', 
        href: '/project-resourcing',
        completed: false,
        current: pathname === '/project-resourcing'
      }
    ];

    // Mark current step
    const currentIndex = steps.findIndex(step => step.href === pathname);
    if (currentIndex >= 0) {
      steps[currentIndex].current = true;
      // Mark previous steps as completed
      for (let i = 0; i < currentIndex; i++) {
        steps[i].completed = true;
      }
    }

    return steps;
  };

  const steps = getWorkflowSteps(location.pathname);
  const currentStepIndex = steps.findIndex(step => step.current);
  const nextStep = steps[currentStepIndex + 1];

  return (
    <div className="space-y-4">
      {/* Traditional Breadcrumb */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4" />
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4" />
            {step.current ? (
              <span className="text-foreground font-medium">
                {step.label}
              </span>
            ) : (
              <Link
                to={step.href}
                className="hover:text-foreground transition-colors"
              >
                {step.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Workflow Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">
              Project Lifecycle Progress
            </span>
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.current 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm ${
                      step.current ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {nextStep && (
            <Button variant="outline" size="sm" asChild>
              <Link to={nextStep.href} className="flex items-center gap-2">
                Next: {nextStep.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};