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

    // Get all pending users (pre-registered invites) for the company
    const { data: pendingMembers } = await supabaseClient
      .from('invites')
      .select('id, first_name, last_name')
      .eq('company_id', profile.company_id)
      .eq('status', 'pending')
      .eq('invitation_type', 'pre_registered');

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

    // Generate 24 weeks starting from July 7, 2025
    const weeks = [];
    const startDate = new Date('2025-07-07');
    for (let i = 0; i < 24; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + (i * 7));
      weeks.push(weekDate.toISOString().split('T')[0]);
    }

    // Clear existing allocations for the 24-week period first
    await supabaseClient
      .from('project_resource_allocations')
      .delete()
      .eq('company_id', profile.company_id)
      .gte('week_start_date', weeks[0])
      .lte('week_start_date', weeks[weeks.length - 1]);

    const allocations = [];

    // Generate allocations with random distribution across projects
    for (const weekStart of weeks) {
      for (const member of allMembers) {
        // Randomly assign workload category for each member each week
        const random = Math.random();
        let totalHours;
        
        if (random < 0.7) {
          // 70% chance for green (exactly 40 hours)
          totalHours = 40;
        } else if (random < 0.85) {
          // 15% chance for yellow (under 40 hours)
          totalHours = Math.floor(Math.random() * 16) + 20; // 20-35 hours
        } else {
          // 15% chance for red (over 40 hours)
          totalHours = Math.floor(Math.random() * 11) + 45; // 45-55 hours
        }
        
        // Randomly decide how many projects this member works on (1-3 projects)
        const numProjects = Math.floor(Math.random() * 3) + 1;
        const selectedProjects = projects.sort(() => 0.5 - Math.random()).slice(0, Math.min(numProjects, projects.length));
        
        if (selectedProjects.length === 1) {
          // All hours go to one project
          allocations.push({
            project_id: selectedProjects[0].id,
            resource_id: member.id,
            resource_type: member.type,
            week_start_date: weekStart,
            hours: totalHours,
            company_id: profile.company_id
          });
        } else {
          // Split hours across multiple projects
          let remainingHours = totalHours;
          
          for (let i = 0; i < selectedProjects.length; i++) {
            let projectHours;
            
            if (i === selectedProjects.length - 1) {
              // Last project gets remaining hours
              projectHours = remainingHours;
            } else {
              // Randomly allocate 20-60% of remaining hours to this project
              const percentage = Math.random() * 0.4 + 0.2; // 0.2 to 0.6
              projectHours = Math.floor(remainingHours * percentage);
              projectHours = Math.max(1, projectHours); // At least 1 hour
            }
            
            if (projectHours > 0) {
              allocations.push({
                project_id: selectedProjects[i].id,
                resource_id: member.id,
                resource_type: member.type,
                week_start_date: weekStart,
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

    console.log(`Generated ${allocations.length} dummy allocations for 24 weeks`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${allocations.length} dummy hour allocations for 24 weeks (${activeMembers?.length || 0} active + ${pendingMembers?.length || 0} pending members)`,
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