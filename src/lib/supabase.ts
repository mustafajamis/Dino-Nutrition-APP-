// src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL_CONFIG, SUPABASE_ANON_CONFIG } from '../config';

// Create a safer AsyncStorage wrapper that handles iOS simulator errors
const createSafeAsyncStorage = () => {
  return {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.warn('AsyncStorage getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.warn('AsyncStorage setItem error:', error);
        // Fallback to memory storage
        if (typeof window !== 'undefined') {
          (window as any).__asyncStorageFallback = (window as any).__asyncStorageFallback || {};
          (window as any).__asyncStorageFallback[key] = value;
        }
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.warn('AsyncStorage removeItem error:', error);
        if (typeof window !== 'undefined' && (window as any).__asyncStorageFallback) {
          delete (window as any).__asyncStorageFallback[key];
        }
      }
    },
  };
};

const safeAsyncStorage = createSafeAsyncStorage();

export const supabase = createClient(SUPABASE_URL_CONFIG, SUPABASE_ANON_CONFIG, {
  auth: {
    storage: safeAsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
