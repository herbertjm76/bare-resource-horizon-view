
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { Dialog } from '@/components/ui/dialog';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { ProjectSetupWizard, ProjectWizardData } from '@/components/projects/enhanced-wizard/ProjectSetupWizard';
import { SimpleBreadcrumbs } from '@/components/navigation/SimpleBreadcrumbs';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { logger } from '@/utils/logger';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Projects = () => {
  const { refetch } = useProjects();
  const { company } = useCompany();
  const [showWizard, setShowWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWizardSubmit = async (data: ProjectWizardData) => {
    logger.debug('Project wizard data:', data);
    
    if (!company?.id) {
      toast.error('No company context found');
      return;
    }

    if (!data.code?.trim() || !data.name?.trim()) {
      toast.error('Please complete required fields: Project Code and Project Name');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for unique project code
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('company_id', company.id)
        .eq('code', data.code.trim())
        .maybeSingle();

      if (existingProject) {
        toast.error(`Project code "${data.code}" already exists. Please use a unique code.`);
        setIsSubmitting(false);
        return;
      }

      // Get or create default office
      let { data: offices } = await supabase
        .from('offices')
        .select('id')
        .limit(1);

      let defaultOfficeId: string;
      if (!offices || offices.length === 0) {
        const { data: newOffice, error: createOfficeError } = await supabase
          .from('offices')
          .insert({ name: 'Default Office', country: data.country || 'Unknown' })
          .select('id')
          .single();

        if (createOfficeError) throw createOfficeError;
        defaultOfficeId = newOffice.id;
      } else {
        defaultOfficeId = offices[0].id;
      }

      // Insert project
      const { data: createdProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          code: data.code.trim(),
          name: data.name.trim(),
          company_id: company.id,
          project_manager_id: data.managerId || null,
          office_id: defaultOfficeId,
          temp_office_location_id: data.officeId || null,
          status: data.status || 'Active',
          country: data.country || 'Not Specified',
          current_stage: data.selectedStages?.[0] || 'Planning',
          stages: data.selectedStages || [],
          rate_basis_strategy: data.rateBasisStrategy,
          currency: data.currency
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert stage records if stages selected
      if (createdProject && data.selectedStages?.length > 0) {
        const stageInserts = data.selectedStages.map(stageName => ({
          project_id: createdProject.id,
          company_id: company.id,
          stage_name: stageName,
          fee: 0,
          is_applicable: true
        }));

        await supabase.from('project_stages').insert(stageInserts);
      }

      toast.success('Project successfully created!');
      setShowWizard(false);
      refetch();
    } catch (error: any) {
      logger.error('Error creating project:', error);
      toast.error('Failed to create project: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <SimpleBreadcrumbs />
        
        <ProjectsHeader />
        
        <OfficeSettingsProvider>
          <ProjectsList onNewProject={() => setShowWizard(true)} />

          <Dialog open={showWizard} onOpenChange={setShowWizard}>
            <ProjectSetupWizard
              onSubmit={handleWizardSubmit}
              onCancel={() => setShowWizard(false)}
              isLoading={isSubmitting}
            />
          </Dialog>
        </OfficeSettingsProvider>
      </div>
    </StandardLayout>
  );
};

export default Projects;
