
import React from 'react';
import { OfficeSettingsLayout } from '@/components/settings/OfficeSettingsLayout';
import { OfficeSettingsPageContent } from '@/components/settings/OfficeSettingsPageContent';

const OfficeSettings = () => {
  return (
    <OfficeSettingsLayout>
      <OfficeSettingsPageContent />
    </OfficeSettingsLayout>
  );
};

export default OfficeSettings;
