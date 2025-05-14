
import React from 'react';
import { Users, LineChart, Settings } from 'lucide-react';

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<LineChart className="mr-2 h-5 w-5" />}
        title="Projects"
        description="Manage and track your unlimited projects"
      />
      <StatCard
        icon={<Users className="mr-2 h-5 w-5" />}
        title="Team"
        description="Collaborate with up to 50 team members"
      />
      <StatCard
        icon={<Settings className="mr-2 h-5 w-5" />}
        title="Settings"
        description="Customize your account and company settings"
      />
    </div>
  );
};

const StatCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
      {icon} {title}
    </h2>
    <p className="text-white/80">{description}</p>
  </div>
);
