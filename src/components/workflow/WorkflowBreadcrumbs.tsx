import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const WorkflowBreadcrumbs: React.FC = () => {
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
      case '/team-members':
        breadcrumbs.push({ label: 'Team Members' });
        break;
      case '/team-workload':
        breadcrumbs.push({ label: 'Team Workload' });
        break;
      case '/team-leave':
        breadcrumbs.push({ label: 'Team Leave' });
        break;
      case '/weekly-overview':
        breadcrumbs.push({ label: 'Weekly Overview' });
        break;
      case '/weekly-rundown':
        breadcrumbs.push({ label: 'Weekly Overview' });
        break;
      default:
        // Don't show breadcrumbs for unknown routes
        return [];
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
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
  );
};