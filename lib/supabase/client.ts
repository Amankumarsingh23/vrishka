import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
  );
}

/**
 * This app has no login flow, so the publishable key (safe to expose to
 * the browser) is used everywhere — Server Components, Server Actions,
 * and any future client-side calls all share this one client. Access
 * control is enforced entirely by the RLS policies in supabase/rls.sql.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
