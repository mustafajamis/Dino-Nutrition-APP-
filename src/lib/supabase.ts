// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL_CONFIG, SUPABASE_ANON_CONFIG } from '../config';

export const supabase = createClient(SUPABASE_URL_CONFIG, SUPABASE_ANON_CONFIG, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
