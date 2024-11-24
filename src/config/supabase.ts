import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puqlgwxpirfrqvjknhbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cWxnd3hwaXJmcnF2amtuaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDczMjMsImV4cCI6MjA0Nzg4MzMyM30.AGUcFj0C_vDDmJzouIuAYPgMp5A53WLqZmQyRcmRRSI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});