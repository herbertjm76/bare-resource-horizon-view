
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { EnhancedWorkflowBreadcrumbs } from '@/components/workflow/EnhancedWorkflowBreadcrumbs';
import { WorkflowActionSection } from '@/components/workflow/WorkflowActionSection';
import { ProjectSetupWizard } from '@/components/projects/enhanced-wizard/ProjectSetupWizard';
import { FolderOpen, Plus, ArrowRight, Settings, Users, BarChart3 } from 'lucide-react';

const Projects = () => {
  const { projects, refetch } = useProjects();
  const [showWizard, setShowWizard] = useState(false);

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => 
    project.status === 'In Progress'
  ).length;
  const completedProjects = projects.filter(project => 
    project.status === 'Complete'
  ).length;
  const totalOffices = new Set(projects.map(project => project.office?.name).filter(Boolean)).size;

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: "All projects in system",
      badgeText: totalProjects > 15 ? 'High Volume' : totalProjects > 8 ? 'Active Portfolio' : 'Growing',
      badgeColor: totalProjects > 15 ? 'blue' : totalProjects > 8 ? 'green' : 'orange'
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: "Currently in progress",
      badgeText: activeProjects > 8 ? 'Very Busy' : activeProjects > 4 ? 'Busy' : activeProjects > 0 ? 'Normal Load' : 'Available',
      badgeColor: activeProjects > 8 ? 'orange' : activeProjects > 4 ? 'blue' : activeProjects > 0 ? 'green' : 'gray'
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: `${completedProjects} of ${totalProjects} completed`,
      badgeText: completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : completionRate >= 40 ? 'Average' : 'Needs Focus',
      badgeColor: completionRate >= 80 ? 'green' : completionRate >= 60 ? 'blue' : completionRate >= 40 ? 'orange' : 'red'
    },
    {
      title: "Office Locations",
      value: totalOffices,
      subtitle: totalOffices === 1 ? "Single location" : "Multi-location operations",
      badgeText: totalOffices > 3 ? 'Global Reach' : totalOffices > 1 ? 'Multi-Location' : 'Single Office',
      badgeColor: totalOffices > 3 ? 'blue' : totalOffices > 1 ? 'green' : 'gray'
    }
  ];

  const handleWizardSubmit = async (data: any) => {
    console.log('Project wizard data:', data);
    // TODO: Implement project creation logic
    setShowWizard(false);
    refetch();
  };

  const workflowActions = [
    {
      title: 'New Project Wizard',
      description: 'Guided 5-step setup with financial planning and team composition',
      action: () => setShowWizard(true),
      icon: Plus,
      badge: { text: 'Recommended', variant: 'default' as const }
    },
    {
      title: 'Project Configuration',
      description: 'Advanced project settings and stage management',
      action: () => console.log('Open config'),
      icon: Settings,
      variant: 'outline' as const
    },
    {
      title: 'Team Management',
      description: 'Manage team composition and resource planning',
      action: () => console.log('Open team mgmt'),
      icon: Users,
      variant: 'outline' as const
    }
  ];

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <EnhancedWorkflowBreadcrumbs />
        
        <StandardizedPageHeader
          title="Project Setup & Planning"
          description="Create and manage projects with integrated financial planning and team composition"
          icon={FolderOpen}
        />

        <WorkflowActionSection
          title="Quick Actions"
          subtitle="Start a new project or configure existing ones"
          actions={workflowActions}
        />

        <StandardizedExecutiveSummary
          metrics={metrics}
          gradientType="purple"
        />
        
        <OfficeSettingsProvider>
          <ProjectsList />
        </OfficeSettingsProvider>

        <Dialog open={showWizard} onOpenChange={setShowWizard}>
          <ProjectSetupWizard
            onSubmit={handleWizardSubmit}
            onCancel={() => setShowWizard(false)}
          />
        </Dialog>
      </div>
    </StandardLayout>
  );
};

export default Projects;
