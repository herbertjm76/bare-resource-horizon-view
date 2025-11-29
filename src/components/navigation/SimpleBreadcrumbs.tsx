import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const SimpleBreadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    switch (pathname) {
      case '/projects':
        breadcrumbs.push({ label: 'Projects' });
        break;
      case '/projects/onboarding':
        breadcrumbs.push(
          { label: 'Projects', href: '/projects' },
          { label: 'Workflow Guide' }
        );
        break;
      case '/project-resourcing':
        breadcrumbs.push(
          { label: 'Projects', href: '/projects' },
          { label: 'Resource Allocation' }
        );
        break;
      case '/financial-control':
        breadcrumbs.push(
          { label: 'Projects', href: '/projects' },
          { label: 'Financial Control' }
        );
        break;
      default:
        return [];
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show for root pages
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
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
  );
};