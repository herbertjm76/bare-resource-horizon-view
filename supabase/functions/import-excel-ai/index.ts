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

    const systemPrompt = `You are an expert data mapping assistant for a project management system. 
Analyze Excel column headers and sample data to suggest mappings to our system fields.

Available target fields:
- code: Project Code (required) - unique identifier
- name: Project Name (required) - descriptive name
- status: Status (optional) - project status (active, completed, on-hold, cancelled)
- country: Country (optional) - location
- target_profit_percentage: Target Profit % (optional) - numeric percentage
- currency: Currency (optional) - ISO currency code (USD, EUR, GBP, etc.)
- project_manager_name: Project Manager Name (optional) - full name
- office_name: Office Name (optional) - office location

SPECIAL CASE - Matrix Format Detection:
If the first column contains project codes (patterns like "00120.068" or similar numbering) 
followed by project names in the same cell, this is a PROJECT MATRIX format.

For matrix format, return:
{
  "mappings": {
    "0": "code_and_name"
  },
  "confidence": { "0": 0.95 },
  "suggestions": ["Detected project matrix format. Column 0 contains project codes and names that will be split automatically."]
}

For standard format, return:
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

DETECTION RULES:
1. Check if column 0 has values matching pattern: number/code followed by text (e.g., "00120.068 Regional SE Asia Admin")
2. If YES → return "code_and_name" mapping for column 0
3. If NO → provide standard column mappings

Standard mapping variations:
- "Proj Code", "Project ID", "Code" → code
- "Project Title", "Name", "Project" → name
- "PM", "Manager", "Lead" → project_manager_name
- "Location", "Office", "Site" → office_name
- "Profit", "Margin", "Target %" → target_profit_percentage

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
    console.error("Error in import-excel-ai function:", error);
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
