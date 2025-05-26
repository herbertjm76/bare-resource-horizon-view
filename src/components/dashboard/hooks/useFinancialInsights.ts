
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface FinancialData {
  totalProjectRevenue: number;
  averageProjectValue: number;
  totalMonthlyCosts: number;
  profitMargin: number;
  revenuePerEmployee: number;
  unpaidInvoices: number;
  overdueAmount: number;
  highestRateEmployee: number;
  lowestRateEmployee: number;
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
          .select('fee, invoice_status, project_id')
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

        // Fetch team members count
        const { data: teamMembers, error: teamError } = await supabase
          .from('profiles')
          .select('id, weekly_capacity')
          .eq('company_id', company.id);

        if (teamError) {
          console.error('Error fetching team members:', teamError);
          return;
        }

        const teamSize = teamMembers?.length || 1;
        const totalProjectRevenue = projectStages?.reduce((sum, stage) => sum + (stage.fee || 0), 0) || 0;
        const averageProjectValue = projects?.length ? totalProjectRevenue / projects.length : 0;
        
        // Calculate unpaid invoices
        const unpaidInvoices = projectStages?.filter(stage => 
          stage.invoice_status === 'Pending' || stage.invoice_status === 'Overdue'
        ).length || 0;
        
        const overdueAmount = projectStages?.filter(stage => 
          stage.invoice_status === 'Pending' || stage.invoice_status === 'Overdue'
        ).reduce((sum, stage) => sum + (stage.fee || 0), 0) || 0;

        // Calculate projects without fees
        const projectsWithFees = new Set(projectStages?.map(stage => stage.project_id) || []);
        const projectsWithoutFees = (projects?.length || 0) - projectsWithFees.size;

        // Estimate monthly costs (basic assumption: $5k per employee)
        const totalMonthlyCosts = teamSize * 5000;
        
        // Calculate profit margin
        const monthlyRevenue = totalProjectRevenue / 12; // Assume annual revenue spread
        const profitMargin = monthlyRevenue > 0 ? Math.round(((monthlyRevenue - totalMonthlyCosts) / monthlyRevenue) * 100) : 0;
        
        // Revenue per employee (annualized)
        const revenuePerEmployee = teamSize > 0 ? totalProjectRevenue / teamSize : 0;

        // Calculate rate insights from office rates
        const employeeRates = rates?.filter(rate => rate.type === 'role').map(rate => rate.value) || [];
        const highestRateEmployee = employeeRates.length > 0 ? Math.max(...employeeRates) : 0;
        const lowestRateEmployee = employeeRates.length > 0 ? Math.min(...employeeRates) : 0;
        const averageHourlyRate = employeeRates.length > 0 ? 
          employeeRates.reduce((sum, rate) => sum + rate, 0) / employeeRates.length : 75;

        console.log('Financial insights calculated:', {
          totalProjectRevenue,
          averageProjectValue,
          totalMonthlyCosts,
          profitMargin,
          revenuePerEmployee,
          unpaidInvoices,
          overdueAmount,
          projectsWithoutFees,
          teamSize,
          averageHourlyRate
        });

        setFinancialData({
          totalProjectRevenue,
          averageProjectValue,
          totalMonthlyCosts,
          profitMargin,
          revenuePerEmployee,
          unpaidInvoices,
          overdueAmount,
          highestRateEmployee,
          lowestRateEmployee,
          projectsWithoutFees,
          averageHourlyRate
        });

      } catch (error) {
        console.error('Error calculating financial insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateFinancialInsights();
  }, [company, rates]);

  return { financialData, isLoading };
};
