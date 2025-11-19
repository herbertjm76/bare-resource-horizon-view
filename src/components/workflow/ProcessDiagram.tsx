import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderKanban, 
  UserSquare2, 
  Calendar, 
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  FileQuestion
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const ProcessDiagram: React.FC = () => {
  const navigate = useNavigate();
  
  const processSteps: ProcessStep[] = [
    {
      id: '1',
      title: 'Set Up Projects',
      description: 'Create and configure your projects with proper scope, timelines, and budgets',
      icon: FolderKanban,
      route: '/projects',
      color: 'bg-blue-500',
      status: 'current'
    },
    {
      id: '2', 
      title: 'Add Team Members',
      description: 'Invite team members and assign roles for each project',
      icon: UserSquare2,
      route: '/team-members',
      color: 'bg-green-500',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Plan Resources',
      description: 'Allocate team members to projects and plan weekly schedules',
      icon: Calendar,
      route: '/project-resourcing',
      color: 'bg-purple-500',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Track Financials',
      description: 'Monitor project budgets, billing, and profitability',
      icon: DollarSign,
      route: '/financial-control',
      color: 'bg-yellow-500',
      status: 'upcoming'
    }
  ];

  const getStepIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <FileQuestion className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleStepClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">How to Use This App</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow this step-by-step process to effectively manage your projects, team, and financials. 
          Click on any step to navigate directly to that section.
        </p>
      </div>

      {/* Process Flow */}
      <div className="relative">
        {/* Steps */}
        <div className="space-y-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === processSteps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-6 top-20 w-0.5 h-12 bg-border z-0" />
                )}
                
                {/* Step Card */}
                <Card 
                  className="relative cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary/20"
                  onClick={() => handleStepClick(step.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">Step {step.id}</span>
                          {getStepIcon(step.status)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      
                      {/* Action Arrow */}
                      <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Start with setting up 1-2 projects to get familiar with the system</li>
            <li>• Add team members early so you can begin planning resource allocation</li>
            <li>• Use the Weekly Overview to get a snapshot across table, grid, or carousel</li>
            <li>• Regular monitoring helps catch issues before they become problems</li>
            <li>• The Dashboard provides a bird's-eye view of everything happening</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};