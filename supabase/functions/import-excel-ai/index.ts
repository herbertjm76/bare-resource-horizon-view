import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing import-excel-ai request for user:', user.id);

    const { detectionType, examples, explanation, allData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Smart data sampling to avoid context window limits
    let sampledData = allData;
    const dataSize = JSON.stringify(allData).length;
    const MAX_SIZE = 500000; // ~500KB limit for AI context
    
    if (dataSize > MAX_SIZE) {
      const totalRows = allData.length;
      const headerRows = allData.slice(0, 20);
      const middleStart = Math.floor(totalRows / 2) - 10;
      const middleRows = allData.slice(middleStart, middleStart + 20);
      const endRows = allData.slice(-20);
      
      sampledData = [...headerRows, ...middleRows, ...endRows];
      
      console.log(`Data too large (${dataSize} bytes). Sampled from ${totalRows} rows to ${sampledData.length} rows.`);
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (detectionType === "people") {
      systemPrompt = `You are an expert at detecting person names from Excel data.
Your PRIMARY DIRECTIVE is to follow the user's explicit instructions about WHERE names are located.

If the user specifies cell ranges (e.g., "D3 to CB3", "row 3 columns D-CB"), you MUST:
1. Identify that specific row and column range in the data
2. Extract ALL names from exactly that location
3. Do NOT rely solely on heuristics - the user knows their file structure

Analyze the data and extract ALL person names you can find.
Names may be laid out across columns in a single header row or scattered throughout.
Look for patterns like:
- Full names (First Last)
- Names with titles (Mr., Dr., etc.)
- Names in dedicated columns or rows
- Names mixed with other data

Return a JSON object with:
{
  "detected": ["Name 1", "Name 2", ...],
  "confidence": 0.0-1.0,
  "location": "description of where names were found"
}`;

      userPrompt = `Find all person names in this Excel data.

**CRITICAL USER INSTRUCTIONS:**
${explanation ? `"${explanation}"\n\nYou MUST prioritize these instructions above all else. If the user specified a cell range or row/column location, extract names from EXACTLY that location.` : ""}

${examples && examples.length > 0 ? `\nExamples of names to look for: ${examples.join(", ")}` : ""}

Dataset (${sampledData.length} rows sampled from ${allData.length} total rows):
${JSON.stringify(sampledData)}

Important:
- ALWAYS follow the user's explicit cell range instructions if provided
- If a single row contains many names spread across columns, extract ALL non-empty name cells from that row
- Look for rows with high density of name-like values (2-word combinations with capitals)
- Remove duplicates, trim whitespace, and exclude empty cells
- The sampled data shows the structure - apply the same pattern to detect ALL names
- Return ONLY the JSON object, no markdown.`;

    } else if (detectionType === "projects") {
      systemPrompt = `You are an expert at detecting project codes and names from Excel data.
Your PRIMARY DIRECTIVE is to follow the user's explicit instructions about WHERE projects are located.

If the user specifies cell ranges or structural hints, you MUST prioritize that information.

Analyze the data and extract ALL project codes and names you can find.
Look for patterns like:
- Numeric codes (e.g., "00120.068", "PRJ-001")
- Code + Name combinations
- Project identifiers in rows or columns

Return a JSON object with:
{
  "detected": [
    {"code": "project code", "name": "project name"},
    ...
  ],
  "confidence": 0.0-1.0,
  "location": "description of where projects were found"
}`;

      userPrompt = `Find all project codes and names in this Excel data.

**CRITICAL USER INSTRUCTIONS:**
${explanation ? `"${explanation}"\n\nYou MUST prioritize these instructions above all else.` : ""}

${examples && examples.length > 0 ? `\nExamples of project codes to look for: ${examples.join(", ")}` : ""}

Dataset (${sampledData.length} rows sampled from ${allData.length} total rows):
${JSON.stringify(sampledData)}

Important:
- ALWAYS follow the user's explicit instructions if provided
- Look for consistent patterns in project codes (numeric, alphanumeric, specific formats)
- The sampled data shows the structure - apply the same pattern to detect ALL projects
- Return ONLY the JSON object, no markdown.`;
    } else {
      throw new Error("Invalid detection type");
    }

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
