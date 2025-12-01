import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { SimpleBreadcrumbs } from '@/components/navigation/SimpleBreadcrumbs';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Users, 
  DollarSign, 
  BarChart3, 
  ArrowRight, 
  CheckCircle,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectsOnboarding = () => {
  const workflowSteps = [
    {
      step: 1,
      title: 'Project Setup & Planning',
      description: 'Create new projects, define scope, set timelines, and assign initial parameters',
      icon: FolderOpen,
      route: '/projects',
      features: [
        'Project creation wizard',
        'Scope definition',
        'Timeline planning',
        'Initial resource allocation'
      ],
      color: 'bg-theme-primary',
      borderColor: 'border-brand-violet/20'
    },
    {
      step: 2,
      title: 'Resource Planning & Allocation',
      description: 'Assign team members, allocate resources, and plan capacity across projects',
      icon: Users,
      route: '/project-resourcing',
      features: [
        'Team member assignment',
        'Skill matching',
        'Workload balancing',
        'Resource optimization'
      ],
      color: 'bg-blue-500',
      borderColor: 'border-blue-500/20'
    }
  ];

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <SimpleBreadcrumbs />
        
        <StandardizedPageHeader
          title="Project Management Workflow"
          description="Follow this comprehensive workflow to successfully manage your projects from inception to completion"
          icon={Play}
        >
          <Link to="/projects">
            <Button size="lg">
              <FolderOpen className="h-4 w-4 mr-2" />
              Go to Projects
            </Button>
          </Link>
        </StandardizedPageHeader>

        {/* Workflow Overview */}
        <div className="grid gap-6">
          {workflowSteps.map((step, index) => (
            <Card key={step.step} className={`p-6 ${step.borderColor} bg-gradient-to-r from-background to-muted/20`}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${step.color} text-white p-3 rounded-lg`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Step {step.step}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col items-center gap-4">
                  <Link to={step.route}>
                    <Button 
                      size="lg" 
                      className={`${step.color} hover:opacity-90 text-white min-w-[140px]`}
                    >
                      Start Step {step.step}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  
                  {/* Arrow to next step */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Getting Started CTA */}
        <Card className="p-8 text-center bg-gradient-to-r from-brand-violet/5 to-brand-violet/10 border-brand-violet/20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Begin your project management journey with our comprehensive workflow. 
              Start with project setup and progress through each stage for optimal results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects">
                <Button size="lg">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Start with Projects
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </StandardLayout>
  );
};

export default ProjectsOnboarding;