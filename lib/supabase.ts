import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createSafeClient(url: string, key: string): SupabaseClient {
  // Return a valid client if URL and key are configured, otherwise a dummy that won't crash
  const safeUrl = url && url.startsWith("http") ? url : "https://placeholder.supabase.co";
  const safeKey = key || "placeholder";
  return createClient(safeUrl, safeKey);
}

// Public client — for frontend use, respects RLS
export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey);

// Admin client — for API routes only, bypasses RLS
export const supabaseAdmin = createSafeClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);
