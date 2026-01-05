import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import JoinMainSection from './JoinMainSection';

const CompanyLanding: React.FC = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session?.user;
        setIsAuthenticated(authenticated);

        // Use secure function to fetch limited company info (no auth required)
        const { data: companyResult } = await supabase
          .rpc('get_company_by_subdomain', { subdomain_param: companySlug });
        
        const company = companyResult && companyResult.length > 0 ? companyResult[0] : null;

        if (company) {
          setCompanyName(company.name);
          setCompanyData(company);
        } else {
          setCompanyName(companySlug || 'Company');
          setCompanyData(null);
        }

        // If authenticated, check if user is a member
        if (authenticated && session?.user && company) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', session.user.id)
            .maybeSingle();

          setIsMember(profile?.company_id === company.id);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setCompanyName(companySlug || 'Company');
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [companySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect to dashboard if user is a member
  if (isAuthenticated && isMember && companyData) {
    return <Navigate to={`/${companySlug}/dashboard`} replace />;
  }

  // Show unified login/signup form for everyone
  return (
    <JoinMainSection
      companyName={companyName}
      company={companyData}
      inviteCode=""
    />
  );
};

export default CompanyLanding;
