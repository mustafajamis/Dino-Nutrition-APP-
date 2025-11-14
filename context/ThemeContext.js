import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createThemedStyles} from '../style/Theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Use system preference if no saved preference
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
      setIsDark(systemColorScheme === 'dark');
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('themeMode', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const setTheme = async theme => {
    try {
      const darkMode = theme === 'dark';
      setIsDark(darkMode);
      await AsyncStorage.setItem('themeMode', theme);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const resetToSystemTheme = async () => {
    try {
      setIsDark(systemColorScheme === 'dark');
      await AsyncStorage.removeItem('themeMode');
    } catch (error) {
      console.log('Error resetting theme preference:', error);
    }
  };

  // Create themed styles based on current mode
  const styles = createThemedStyles(isDark);

  const value = {
    isDark,
    styles,
    toggleTheme,
    setTheme,
    resetToSystemTheme,
    isLoaded,
    themeMode: isDark ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
