
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { OfficeSettingsProvider } from '@/context/officeSettings';
import { ProfileOverviewCard } from '@/components/profile/ProfileOverviewCard';
import { ProfileLayout } from './Profile/components/ProfileLayout';
import { ProfileHeader } from './Profile/components/ProfileHeader';
import { ProfileTabs } from './Profile/components/ProfileTabs';
import { ProfileLoadingState } from './Profile/components/ProfileLoadingState';
import { ProfileErrorState } from './Profile/components/ProfileErrorState';
import { useProfile } from './Profile/hooks/useProfile';
import { PermissionsDebugPanel } from '@/components/profile/PermissionsDebugPanel';
import { usePermissions } from '@/hooks/usePermissions';

export default function Profile() {
  const { company, loading: companyLoading } = useCompany();
  const { canUseViewAs } = usePermissions();
  const {
    profile,
    loading,
    saving,
    error,
    handleChange,
    handleDateChange,
    handleSave,
    handleAvatarUpdate,
    getUserInitials
  } = useProfile();

  if (loading || companyLoading) {
    return <ProfileLoadingState />;
  }

  if (!profile) {
    return <ProfileErrorState />;
  }

  return (
    <ProfileLayout>
      <OfficeSettingsProvider>
        <ProfileHeader />
        
        <ProfileOverviewCard
          profile={profile}
          getUserInitials={getUserInitials}
          handleAvatarUpdate={handleAvatarUpdate}
        />

        <ProfileTabs
          profile={profile}
          company={company}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handleAvatarUpdate={handleAvatarUpdate}
          getUserInitials={getUserInitials}
          saving={saving}
          onSave={handleSave}
          error={error}
        />

        {/* Permissions Debug Panel - only visible to admins/owners */}
        {canUseViewAs && (
          <div className="mt-6">
            <PermissionsDebugPanel />
          </div>
        )}
      </OfficeSettingsProvider>
    </ProfileLayout>
  );
}
