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

    // Calculate key metrics for enhanced analysis
    const totalCapacity = dataSummary.teamMembers.reduce((sum, member) => sum + (member.weeklyCapacity || 40), 0);
    const totalAllocatedHours = dataSummary.allocations.reduce((sum, alloc) => sum + alloc.hours, 0);
    const utilizationRate = totalCapacity > 0 ? (totalAllocatedHours / totalCapacity) * 100 : 0;
    const avgProjectsPerPerson = dataSummary.teamSize > 0 ? dataSummary.activeProjects / dataSummary.teamSize : 0;

    // Call OpenAI for analysis
    const aiPrompt = `
You are a senior management consultant specializing in professional services optimization, with expertise in resource allocation, team performance, and operational efficiency. Analyze the following comprehensive team and project data to provide strategic insights.

**COMPANY OVERVIEW:**
- Team Size: ${dataSummary.teamSize} professionals
- Active Projects: ${dataSummary.activeProjects} (${dataSummary.totalProjects} total)
- Overall Utilization: ${utilizationRate.toFixed(1)}%
- Projects per Person: ${avgProjectsPerPerson.toFixed(1)}
- Analysis Period: ${dataSummary.timeRange}

**DETAILED DATA:**
Team Composition: ${JSON.stringify(dataSummary.teamMembers, null, 2)}
Project Portfolio: ${JSON.stringify(dataSummary.projects, null, 2)}
Resource Allocations: ${JSON.stringify(dataSummary.allocations, null, 2)}

**ANALYSIS REQUIREMENTS:**
Generate 4-6 strategic insights using advanced resource management principles. Focus on identifying patterns, inefficiencies, risks, and opportunities that a senior executive would find valuable.

**INDUSTRY BENCHMARKS:**
- Optimal utilization: 70-85% for professional services
- Maximum safe utilization: 90% (burnout risk above this)
- Minimum viable utilization: 60% (profitability concern below this)
- Ideal projects per senior consultant: 2-3 concurrent projects
- Ideal projects per junior staff: 1-2 concurrent projects

**RESPONSE FORMAT (JSON):**
{
  "insights": [
    {
      "type": "utilization" | "capacity" | "project_load" | "team_scaling" | "efficiency" | "risk_management" | "growth_opportunity",
      "category": "Resource Management" | "Team Performance" | "Project Planning" | "Risk Management" | "Strategic Planning" | "Financial Performance",
      "priority": "critical" | "warning" | "opportunity" | "success",
      "title": "Executive-level insight title (max 60 chars)",
      "description": "Comprehensive description with specific metrics and context (max 250 chars)",
      "impact": "Business impact with quantified potential (max 180 chars)",
      "recommendation": "Specific, actionable strategy with timeline (max 250 chars)",
      "confidence": 0.7-1.0,
      "timeframe": "immediate" | "short_term" | "long_term",
      "icon": "users" | "trending-up" | "alert-triangle" | "target" | "clock" | "bar-chart" | "dollar-sign" | "shield",
      "metrics": {
        "current_value": "Current metric value",
        "target_value": "Recommended target",
        "improvement_potential": "Quantified improvement opportunity"
      }
    }
  ]
}

**FOCUS AREAS:**
1. **Utilization Optimization:** Identify over/under-utilized resources with specific percentages
2. **Capacity Planning:** Analyze current vs. optimal capacity allocation
3. **Project Load Balancing:** Assess workload distribution and concentration risks
4. **Revenue Optimization:** Identify opportunities to improve billable utilization
5. **Risk Mitigation:** Spot burnout risks, skill gaps, and delivery threats
6. **Growth Strategy:** Highlight expansion opportunities and efficiency gains
7. **Financial Impact:** Quantify revenue and cost implications of current resource allocation

**DELIVERABLE STANDARDS:**
- Include specific percentages, hours, and financial impacts where possible
- Reference industry benchmarks in your analysis
- Provide clear ROI projections for recommendations
- Identify both immediate wins and strategic initiatives
- Consider seasonal patterns and project lifecycle stages

Ensure insights are executive-ready with concrete business impact and clear action steps.
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
            content: 'You are a senior management consultant and resource optimization expert with 15+ years of experience in professional services. You specialize in analyzing team performance data and providing strategic insights that drive measurable business outcomes. Always respond with valid, well-structured JSON that includes specific metrics and actionable recommendations.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
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
          title: "AI Analysis Temporarily Unavailable",
          description: "Advanced insights generation is currently unavailable. Basic metrics are still accessible through the dashboard.",
          impact: "Reduced visibility into optimization opportunities and strategic recommendations.",
          recommendation: "Monitor utilization rates manually. Consider reviewing individual workloads and project allocations to identify immediate optimization opportunities.",
          confidence: 0.8,
          timeframe: "immediate",
          icon: "alert-triangle",
          metrics: {
            current_value: `${utilizationRate.toFixed(1)}% team utilization`,
            target_value: "70-85% optimal range",
            improvement_potential: "Enhanced insights available when service is restored"
          }
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