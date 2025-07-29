import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export configuration status
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase: ReturnType<typeof createClient<Database>> | null = null;

if (isSupabaseConfigured) {
  // Ensure URL is valid before creating client
  try {
    new URL(supabaseUrl);
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Invalid Supabase URL:', error);
  }
}

export { supabase };