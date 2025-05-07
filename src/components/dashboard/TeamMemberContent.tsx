
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';
import { TeamManagement } from './TeamManagement';
import { toast } from 'sonner';

interface TeamMemberContentProps {
  userProfile: any;
  isProfileLoading?: boolean;
  teamMembers: any[];
  onRefresh?: () => void;
}

export const TeamMemberContent = ({ 
  userProfile, 
  isProfileLoading = false,
  teamMembers = [],
  onRefresh 
}: TeamMemberContentProps) => {
  const { company, loading: companyLoading, error: companyError } = useCompany();

  // Use companyId from userProfile if available, otherwise from company context
  const companyId = userProfile?.company_id || company?.id;
  
  // Generate invite URL
  const baseUrl = window.location.origin;
  const inviteUrl = `${baseUrl}/join`;

  // Log the available company data for debugging
  useEffect(() => {
    console.log('TeamMemberContent - Company data:', {
      userProfileCompanyId: userProfile?.company_id,
      contextCompanyId: company?.id,
      effectiveCompanyId: companyId,
      companyLoading,
      companyError
    });
  }, [userProfile, company, companyId, companyLoading, companyError]);

  // Display warning if company ID is missing
  useEffect(() => {
    if (!isProfileLoading && !companyLoading && !companyId) {
      console.error('No company ID available in TeamMemberContent');
      toast.error('Missing company ID. Please try refreshing the page or contact support.');
    }
  }, [companyId, isProfileLoading, companyLoading]);

  if (isProfileLoading || companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle error state when no company is found
  if (!company && companyError) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center">
        <p className="mb-4 text-center text-red-500">
          {companyError || 'Could not load company data'}
        </p>
        <Button onClick={onRefresh}>Retry</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Team Members</h2>
        <div className="flex space-x-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>
      
      {companyId ? (
        <TeamManagement 
          teamMembers={teamMembers} 
          inviteUrl={inviteUrl}
          userRole={userProfile?.role || 'member'}
          onRefresh={onRefresh}
          companyId={companyId}
        />
      ) : (
        <Card className="p-8 text-center">
          <p className="text-red-500 font-medium">Company ID is missing. Cannot load team members.</p>
          <p className="mt-2">This is required to associate new team members with your company.</p>
          <Button onClick={onRefresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </Card>
      )}
    </div>
  );
};
