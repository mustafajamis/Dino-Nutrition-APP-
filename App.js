import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import {checkEnvConfig, testSupabaseConnection} from './src/config';

export default function App() {
  useEffect(() => {
    // Check environment variables on app startup
    const configLoaded = checkEnvConfig();

    // Test Supabase connection if config is loaded
    if (configLoaded) {
      testSupabaseConnection();
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
