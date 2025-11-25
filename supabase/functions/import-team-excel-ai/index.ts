import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { headers, sampleData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert data mapping assistant for a team management system. 
Analyze Excel column headers and sample data to suggest mappings to our system fields.

Available target fields:
- first_name: First Name (required) - team member's first name
- last_name: Last Name (required) - team member's last name
- email: Email (optional) - email address
- job_title: Job Title (optional) - role or position
- department: Department (optional) - department name
- practice_area: Practice Area (optional) - practice area or specialty
- location: Office Location (optional) - office location
- weekly_capacity: Weekly Capacity (optional) - hours per week (numeric, default 40)
- role: Role (optional) - staff role/title

Return ONLY a JSON object with this structure:
{
  "mappings": {
    "columnIndex": "targetField"
  },
  "confidence": {
    "columnIndex": 0.0-1.0
  },
  "suggestions": [
    "Human-readable suggestion or warning"
  ]
}`;

    const userPrompt = `Analyze these Excel columns and suggest mappings:

Headers: ${JSON.stringify(headers)}
Sample Data (first 3 rows): ${JSON.stringify(sampleData)}

Provide intelligent mappings based on column names and data patterns. Consider variations like:
- "First", "Given Name", "F Name" → first_name
- "Last", "Surname", "Family Name" → last_name
- "Email", "Email Address", "Contact" → email
- "Title", "Position", "Job" → job_title
- "Dept", "Department", "Division" → department
- "Practice Area", "Practice", "Area", "Specialty" → practice_area
- "Location", "Office", "Site" → location
- "Capacity", "Hours", "Weekly Hours" → weekly_capacity
- "Role", "Staff Role", "Position" → role

Return ONLY the JSON object, no markdown or explanations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway request failed");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse the AI response (remove markdown code blocks if present)
    let cleanedResponse = aiResponse.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }

    const mappingResult = JSON.parse(cleanedResponse.trim());

    return new Response(
      JSON.stringify(mappingResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in import-team-excel-ai function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        mappings: {},
        confidence: {},
        suggestions: ["Failed to analyze Excel file. Please map columns manually."]
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
