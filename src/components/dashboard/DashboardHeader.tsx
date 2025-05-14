
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Link } from 'react-router-dom';

export const DashboardHeader = ({ userName }: { userName: string }) => {
  const { company } = useCompany();

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {company?.name || 'Your Company'} Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {userName}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          asChild
          variant="ghost"
          className="text-gray-700 hover:bg-gray-100"
        >
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" /> My Profile
          </Link>
        </Button>
        <Button 
          variant="ghost"
          className="text-gray-700 hover:bg-gray-100"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
};
