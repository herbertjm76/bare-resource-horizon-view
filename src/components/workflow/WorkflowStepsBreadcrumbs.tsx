import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface WorkflowStep {
  name: string;
  href?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface WorkflowStepsBreadcrumbsProps {
  onNewProject?: () => void;
}

export const WorkflowStepsBreadcrumbs: React.FC<WorkflowStepsBreadcrumbsProps> = ({
  onNewProject
}) => {
  const location = useLocation();
  
  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ];

    switch (pathname) {
      case '/projects':
        breadcrumbs.push({ label: 'Project Setup & Planning' });
        break;
      case '/project-resourcing':
        breadcrumbs.push(
          { label: 'Project Setup & Planning', href: '/projects' },
          { label: 'Resource Allocation' }
        );
        break;
      case '/financial-control':
        breadcrumbs.push(
          { label: 'Project Setup & Planning', href: '/projects' },
          { label: 'Resource Allocation', href: '/project-resourcing' },
          { label: 'Financial Control' }
        );
        break;
      default:
        return [];
    }

    return breadcrumbs;
  };

  const getWorkflowSteps = (pathname: string): WorkflowStep[] => {
    const steps: WorkflowStep[] = [
      { 
        name: 'Project Setup', 
        href: '/projects',
        status: pathname === '/projects' ? 'current' : 
                ['/project-resourcing', '/financial-control'].includes(pathname) ? 'completed' : 'upcoming'
      },
      { 
        name: 'Resource Planning', 
        href: '/project-resourcing',
        status: pathname === '/project-resourcing' ? 'current' : 
                pathname === '/projects' ? 'upcoming' : 'completed'
      },
      { 
        name: 'Financial Control', 
        href: '/financial-control',
        status: pathname === '/financial-control' ? 'current' :
                ['/projects', '/project-resourcing'].includes(pathname) ? 'upcoming' : 'completed'
      }
    ];

    return steps;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);
  const workflowSteps = getWorkflowSteps(location.pathname);

  // Don't show for non-workflow pages
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Home className="w-4 h-4" />
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4" />
            {breadcrumb.href ? (
              <Link
                to={breadcrumb.href}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {breadcrumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Workflow Steps with CTA */}
      <div className="bg-gradient-to-r from-brand-violet/5 to-brand-purple/5 border border-brand-violet/10 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Workflow Steps */}
          <div className="flex flex-wrap items-center gap-2">
            {workflowSteps.map((step, index) => (
              <div key={step.name} className="flex items-center">
                {step.href && step.status !== 'upcoming' ? (
                  <Link to={step.href}>
                    <Badge 
                      variant={step.status === 'current' ? 'default' : 'secondary'}
                      className={`
                        px-3 py-1 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity
                        ${step.status === 'current' ? 'bg-brand-violet text-white' : 'bg-green-100 text-green-700 border-green-200'}
                      `}
                    >
                      {step.name}
                    </Badge>
                  </Link>
                ) : (
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
                )}
                {index < workflowSteps.length - 1 && (
                  <div className="w-2 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
          
          {/* CTA Button - only show on projects page */}
          {location.pathname === '/projects' && onNewProject && (
            <Button onClick={onNewProject} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              New Project Wizard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};