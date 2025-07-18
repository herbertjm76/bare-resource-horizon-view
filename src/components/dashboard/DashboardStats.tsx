
import React from 'react';
import { Users, LineChart, Settings } from 'lucide-react';

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        icon={<LineChart className="mr-2 h-5 w-5 text-gray-600" />}
        title="Projects"
        description="Manage and track your unlimited projects"
      />
      <StatCard
        icon={<Users className="mr-2 h-5 w-5 text-gray-600" />}
        title="Team"
        description="Collaborate with up to 50 team members"
      />
      <StatCard
        icon={<Settings className="mr-2 h-5 w-5 text-gray-600" />}
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
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
      {icon} {title}
    </h2>
    <p className="text-gray-700">{description}</p>
  </div>
);
