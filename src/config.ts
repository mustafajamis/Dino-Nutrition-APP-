// src/config.ts
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  CALORIE_MAMA_API_KEY,
  CALORIE_MAMA_API_URL,
} from '@env';

// Hardcoded values as fallback when environment variables fail to load
const HARDCODED_SUPABASE_URL = 'https://pgkiwkrucbthyjrweccl.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBna2l3a3J1Y2J0aHlqcndlY2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Njk1NjgsImV4cCI6MjA3NDE0NTU2OH0.Pu-fLGl9gI9-FFF3OMQWfRNBmBHFOp7pVvUVNJVHpEA';
const HARDCODED_CALORIE_MAMA_API_KEY = '61e38723c1d9240a5935fa9482b5c784';

export const SUPABASE_URL_CONFIG = SUPABASE_URL || HARDCODED_SUPABASE_URL;
export const SUPABASE_ANON_CONFIG = SUPABASE_ANON_KEY || HARDCODED_SUPABASE_ANON_KEY;

// Calorie Mama Food Recognition API
export const CALORIE_MAMA_API_KEY_CONFIG = CALORIE_MAMA_API_KEY || HARDCODED_CALORIE_MAMA_API_KEY;
export const CALORIE_MAMA_API_URL_CONFIG = CALORIE_MAMA_API_URL || 'https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition';

// Debug function to check if environment variables are loaded
export const checkEnvConfig = () => {
  console.log('Environment Variables Check:');
  console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Loaded from env' : '⚠️ Using hardcoded');
  console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Loaded from env' : '⚠️ Using hardcoded');
  console.log('CALORIE_MAMA_API_KEY:', CALORIE_MAMA_API_KEY ? '✅ Loaded from env' : '⚠️ Using hardcoded');
  console.log('CALORIE_MAMA_API_URL:', CALORIE_MAMA_API_URL ? '✅ Loaded from env' : '⚠️ Using hardcoded');

  console.log('Final Config Values:');
  console.log('SUPABASE_URL_CONFIG:', SUPABASE_URL_CONFIG);
  console.log('SUPABASE_ANON_CONFIG:', SUPABASE_ANON_CONFIG ? 'Set' : 'Missing');

  if (!SUPABASE_URL_CONFIG || !SUPABASE_ANON_CONFIG) {
    console.error('❌ Supabase configuration is incomplete!');
    return false;
  }

  console.log('✅ All configuration values are set');
  return true;
};

// Test network connectivity to Supabase
export const testSupabaseConnection = async () => {
  if (!SUPABASE_URL_CONFIG) {
    console.error('❌ Cannot test connection - SUPABASE_URL_CONFIG is missing');
    return false;
  }

  try {
    console.log('🔄 Testing Supabase connection...');
    const response = await fetch(`${SUPABASE_URL_CONFIG}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_CONFIG || '',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('✅ Supabase connection successful');
      return true;
    } else {
      console.error('❌ Supabase connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error connecting to Supabase:', error.message);
    return false;
  }
};
