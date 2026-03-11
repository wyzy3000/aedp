// Supabase Edge Function: admin-user-action
// Handles createUser and deleteUser for Admin users only.
// The SERVICE_ROLE_KEY is stored as a Supabase secret (never in the client bundle).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify the caller is an authenticated user
    const callerJwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!callerJwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Regular client — authenticated as the calling user
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${callerJwt}` } },
    });

    // Get caller's own user id
    const { data: { user: caller }, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !caller) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Check caller is an Admin in the profiles table
    const { data: profile, error: profileErr } = await callerClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (profileErr || !profile || profile.role !== "Admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Admin client (uses service_role key — safely stored as Deno secret)
    const adminHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    };

    const { action, ...payload } = await req.json();

    // 4. Route to the correct admin action
    if (action === "createUser") {
      const { email, password, role } = payload;
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "email and password required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          email_confirm: true,
          user_metadata: { role },
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        return new Response(JSON.stringify({ error: result.msg || result.message }), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Upsert profile row with role + Activated status
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from("profiles").upsert({
        id: result.id,
        email: email.trim().toLowerCase(),
        role: role || "Standard User",
        status: "Activated",
      });

      return new Response(JSON.stringify({ success: true, user: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "deleteUser") {
      const { userId } = payload;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Prevent deleting yourself
      if (userId === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: adminHeaders,
      });

      if (!res.ok) {
        const err = await res.json();
        return new Response(JSON.stringify({ error: err.msg || err.message || res.status }), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from("profiles").delete().eq("id", userId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
