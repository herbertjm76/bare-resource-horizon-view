
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const DashboardHeader = ({ userName }: { userName: string }) => {
  const { company } = useCompany();

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {company?.name || 'Your Company'} Dashboard
        </h1>
        <p className="text-white/80">
          Welcome, {userName}
        </p>
      </div>
      <Button 
        variant="ghost"
        className="text-white hover:bg-white/10"
        onClick={() => supabase.auth.signOut()}
      >
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </header>
  );
};
