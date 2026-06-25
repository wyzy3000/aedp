// Supabase Edge Function: admin-user-action
// Handles createUser and deleteUser for Admin users only.
// The SERVICE_ROLE_KEY is stored as a Supabase secret (never in the client bundle).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins — add your staging domain here if needed
const ALLOWED_ORIGINS = [
  "https://aedp.brandika.co.ke",
  "http://localhost:5151",
  "http://localhost:5173",
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || ""
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Verify the caller is an authenticated user
    const callerJwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!callerJwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
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
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
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
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // 3. Admin client (uses service_role key — safely stored as Deno secret)
    const adminHeaders = {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    };

    const { action, ...payload } = await req.json();

    // Validate action is one of the known safe values
    const VALID_ACTIONS = ["createUser", "deleteUser"]
    if (!VALID_ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // 4. Route to the correct admin action
    if (action === "createUser") {
      const { email, password, role } = payload;
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "email and password required" }), {
          status: 400,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      // Validate role is one of the allowed values
      const VALID_ROLES = ["User", "Data Analyst", "Resource Assessor", "Admin"]
      const safeRole = VALID_ROLES.includes(role) ? role : "User"

      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          email_confirm: true,
          user_metadata: { role: safeRole },
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        return new Response(JSON.stringify({ error: result.msg || result.message }), {
          status: res.status,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      // Upsert profile row with role + Activated status
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from("profiles").upsert({
        id: result.id,
        email: email.trim().toLowerCase(),
        role: safeRole,
        status: "Activated",
      });

      return new Response(JSON.stringify({ success: true, user: result }), {
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    if (action === "deleteUser") {
      const { userId } = payload;
      if (!userId) {
        return new Response(JSON.stringify({ error: "userId required" }), {
          status: 400,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      // Prevent deleting yourself
      if (userId === caller.id) {
        return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
          status: 400,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
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
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from("profiles").delete().eq("id", userId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
