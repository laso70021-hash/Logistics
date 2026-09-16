import { createClient } from "@supabase/supabase-js";

// Uses environment variables if provided, otherwise falls back to the default placeholders
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://dfbgojdzcrwgeuzrhugh.supabase.co";
export const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_GU7-YmD1aJgbedLnM2sBNw__kmPKnze";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLIC_KEY
);
