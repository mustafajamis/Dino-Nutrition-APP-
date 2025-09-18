import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  userProfile: null,
  loading: true,
  error: null,
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userProfile: action.payload.profile,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userProfile: null,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored authentication on app start
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedProfile = await AsyncStorage.getItem('userProfile');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        const profile = storedProfile ? JSON.parse(storedProfile) : null;

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {user, profile},
        });
      } else {
        dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: false});
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
      dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: false});
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: true});

      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data
      const mockUser = {
        id: Date.now(),
        email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {user: mockUser, profile: null},
      });

      return {success: true};
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Login failed. Please try again.',
      });
      return {success: false, error: error.message};
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: true});

      // Mock signup - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser = {
        id: Date.now(),
        email: userData.email,
        username: userData.username,
        createdAt: new Date().toISOString(),
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {user: mockUser, profile: null},
      });

      return {success: true};
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Signup failed. Please try again.',
      });
      return {success: false, error: error.message};
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'userProfile']);
      dispatch({type: AUTH_ACTIONS.LOGOUT});
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: true});

      // Mock profile update - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedProfile = {
        ...state.userProfile,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      dispatch({
        type: AUTH_ACTIONS.SET_USER_PROFILE,
        payload: updatedProfile,
      });

      dispatch({type: AUTH_ACTIONS.SET_LOADING, payload: false});

      return {success: true, profile: updatedProfile};
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Failed to update profile. Please try again.',
      });
      return {success: false, error: error.message};
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({type: AUTH_ACTIONS.CLEAR_ERROR});
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
