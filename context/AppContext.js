import React, { createContext, useContext, useReducer, useEffect } from 'react';
import storageService from '../services/storageService';
import { getCurrentDate, calculateDailyNutrition } from '../utils/nutritionUtils';

// Initial state
const initialState = {
  user: {
    profile: null,
    goals: null,
    isLoggedIn: false,
  },
  nutrition: {
    todayLogs: [],
    todayNutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
    loading: false,
    error: null,
  },
  settings: {
    units: 'metric',
    notifications: true,
    darkMode: false,
  },
};

// Action types
const ActionTypes = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_USER_GOALS: 'SET_USER_GOALS',
  SET_LOGIN_STATUS: 'SET_LOGIN_STATUS',
  SET_TODAY_LOGS: 'SET_TODAY_LOGS',
  ADD_FOOD_LOG: 'ADD_FOOD_LOG',
  UPDATE_TODAY_NUTRITION: 'UPDATE_TODAY_NUTRITION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SETTINGS: 'SET_SETTINGS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
        },
      };

    case ActionTypes.SET_USER_GOALS:
      return {
        ...state,
        user: {
          ...state.user,
          goals: action.payload,
        },
      };

    case ActionTypes.SET_LOGIN_STATUS:
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: action.payload,
        },
      };

    case ActionTypes.SET_TODAY_LOGS:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          todayLogs: action.payload,
          todayNutrition: calculateDailyNutrition(action.payload),
        },
      };

    case ActionTypes.ADD_FOOD_LOG:
      const updatedLogs = [...state.nutrition.todayLogs, action.payload];
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          todayLogs: updatedLogs,
          todayNutrition: calculateDailyNutrition(updatedLogs),
        },
      };

    case ActionTypes.UPDATE_TODAY_NUTRITION:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          todayNutrition: action.payload,
        },
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          loading: action.payload,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          error: action.payload,
          loading: false,
        },
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          error: null,
        },
      };

    case ActionTypes.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      // Load user profile
      const profile = await storageService.getUserProfile();
      if (profile) {
        dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile });
        dispatch({ type: ActionTypes.SET_LOGIN_STATUS, payload: true });
      }

      // Load user goals
      const goals = await storageService.getUserGoals();
      if (goals) {
        dispatch({ type: ActionTypes.SET_USER_GOALS, payload: goals });
      }

      // Load today's food logs
      const today = getCurrentDate();
      const todayLogs = await storageService.getFoodLogsForDate(today);
      dispatch({ type: ActionTypes.SET_TODAY_LOGS, payload: todayLogs });

      // Load app settings
      const settings = await storageService.getAppSettings();
      dispatch({ type: ActionTypes.SET_SETTINGS, payload: settings });

    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load app data' });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Actions
  const actions = {
    // User actions
    setUserProfile: async (profile) => {
      try {
        await storageService.saveUserProfile(profile);
        dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile });
        dispatch({ type: ActionTypes.SET_LOGIN_STATUS, payload: true });
      } catch (error) {
        console.error('Error saving user profile:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to save profile' });
      }
    },

    setUserGoals: async (goals) => {
      try {
        await storageService.saveUserGoals(goals);
        dispatch({ type: ActionTypes.SET_USER_GOALS, payload: goals });
      } catch (error) {
        console.error('Error saving user goals:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to save goals' });
      }
    },

    logout: async () => {
      try {
        await storageService.clearAllData();
        dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: null });
        dispatch({ type: ActionTypes.SET_USER_GOALS, payload: null });
        dispatch({ type: ActionTypes.SET_LOGIN_STATUS, payload: false });
        dispatch({ type: ActionTypes.SET_TODAY_LOGS, payload: [] });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },

    // Nutrition actions
    addFoodLog: async (foodLog) => {
      try {
        const logWithDate = {
          ...foodLog,
          date: getCurrentDate(),
          timestamp: new Date().toISOString(),
        };

        await storageService.saveFoodLog(logWithDate);
        dispatch({ type: ActionTypes.ADD_FOOD_LOG, payload: logWithDate });

        // Update daily nutrition summary
        const today = getCurrentDate();
        const updatedLogs = await storageService.getFoodLogsForDate(today);
        const dailyNutrition = calculateDailyNutrition(updatedLogs);
        await storageService.saveDailyNutrition(today, dailyNutrition);

      } catch (error) {
        console.error('Error adding food log:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to save food log' });
      }
    },

    deleteFoodLog: async (logId) => {
      try {
        await storageService.deleteFoodLog(logId);

        // Reload today's logs
        const today = getCurrentDate();
        const updatedLogs = await storageService.getFoodLogsForDate(today);
        dispatch({ type: ActionTypes.SET_TODAY_LOGS, payload: updatedLogs });

        // Update daily nutrition summary
        const dailyNutrition = calculateDailyNutrition(updatedLogs);
        await storageService.saveDailyNutrition(today, dailyNutrition);

      } catch (error) {
        console.error('Error deleting food log:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to delete food log' });
      }
    },

    loadLogsForDate: async (date) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const logs = await storageService.getFoodLogsForDate(date);
        dispatch({ type: ActionTypes.SET_TODAY_LOGS, payload: logs });
      } catch (error) {
        console.error('Error loading logs for date:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load food logs' });
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    },

    // Settings actions
    updateSettings: async (newSettings) => {
      try {
        const updatedSettings = { ...state.settings, ...newSettings };
        await storageService.saveAppSettings(updatedSettings);
        dispatch({ type: ActionTypes.SET_SETTINGS, payload: updatedSettings });
      } catch (error) {
        console.error('Error updating settings:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to update settings' });
      }
    },

    // Error handling
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
