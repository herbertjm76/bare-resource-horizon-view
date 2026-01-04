import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { DEMO_COMPANY_ID, DEMO_TEAM_MEMBERS } from '@/data/demoData';

// Demo user data - uses the first demo team member as the logged in user
const DEMO_USER_ID = DEMO_TEAM_MEMBERS[0].id;

const DEMO_USER: User = {
  id: DEMO_USER_ID,
  email: DEMO_TEAM_MEMBERS[0].email,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    first_name: DEMO_TEAM_MEMBERS[0].first_name,
    last_name: DEMO_TEAM_MEMBERS[0].last_name,
  },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString()
};

const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: DEMO_USER
};

const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  company_id: DEMO_COMPANY_ID,
  role: 'owner' as const,
  email: DEMO_TEAM_MEMBERS[0].email,
  first_name: DEMO_TEAM_MEMBERS[0].first_name,
  last_name: DEMO_TEAM_MEMBERS[0].last_name,
  job_title: DEMO_TEAM_MEMBERS[0].job_title,
  department: DEMO_TEAM_MEMBERS[0].department,
  location: DEMO_TEAM_MEMBERS[0].location,
  practice_area: DEMO_TEAM_MEMBERS[0].practice_area,
  weekly_capacity: DEMO_TEAM_MEMBERS[0].weekly_capacity,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  avatar_url: null,
  bio: DEMO_TEAM_MEMBERS[0].bio,
  manager_id: null,
  start_date: DEMO_TEAM_MEMBERS[0].start_date,
  date_of_birth: DEMO_TEAM_MEMBERS[0].date_of_birth,
  office_role_id: null
};

export interface DemoAuthState {
  user: User | null;
  session: Session | null;
  profile: typeof DEMO_PROFILE | null;
  teamMembers: typeof DEMO_TEAM_MEMBERS;
  inviteUrl: string;
  loading: boolean;
  isDemoMode: boolean;
}

export const useDemoAuth = () => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const fromStorage = localStorage.getItem('demo_mode') === 'true';
    const fromRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/demo');
    // Also check if company slug is 'demo' (case-insensitive)
    const pathParts = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean) : [];
    const fromCompanySlug = pathParts.length > 0 && pathParts[0].toLowerCase() === 'demo';
    return fromStorage || fromRoute || fromCompanySlug;
  });

  const [demoStartTime] = useState<number>(() => {
    const stored = localStorage.getItem('demo_start_time');
    return stored ? parseInt(stored) : Date.now();
  });

  // Demo session timeout (30 minutes)
  const DEMO_TIMEOUT = 30 * 60 * 1000;

  const startDemoMode = useCallback(() => {
    const startTime = Date.now();
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('demo_start_time', startTime.toString());
    setIsDemoMode(true);
    
    // Navigate to demo dashboard
    window.location.href = '/demo/dashboard';
  }, []);

  const exitDemoMode = useCallback(() => {
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_start_time');
    setIsDemoMode(false);
    
    // Redirect to landing page
    window.location.href = '/';
  }, []);

  // Keep demo mode consistent when user lands directly on /demo routes or /demo/* company slug routes
  useEffect(() => {
    const onDemoRoute = window.location.pathname.startsWith('/demo');
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const onDemoCompanySlug = pathParts.length > 0 && pathParts[0].toLowerCase() === 'demo';
    
    if ((onDemoRoute || onDemoCompanySlug) && !isDemoMode) {
      const startTime = Date.now();
      localStorage.setItem('demo_mode', 'true');
      localStorage.setItem('demo_start_time', startTime.toString());
      setIsDemoMode(true);
    }

    if (!onDemoRoute && !onDemoCompanySlug && isDemoMode && localStorage.getItem('demo_mode') !== 'true') {
      // If demo mode was only inferred from route and user navigates away, disable it.
      setIsDemoMode(false);
    }
  }, [isDemoMode]);

  // Check for demo timeout
  useEffect(() => {
    if (isDemoMode) {
      const elapsed = Date.now() - demoStartTime;
      if (elapsed > DEMO_TIMEOUT) {
        exitDemoMode();
      } else {
        const remaining = DEMO_TIMEOUT - elapsed;
        const timeoutId = setTimeout(exitDemoMode, remaining);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isDemoMode, demoStartTime, exitDemoMode]);

  const demoAuthState: DemoAuthState = {
    user: isDemoMode ? DEMO_USER : null,
    session: isDemoMode ? DEMO_SESSION : null,
    profile: isDemoMode ? DEMO_PROFILE : null,
    teamMembers: isDemoMode ? DEMO_TEAM_MEMBERS : [],
    inviteUrl: isDemoMode ? 'https://example.com/demo-invite' : '',
    loading: false,
    isDemoMode
  };

  const getRemainingTime = useCallback(() => {
    if (!isDemoMode) return 0;
    const elapsed = Date.now() - demoStartTime;
    return Math.max(0, DEMO_TIMEOUT - elapsed);
  }, [isDemoMode, demoStartTime]);

  return {
    ...demoAuthState,
    startDemoMode,
    exitDemoMode,
    getRemainingTime
  };
};
