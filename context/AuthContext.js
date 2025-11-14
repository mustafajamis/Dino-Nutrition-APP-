import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import DatabaseService from '../services/DatabaseService';
// Use Supabase for real authentication
import {
  signIn as supaSignIn,
  signUp as supaSignUp,
  signOut as supaSignOut,
  requestPasswordReset,
} from '../src/api/auth';
import {upsertDailyTotals, toDateOnly} from '../src/api/dailyTotals';
import {supabase} from '../src/lib/supabase';

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
    // Listen for auth state changes to keep user in sync across tabs/refreshes
    const {data: sub} = supabase.auth.onAuthStateChange((_event, session) => {
      const supaUser = session?.user ?? null;
      setUser(supaUser);
      if (supaUser) {
        // Merge profile fields from Supabase into local user shape for UI consistency
        mergeSupabaseProfileIntoUser(supaUser).catch(() => {});
      }
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadTodayActivity();
    }
  }, [user, loadTodayActivity]);

  const checkAuthStatus = async () => {
    try {
      // Prefer Supabase session if available
      const {data, error} = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      if (data?.user) {
        setUser(data.user);
        // Try to merge profile details from Supabase
        await mergeSupabaseProfileIntoUser(data.user);
        return;
      }

      // Fallback: legacy local user (for offline/local-only mode)
      try {
        const currentUser = await DatabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (storageError) {
        console.warn(
          'Local storage unavailable, continuing without stored user:',
          storageError,
        );
        // Continue without cached user data
      }
    } catch (error) {
      if (error?.name === 'AuthSessionMissingError') {
        setUser(null);
      } else {
        console.error('Error checking auth status:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Pulls the profile row from Supabase and merges app-specific fields into our user object
  const mergeSupabaseProfileIntoUser = async supaUser => {
    try {
      const {data: profile, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supaUser.id)
        .maybeSingle();
      if (error) {
        throw error;
      }
      if (!profile) {
        return;
      } // nothing to merge

      // Map snake_case columns to our camelCase expectations
      const mapped = {
        dailyCalorieGoal: profile.daily_calorie_goal ?? undefined,
        name: profile.display_name ?? supaUser?.user_metadata?.display_name,
      };

      const mergedUser = {...supaUser, ...mapped};
      setUser(mergedUser);
      await DatabaseService.setCurrentUser(mergedUser);
    } catch (e) {}
  };

  const loadTodayActivity = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const activity = await DatabaseService.getTodayActivity(user.id);
      setTodayActivity(activity);
    } catch (error) {
      console.error('Error loading today activity:', error);
    }
  }, [user]);

  // Supports both signup({ name, email, password }) and signup(name, email, password)
  const signup = async (arg1, maybeEmail, maybePassword) => {
    try {
      let name, email, password;
      if (typeof arg1 === 'object') {
        name = arg1.name;
        email = arg1.email;
        password = arg1.password;
      } else {
        name = arg1;
        email = maybeEmail;
        password = maybePassword;
      }

      const {emailConfirmationRequired, user} = await supaSignUp(
        name,
        email,
        password,
      );
      // If confirmation is required, user may be null here (no session yet)
      if (user) {
        setUser(user);
      }
      return {
        success: true,
        user,
        emailConfirmationRequired: !!emailConfirmationRequired,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {success: false, error: error.message || 'Signup failed'};
    }
  };

  const login = async (email, password) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      const user = data?.user ?? null;
      if (user) {
        setUser(user);
        return {success: true, user};
      }
      return {success: false, error: 'Invalid email or password'};
    } catch (error) {
      console.error('Login error:', error);
      // Surface Supabase error message to the UI for clarity (e.g., wrong_password, invalid_credentials)
      return {success: false, error: error?.message || 'Login failed'};
    }
  };

  const resetPassword = async email => {
    try {
      await requestPasswordReset(email);
      return {success: true};
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error?.message || 'Could not send reset email',
      };
    }
  };

  const logout = async () => {
    try {
      await supaSignOut();
      setUser(null);
      setTodayActivity(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async updateData => {
    if (!user) {
      return {success: false, error: 'No user logged in'};
    }

    try {
      // Try to persist to Supabase profile first (non-fatal if it fails due to RLS)
      try {
        const supaUpdate = {user_id: user.id};
        if (
          Object.prototype.hasOwnProperty.call(updateData, 'dailyCalorieGoal')
        ) {
          supaUpdate.daily_calorie_goal = updateData.dailyCalorieGoal;
        }
        if (Object.prototype.hasOwnProperty.call(updateData, 'name')) {
          supaUpdate.display_name = updateData.name;
        }
        // Only call upsert when we actually have fields to update beyond user_id
        const {daily_calorie_goal, display_name} = supaUpdate;
        if (daily_calorie_goal !== undefined || display_name !== undefined) {
          await supabase
            .from('profiles')
            .upsert(supaUpdate, {onConflict: 'user_id'});
        }
      } catch (e) {
        // Ignore; local cache will still be updated
        // console.warn('Supabase profile update skipped:', e?.message);
      }

      // Persist locally but do not replace in-memory user; merge to keep details
      await DatabaseService.updateUser(user.id, updateData);
      const mergedUser = {...user, ...updateData};
      await DatabaseService.setCurrentUser(mergedUser);
      setUser(mergedUser);
      return {success: true, user: mergedUser};
    } catch (error) {
      console.error('Update profile error:', error);
      return {success: false, error: error.message};
    }
  };

  const addMeal = async mealData => {
    if (!user) {
      return {success: false, error: 'No user logged in'};
    }

    try {
      const updatedActivity = await DatabaseService.addDailyActivity(user.id, {
        type: 'meal',
        ...mealData,
      });
      setTodayActivity(updatedActivity);

      // Also persist aggregated totals to Supabase daily_totals (non-blocking)
      try {
        const dateISO = toDateOnly(new Date());
        const totals = {
          calories: updatedActivity?.totalCaloriesConsumed || 0,
          protein_g: updatedActivity?.totalProtein || 0,
          carbs_g: updatedActivity?.totalCarbs || 0,
          fat_g: updatedActivity?.totalFat || 0,
        };
        await upsertDailyTotals(dateISO, totals);
      } catch (e) {
        // Ignore remote persistence errors (e.g., RLS not configured); local state is already updated
        // console.warn('daily_totals upsert skipped:', e?.message);
      }
      return {success: true, activity: updatedActivity};
    } catch (error) {
      console.error('Add meal error:', error);
      return {success: false, error: error.message};
    }
  };

  const getMonthlyStats = async () => {
    if (!user) {
      return {};
    }

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

  const setDailyGoal = async goal => {
    if (!user) {
      return {success: false, error: 'No user logged in'};
    }

    try {
      await DatabaseService.updateUser(user.id, {dailyCalorieGoal: goal});
      const mergedUser = {...user, dailyCalorieGoal: goal};
      await DatabaseService.setCurrentUser(mergedUser);
      setUser(mergedUser);
      return {success: true, user: mergedUser};
    } catch (error) {
      console.error('Set daily goal error:', error);
      return {success: false, error: error.message};
    }
  };

  const value = {
    user,
    loading,
    todayActivity,
    signup,
    login,
    resetPassword,
    logout,
    updateProfile,
    addMeal,
    getMonthlyStats,
    refreshTodayActivity,
    setDailyGoal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
