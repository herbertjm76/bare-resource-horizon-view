import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowRight } from 'lucide-react';

const CompanyLanding: React.FC = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const checkMembership = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session?.user;
        setIsAuthenticated(authenticated);

        // Fetch company by slug
        const { data: company } = await supabase
          .from('companies')
          .select('id, name')
          .eq('subdomain', companySlug)
          .single();

        if (company) {
          setCompanyName(company.name);

          // If authenticated, check if user is a member
          if (authenticated && session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('company_id')
              .eq('id', session.user.id)
              .single();

            setIsMember(profile?.company_id === company.id);
          }
        }
      } catch (error) {
        console.error('Error checking membership:', error);
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
  if (isAuthenticated && isMember) {
    return <Navigate to={`/${companySlug}/dashboard`} replace />;
  }

  // Show landing page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome to {companyName || 'Bareresource'}</CardTitle>
            <CardDescription className="mt-2">
              {isAuthenticated 
                ? "You don't have access to this company. Please contact an administrator."
                : "Sign in or create an account to get started"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isAuthenticated ? (
            <>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/auth?mode=signin'}
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => window.location.href = '/auth?mode=signup'}
              >
                Create Account
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLanding;
