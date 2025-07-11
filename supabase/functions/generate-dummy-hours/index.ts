import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);
    
    if (!user.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's company
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', user.user.id)
      .single();

    if (!profile?.company_id) {
      return new Response(JSON.stringify({ error: 'No company found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all projects for the company
    const { data: projects } = await supabaseClient
      .from('projects')
      .select('id, name')
      .eq('company_id', profile.company_id);

    // Get all team members for the company
    const { data: members } = await supabaseClient
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id);

    if (!projects || projects.length === 0 || !members || members.length === 0) {
      return new Response(JSON.stringify({ error: 'No projects or team members found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate July 2025 week start dates (Mondays)
    const julyWeeks = [
      '2025-06-30', // Week containing July 1st
      '2025-07-07',
      '2025-07-14', 
      '2025-07-21',
      '2025-07-28'
    ];

    // Clear existing July allocations first
    await supabaseClient
      .from('project_resource_allocations')
      .delete()
      .eq('company_id', profile.company_id)
      .gte('week_start_date', '2025-06-30')
      .lte('week_start_date', '2025-07-28');

    const allocations = [];

    // Generate realistic allocations
    for (const project of projects) {
      // Randomly assign 2-5 team members to each project
      const shuffledMembers = [...members].sort(() => 0.5 - Math.random());
      const projectMembers = shuffledMembers.slice(0, Math.floor(Math.random() * 4) + 2);

      for (const member of projectMembers) {
        for (const weekStart of julyWeeks) {
          // Generate realistic hours (0-40, weighted towards common values)
          const hoursOptions = [0, 8, 16, 20, 24, 32, 40];
          const weights = [0.1, 0.15, 0.2, 0.25, 0.15, 0.1, 0.05]; // Favor 16-24 hours
          
          let random = Math.random();
          let hours = 0;
          for (let i = 0; i < hoursOptions.length; i++) {
            random -= weights[i];
            if (random <= 0) {
              hours = hoursOptions[i];
              break;
            }
          }

          if (hours > 0) {
            allocations.push({
              project_id: project.id,
              resource_id: member.id,
              resource_type: 'active',
              week_start_date: weekStart,
              hours: hours,
              company_id: profile.company_id
            });
          }
        }
      }
    }

    // Insert all allocations
    const { data, error } = await supabaseClient
      .from('project_resource_allocations')
      .insert(allocations);

    if (error) {
      console.error('Error inserting allocations:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generated ${allocations.length} dummy allocations for July 2025`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${allocations.length} dummy hour allocations for July 2025`,
      projectsProcessed: projects.length,
      membersInvolved: members.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating dummy hours:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});