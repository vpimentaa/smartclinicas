import { beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client for testing with service role key
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

// Extend the global type to include our Supabase client
declare global {
  var supabase: SupabaseClient;
}

// Make the Supabase client available globally
global.supabase = supabase; 