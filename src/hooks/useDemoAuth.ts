import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Demo user data
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000002';
const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';

const DEMO_USER: User = {
  id: DEMO_USER_ID,
  email: 'demo@example.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    first_name: 'John',
    last_name: 'Demo',
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
  email: 'demo@example.com',
  first_name: 'John',
  last_name: 'Demo',
  job_title: 'CEO',
  department: 'Executive',
  location: 'San Francisco, CA',
  practice_area: null,
  weekly_capacity: 40,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  avatar_url: null,
  bio: null,
  manager_id: null,
  start_date: null,
  office_role_id: null
};

const DEMO_TEAM_MEMBERS = [
  {
    id: '00000000-0000-0000-0000-000000000003',
    company_id: DEMO_COMPANY_ID,
    role: 'admin' as const,
    email: 'sarah.admin@example.com',
    first_name: 'Sarah',
    last_name: 'Wilson',
    job_title: 'VP of Engineering',
    department: 'Engineering',
    location: 'San Francisco, CA',
    practice_area: null,
    weekly_capacity: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: null,
    manager_id: null,
    start_date: null,
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    company_id: DEMO_COMPANY_ID,
    role: 'member' as const,
    email: 'alex.dev@example.com',
    first_name: 'Alex',
    last_name: 'Chen',
    job_title: 'Senior Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    practice_area: null,
    weekly_capacity: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: null,
    manager_id: null,
    start_date: null,
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    company_id: DEMO_COMPANY_ID,
    role: 'member' as const,
    email: 'maria.designer@example.com',
    first_name: 'Maria',
    last_name: 'Rodriguez',
    job_title: 'UX Designer',
    department: 'Product',
    location: 'New York, NY',
    practice_area: null,
    weekly_capacity: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: null,
    manager_id: null,
    start_date: null,
    office_role_id: null
  }
];

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
    return localStorage.getItem('demo_mode') === 'true';
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
    
    // Auto-exit demo after timeout
    setTimeout(() => {
      exitDemoMode();
    }, DEMO_TIMEOUT);
  }, []);

  const exitDemoMode = useCallback(() => {
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_start_time');
    setIsDemoMode(false);
    
    // Redirect to landing page
    window.location.href = '/';
  }, []);

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