
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { logger } from '@/utils/logger';

interface FinancialData {
  totalProjectRevenue: number;
  averageProjectValue: number;
  projectsWithoutFees: number;
  averageHourlyRate: number;
}

export const useFinancialInsights = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { rates } = useOfficeSettings();

  useEffect(() => {
    const calculateFinancialInsights = async () => {
      if (!company) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch project stages/fees
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('fee, project_id')
          .eq('company_id', company.id);

        if (stagesError) {
          console.error('Error fetching project stages:', stagesError);
          return;
        }

        // Fetch projects count
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id')
          .eq('company_id', company.id);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          return;
        }

        const totalProjectRevenue = projectStages?.reduce((sum, stage) => sum + (stage.fee || 0), 0) || 0;
        const averageProjectValue = projects?.length ? totalProjectRevenue / projects.length : 0;
        
        // Calculate projects without fees
        const projectsWithFees = new Set(projectStages?.map(stage => stage.project_id) || []);
        const projectsWithoutFees = (projects?.length || 0) - projectsWithFees.size;

        // Calculate average hourly rate from office rates
        const employeeRates = rates?.filter(rate => rate.type === 'role').map(rate => rate.value) || [];
        const averageHourlyRate = employeeRates.length > 0 ? 
          employeeRates.reduce((sum, rate) => sum + rate, 0) / employeeRates.length : 75;

        logger.debug('Operational insights calculated:', {
          totalProjectRevenue,
          averageProjectValue,
          projectsWithoutFees,
          averageHourlyRate
        });

        setFinancialData({
          totalProjectRevenue,
          averageProjectValue,
          projectsWithoutFees,
          averageHourlyRate
        });

      } catch (error) {
        console.error('Error calculating operational insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateFinancialInsights();
  }, [company, rates]);

  return { financialData, isLoading };
};
