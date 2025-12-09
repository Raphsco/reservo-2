import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval handling both Vite and other contexts
const getEnv = (key: string) => {
  // Try import.meta.env (Vite standard) safely
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // Fallback to process.env (Node/Compat standard)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Use provided credentials as robust fallback to fix "Failed to fetch"
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || 'https://koqzhtbxwnfrakxpvpuz.supabase.co';
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_a85q2MWGvZpgiUARfVk-sw_urkgLHan';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);