// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gxebsznewbwtktzqeilg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4ZWJzem5ld2J3dGt0enFlaWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTI4MzEsImV4cCI6MjA2MDcyODgzMX0.KYLHb_PmJAIjpxe5LUUi6S5pb4kZJNemQAMY764kuy8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);