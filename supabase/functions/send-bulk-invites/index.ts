import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BulkInviteRequest {
  inviteIds: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract and verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Invalid token or user not found:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User ${user.id} authenticated, verifying company access`);

    // Get the user's company_id from their profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      console.error("User has no company:", profileError);
      return new Response(
        JSON.stringify({ error: "User does not belong to a company" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userCompanyId = profile.company_id;
    console.log(`User belongs to company: ${userCompanyId}`);

    const { inviteIds }: BulkInviteRequest = await req.json();

    if (!inviteIds || inviteIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No invite IDs provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${inviteIds.length} invites for company ${userCompanyId}`);

    // Fetch invite details - CRITICAL: Filter by user's company_id
    // Support both pre_registered and email_invite types
    const { data: invites, error: invitesError } = await supabase
      .from("invites")
      .select("id, email, first_name, last_name, code, invitation_type, company_id, companies(name, subdomain)")
      .in("id", inviteIds)
      .eq("company_id", userCompanyId) // Only allow invites from user's company
      .in("invitation_type", ["pre_registered", "email_invite"])
      .eq("status", "pending");

    if (invitesError) {
      console.error("Error fetching invites:", invitesError);
      throw invitesError;
    }

    if (!invites || invites.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid pre-registered invites found for your company" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Security check: Ensure we found all requested invites in user's company
    if (invites.length !== inviteIds.length) {
      console.warn(`Security: User ${user.id} attempted to access ${inviteIds.length} invites but only ${invites.length} belong to their company`);
      return new Response(
        JSON.stringify({ error: "Some invite IDs do not belong to your company" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${invites.length} valid invites to send for company ${userCompanyId}`);

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send emails
    for (const invite of invites) {
      if (!invite.email) {
        console.warn(`Skipping invite ${invite.id} - no email address`);
        results.failed++;
        results.errors.push(`Invite ${invite.id} has no email address`);
        continue;
      }

      try {
        const companyName = invite.companies?.name || "the team";
        const companySubdomain = invite.companies?.subdomain || "";
        const firstName = invite.first_name || "";
        const inviteUrl = `${req.headers.get("origin") || "https://app.example.com"}/join/${companySubdomain}/${invite.code}`;

        console.log(`Sending invite to ${invite.email}`);

        const emailResponse = await resend.emails.send({
          from: "Bare Resource <no-reply@bareresource.com>",
          to: [invite.email],
          subject: `Join ${companyName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
                </div>
                
                <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                  <p style="font-size: 16px; margin-bottom: 20px; color: #111827;">Hi${firstName ? ` ${firstName}` : ''},</p>
                  
                  <p style="font-size: 16px; margin-bottom: 30px; color: #374151; line-height: 1.6;">
                    You've been pre-registered to join <strong>${companyName}</strong>. Click the button below to complete your registration and join the team.
                  </p>
                  
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${inviteUrl}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                      Accept Invitation
                    </a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                    If you didn't expect this invitation, you can safely ignore this email.
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        console.log(`Email sent successfully to ${invite.email}:`, emailResponse);
        results.successful++;
      } catch (emailError: any) {
        console.error(`Failed to send email to ${invite.email}:`, emailError);
        results.failed++;
        results.errors.push(`Failed to send to ${invite.email}: ${emailError.message}`);
      }
    }

    console.log("Bulk invite results:", results);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: `Successfully sent ${results.successful} invite(s). ${results.failed} failed.`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-invites function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
