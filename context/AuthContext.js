import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import DatabaseService from '../services/DatabaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayActivity, setTodayActivity] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      loadTodayActivity();
    }
  }, [user, loadTodayActivity]);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await DatabaseService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayActivity = useCallback(async () => {
    if (!user) {return;}

    try {
      const activity = await DatabaseService.getTodayActivity(user.id);
      setTodayActivity(activity);
    } catch (error) {
      console.error('Error loading today activity:', error);
    }
  }, [user]);

  const signup = async (userData) => {
    try {
      const newUser = await DatabaseService.createUser(userData);
      await DatabaseService.setCurrentUser(newUser);
      setUser(newUser);
      return {success: true, user: newUser};
    } catch (error) {
      console.error('Signup error:', error);
      return {success: false, error: error.message};
    }
  };

  const login = async (username, password) => {
    try {
      const authenticatedUser = await DatabaseService.getUserByCredentials(username, password);
      if (authenticatedUser) {
        await DatabaseService.setCurrentUser(authenticatedUser);
        setUser(authenticatedUser);
        return {success: true, user: authenticatedUser};
      } else {
        return {success: false, error: 'Invalid username or password'};
      }
    } catch (error) {
      console.error('Login error:', error);
      return {success: false, error: 'Login failed'};
    }
  };

  const logout = async () => {
    try {
      await DatabaseService.logout();
      setUser(null);
      setTodayActivity(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) {return {success: false, error: 'No user logged in'};}

    try {
      const updatedUser = await DatabaseService.updateUser(user.id, updateData);
      await DatabaseService.setCurrentUser(updatedUser);
      setUser(updatedUser);
      return {success: true, user: updatedUser};
    } catch (error) {
      console.error('Update profile error:', error);
      return {success: false, error: error.message};
    }
  };

  const addMeal = async (mealData) => {
    if (!user) {return {success: false, error: 'No user logged in'};}

    try {
      const updatedActivity = await DatabaseService.addDailyActivity(user.id, {
        type: 'meal',
        ...mealData,
      });
      setTodayActivity(updatedActivity);
      return {success: true, activity: updatedActivity};
    } catch (error) {
      console.error('Add meal error:', error);
      return {success: false, error: error.message};
    }
  };

  const addExercise = async (exerciseData) => {
    if (!user) {return {success: false, error: 'No user logged in'};}

    try {
      const updatedActivity = await DatabaseService.addDailyActivity(user.id, {
        type: 'exercise',
        ...exerciseData,
      });
      setTodayActivity(updatedActivity);
      return {success: true, activity: updatedActivity};
    } catch (error) {
      console.error('Add exercise error:', error);
      return {success: false, error: error.message};
    }
  };

  const getWeeklyStats = async () => {
    if (!user) {return [];}

    try {
      return await DatabaseService.getWeeklyStats(user.id);
    } catch (error) {
      console.error('Get weekly stats error:', error);
      return [];
    }
  };

  const getMonthlyStats = async () => {
    if (!user) {return {};}

    try {
      return await DatabaseService.getMonthlyStats(user.id);
    } catch (error) {
      console.error('Get monthly stats error:', error);
      return {};
    }
  };

  const refreshTodayActivity = async () => {
    await loadTodayActivity();
  };

  const value = {
    user,
    loading,
    todayActivity,
    signup,
    login,
    logout,
    updateProfile,
    addMeal,
    addExercise,
    getWeeklyStats,
    getMonthlyStats,
    refreshTodayActivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
