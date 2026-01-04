import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

// Browser-side Supabase client with persistence
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    },
});
