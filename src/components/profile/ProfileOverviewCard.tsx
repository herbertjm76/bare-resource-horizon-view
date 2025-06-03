
import React from 'react';
import { Card } from '@/components/ui/card';
import { BasicInfoCard } from './overview/BasicInfoCard';
import { CapacityCard } from './overview/CapacityCard';
import { CurrentProjectsCard } from './overview/CurrentProjectsCard';
import { ProjectHistoryCard } from './overview/ProjectHistoryCard';

interface ProfileOverviewCardProps {
  profile: any;
  getUserInitials: () => string;
  handleAvatarUpdate: (url: string | null) => void;
}

export const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  profile,
  getUserInitials,
  handleAvatarUpdate
}) => {
  return (
    <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[2px] border-[#d8d4ff] rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Combined Card: Profile Picture + Basic Info (2/5 width) - Centered */}
        <BasicInfoCard
          profile={profile}
          getUserInitials={getUserInitials}
          handleAvatarUpdate={handleAvatarUpdate}
        />

        {/* Card 2: Current Capacity */}
        <CapacityCard profile={profile} />

        {/* Card 3: Current Projects */}
        <CurrentProjectsCard />

        {/* Card 4: Project History */}
        <ProjectHistoryCard />
      </div>
    </Card>
  );
};
