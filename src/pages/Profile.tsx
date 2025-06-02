
import React from "react";
import { useCompany } from "@/context/CompanyContext";
import { ProfileOverviewCard } from '@/components/profile/ProfileOverviewCard';
import { ProfileLayout } from './Profile/components/ProfileLayout';
import { ProfileHeader } from './Profile/components/ProfileHeader';
import { ProfileTabs } from './Profile/components/ProfileTabs';
import { ProfileLoadingState } from './Profile/components/ProfileLoadingState';
import { ProfileErrorState } from './Profile/components/ProfileErrorState';
import { useProfile } from './Profile/hooks/useProfile';

export default function Profile() {
  const { company, loading: companyLoading } = useCompany();
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
      <ProfileHeader />
      
      <ProfileOverviewCard
        profile={profile}
        getUserInitials={getUserInitials}
        handleAvatarUpdate={handleAvatarUpdate}
        handleChange={handleChange}
        onSave={handleSave}
        saving={saving}
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
    </ProfileLayout>
  );
}
