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

    // Get all active team members for the company
    const { data: activeMembers } = await supabaseClient
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id);

    // Get all pending users (pre-registered and email_invite invites) for the company
    const { data: pendingMembers } = await supabaseClient
      .from('invites')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id)
      .eq('status', 'pending')
      .in('invitation_type', ['pre_registered', 'email_invite']);

    // Combine active and pending members
    const allMembers = [
      ...(activeMembers || []).map(member => ({ ...member, type: 'active' })),
      ...(pendingMembers || []).map(member => ({ ...member, type: 'pre_registered' }))
    ];

    if (!projects || projects.length === 0 || allMembers.length === 0) {
      return new Response(JSON.stringify({ error: 'No projects or team members found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate daily allocations for 24 weeks starting from July 7, 2025
    const days = [];
    const startDate = new Date('2025-07-07');
    
    // Generate 24 weeks worth of weekdays (Monday-Friday only)
    for (let week = 0; week < 24; week++) {
      for (let day = 0; day < 5; day++) { // Monday to Friday
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + (week * 7) + day);
        days.push(currentDay.toISOString().split('T')[0]);
      }
    }

    // Clear existing allocations for the period first
    await supabaseClient
      .from('project_resource_allocations')
      .delete()
      .eq('company_id', profile.company_id)
      .gte('week_start_date', days[0])
      .lte('week_start_date', days[days.length - 1]);

    const allocations = [];

    // Generate realistic daily allocations with minimum 80% utilization
    for (const dayDate of days) {
      for (const member of allMembers) {
        // Each resource should have at least 80% allocation (6.4 hours out of 8)
        // Random daily scenarios:
        const scenario = Math.random();
        let dailyHours;
        let maxProjectsForDay;
        
        if (scenario < 0.1) {
          // 10% - Under-allocated (4-6 hours per day)
          dailyHours = Math.floor(Math.random() * 3) + 4; // 4-6 hours
          maxProjectsForDay = 1;
        } else if (scenario < 0.7) {
          // 60% - Well allocated (6.5-8 hours per day)
          dailyHours = Math.floor(Math.random() * 1.5 * 10) / 10 + 6.5; // 6.5-8 hours
          maxProjectsForDay = Math.floor(Math.random() * 2) + 1; // 1-2 projects
        } else if (scenario < 0.95) {
          // 25% - Over-allocated (8-10 hours per day)
          dailyHours = Math.floor(Math.random() * 2 * 10) / 10 + 8; // 8-10 hours
          maxProjectsForDay = Math.floor(Math.random() * 3) + 2; // 2-4 projects
        } else {
          // 5% - Heavily over-allocated (10-12 hours per day)
          dailyHours = Math.floor(Math.random() * 2 * 10) / 10 + 10; // 10-12 hours
          maxProjectsForDay = Math.floor(Math.random() * 4) + 3; // 3-6 projects
        }
        
        // Round to nearest 0.5 hour for cleaner display
        dailyHours = Math.round(dailyHours * 2) / 2;
        
        // Select random projects for this member this day
        const availableProjects = [...projects];
        const numProjects = Math.min(maxProjectsForDay, availableProjects.length);
        const selectedProjects = availableProjects
          .sort(() => 0.5 - Math.random())
          .slice(0, numProjects);
        
        if (selectedProjects.length === 1) {
          // Single project allocation for the day
          allocations.push({
            project_id: selectedProjects[0].id,
            resource_id: member.id,
            resource_type: member.type,
            week_start_date: dayDate, // Using date for daily allocation
            hours: dailyHours,
            company_id: profile.company_id
          });
        } else {
          // Multiple project allocation for the day
          let remainingHours = dailyHours;
          
          for (let i = 0; i < selectedProjects.length; i++) {
            let projectHours;
            
            if (i === selectedProjects.length - 1) {
              // Last project gets remaining hours
              projectHours = remainingHours;
            } else {
              // Randomly allocate 20-60% of remaining hours to this project
              const minPercentage = 0.2;
              const maxPercentage = 0.6;
              const percentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
              projectHours = remainingHours * percentage;
              projectHours = Math.max(0.5, projectHours); // At least 0.5 hours per project
            }
            
            // Round to nearest 0.5 hour
            projectHours = Math.round(projectHours * 2) / 2;
            
            if (projectHours > 0) {
              allocations.push({
                project_id: selectedProjects[i].id,
                resource_id: member.id,
                resource_type: member.type,
                week_start_date: dayDate, // Using date for daily allocation
                hours: projectHours,
                company_id: profile.company_id
              });
              
              remainingHours -= projectHours;
            }
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

    console.log(`Generated ${allocations.length} daily allocations for ${days.length} days`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${allocations.length} daily hour allocations for ${days.length} days (${activeMembers?.length || 0} active + ${pendingMembers?.length || 0} pending members)`,
      projectsProcessed: projects.length,
      membersInvolved: allMembers.length,
      activeMembers: activeMembers?.length || 0,
      pendingMembers: pendingMembers?.length || 0
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