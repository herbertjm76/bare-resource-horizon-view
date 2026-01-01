
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';

export const useUserSession = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { isDemoMode, user: demoUser } = useDemoAuth();

  useEffect(() => {
    // Demo mode: treat demo user as authenticated
    if (isDemoMode) {
      setUserId(demoUser?.id ?? null);
      return;
    }

    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserId(data.session.user.id);
          logger.debug('Session found, user ID:', data.session.user.id);
        } else {
          logger.debug('No active session found');
          toast.error("You must be logged in to access this page");
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to authenticate user");
      }
    };

    getSession();
  }, [isDemoMode, demoUser?.id]);

  return userId;
};

