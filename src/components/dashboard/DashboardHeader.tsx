
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Link } from 'react-router-dom';

export const DashboardHeader = ({ userName }: { userName: string }) => {
  const { company } = useCompany();

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {company?.name || 'Your Company'} Dashboard
        </h1>
        <p className="text-white/80 font-light mt-1">
          Welcome, {userName}
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          asChild
          variant="ghost"
          className="text-white hover:bg-white/10"
          size="sm"
        >
          <Link to="/profile">
            <User className="h-4 w-4" /> Profile
          </Link>
        </Button>
        <Button 
          variant="ghost"
          className="text-white hover:bg-white/10"
          size="sm"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
};
