
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserSession = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data
        } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserId(data.session.user.id);
          if (import.meta.env.DEV) {
            console.log('Session found, user ID:', data.session.user.id);
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('No active session found');
          }
          toast.error("You must be logged in to access this page");
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to authenticate user");
      }
    };
    getSession();
  }, []);

  return userId;
};
