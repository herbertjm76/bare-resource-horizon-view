
import { useState, useCallback } from 'react';
import { useMemberPermissions } from './useMemberPermissions';

export const useTeamMembersPermissions = () => {
  const { checkUserPermissions, isChecking, hasPermission, permissionError } = useMemberPermissions();
  const [permissionChecked, setPermissionChecked] = useState(false);

  const handleRetryPermission = useCallback(async () => {
    setPermissionChecked(false);
    const result = await checkUserPermissions();
    setPermissionChecked(true);
    return result;
  }, [checkUserPermissions]);

  return {
    checkUserPermissions,
    isChecking,
    hasPermission,
    permissionError,
    permissionChecked,
    setPermissionChecked,
    handleRetryPermission
  };
};
