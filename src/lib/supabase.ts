// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pgkiwkrucbthyjrweccl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBna2l3a3J1Y2J0aHlqcndlY2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Njk1NjgsImV4cCI6MjA3NDE0NTU2OH0.Pu-fLGl9gI9-FFF3OMQWfRNBmBHFOp7pVvUVNJVHpEA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
