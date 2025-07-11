import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    console.log('Processing AI insights request for user:', user.id);

    const { companyId, timeRange } = await req.json();

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    // Fetch team data
    const { data: teamMembers, error: teamError } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', companyId);

    if (teamError) {
      console.error('Error fetching team members:', teamError);
      throw new Error('Failed to fetch team data');
    }

    // Fetch project data
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('company_id', companyId);

    if (projectError) {
      console.error('Error fetching projects:', projectError);
      throw new Error('Failed to fetch project data');
    }

    // Fetch resource allocations
    const { data: allocations, error: allocError } = await supabase
      .from('project_resource_allocations')
      .select('*')
      .eq('company_id', companyId);

    if (allocError) {
      console.error('Error fetching allocations:', allocError);
      throw new Error('Failed to fetch allocation data');
    }

    // Prepare data summary for AI analysis
    const dataSummary = {
      teamSize: teamMembers?.length || 0,
      activeProjects: projects?.filter(p => p.status === 'In Progress').length || 0,
      totalProjects: projects?.length || 0,
      teamMembers: teamMembers?.map(member => ({
        id: member.id,
        role: member.job_title,
        department: member.department,
        weeklyCapacity: member.weekly_capacity,
        location: member.location
      })) || [],
      projects: projects?.map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        stage: project.current_stage,
        budgetHours: project.budget_hours,
        consumedHours: project.consumed_hours
      })) || [],
      allocations: allocations?.map(alloc => ({
        projectId: alloc.project_id,
        resourceId: alloc.resource_id,
        hours: alloc.hours,
        weekStartDate: alloc.week_start_date
      })) || [],
      timeRange: timeRange || '30d'
    };

    console.log('Data summary prepared:', {
      teamSize: dataSummary.teamSize,
      totalProjects: dataSummary.totalProjects,
      activeProjects: dataSummary.activeProjects,
      allocationsCount: dataSummary.allocations.length
    });

    // Call OpenAI for analysis
    const aiPrompt = `
You are an expert resource management analyst. Based on the following team and project data, provide actionable insights and recommendations.

Company Data:
- Team Size: ${dataSummary.teamSize}
- Active Projects: ${dataSummary.activeProjects}
- Total Projects: ${dataSummary.totalProjects}
- Time Period: ${dataSummary.timeRange}

Team Members: ${JSON.stringify(dataSummary.teamMembers, null, 2)}
Projects: ${JSON.stringify(dataSummary.projects, null, 2)}
Resource Allocations: ${JSON.stringify(dataSummary.allocations, null, 2)}

Please provide 3-5 specific, actionable insights in JSON format with this structure:
{
  "insights": [
    {
      "type": "utilization" | "capacity" | "project_load" | "team_scaling" | "efficiency",
      "category": "Resource Management" | "Team Performance" | "Project Planning" | "Risk Management",
      "priority": "critical" | "warning" | "opportunity" | "success",
      "title": "Brief title (max 50 chars)",
      "description": "Detailed description (max 200 chars)",
      "impact": "What impact this has (max 150 chars)",
      "recommendation": "Specific action to take (max 200 chars)",
      "confidence": 0.1-1.0,
      "timeframe": "immediate" | "short_term" | "long_term",
      "icon": "users" | "trending-up" | "alert-triangle" | "target" | "clock" | "bar-chart"
    }
  ]
}

Focus on:
1. Resource utilization patterns
2. Project workload distribution
3. Team capacity optimization
4. Potential bottlenecks or risks
5. Growth opportunities

Be specific and actionable. Use real data from the analysis.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resource management analyst who provides actionable insights based on team and project data. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    const aiContent = aiResponse.choices[0].message.content;
    
    // Parse the AI response
    let insights;
    try {
      const parsed = JSON.parse(aiContent);
      insights = parsed.insights || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI Response content:', aiContent);
      
      // Fallback insights if parsing fails
      insights = [
        {
          type: "utilization",
          category: "Resource Management",
          priority: "warning",
          title: "AI Analysis Unavailable",
          description: "Unable to generate insights at this time. Please try again later.",
          impact: "Limited visibility into resource optimization opportunities.",
          recommendation: "Review team allocation manually and ensure data accuracy.",
          confidence: 0.5,
          timeframe: "immediate",
          icon: "alert-triangle"
        }
      ];
    }

    console.log('Generated insights:', insights.length);

    return new Response(JSON.stringify({ 
      success: true, 
      insights: insights,
      metadata: {
        teamSize: dataSummary.teamSize,
        activeProjects: dataSummary.activeProjects,
        totalProjects: dataSummary.totalProjects,
        generatedAt: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-insights function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      insights: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});