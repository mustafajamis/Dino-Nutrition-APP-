import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Data Storage Service for managing local app data
 */
class StorageService {
  // Storage keys
  static KEYS = {
    USER_PROFILE: 'user_profile',
    FOOD_LOGS: 'food_logs',
    DAILY_NUTRITION: 'daily_nutrition',
    USER_GOALS: 'user_goals',
    APP_SETTINGS: 'app_settings',
  };

  /**
   * Save user profile data
   * @param {Object} profile - User profile object
   */
  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(
        StorageService.KEYS.USER_PROFILE,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile data
   * @returns {Promise<Object|null>} User profile or null if not found
   */
  async getUserProfile() {
    try {
      const profile = await AsyncStorage.getItem(StorageService.KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Save food log entry
   * @param {Object} foodLog - Food log entry
   */
  async saveFoodLog(foodLog) {
    try {
      const existingLogs = await this.getFoodLogs();
      const updatedLogs = [...existingLogs, { ...foodLog, id: Date.now() }];

      await AsyncStorage.setItem(
        StorageService.KEYS.FOOD_LOGS,
        JSON.stringify(updatedLogs)
      );
    } catch (error) {
      console.error('Error saving food log:', error);
      throw error;
    }
  }

  /**
   * Get all food logs
   * @returns {Promise<Array>} Array of food log entries
   */
  async getFoodLogs() {
    try {
      const logs = await AsyncStorage.getItem(StorageService.KEYS.FOOD_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting food logs:', error);
      return [];
    }
  }

  /**
   * Get food logs for a specific date
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of food logs for the date
   */
  async getFoodLogsForDate(date) {
    try {
      const allLogs = await this.getFoodLogs();
      return allLogs.filter(log => log.date === date);
    } catch (error) {
      console.error('Error getting food logs for date:', error);
      return [];
    }
  }

  /**
   * Save daily nutrition summary
   * @param {string} date - Date string (YYYY-MM-DD)
   * @param {Object} nutrition - Nutrition summary object
   */
  async saveDailyNutrition(date, nutrition) {
    try {
      const existingData = await this.getDailyNutrition();
      const updatedData = { ...existingData, [date]: nutrition };

      await AsyncStorage.setItem(
        StorageService.KEYS.DAILY_NUTRITION,
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error('Error saving daily nutrition:', error);
      throw error;
    }
  }

  /**
   * Get daily nutrition data
   * @returns {Promise<Object>} Daily nutrition data indexed by date
   */
  async getDailyNutrition() {
    try {
      const nutrition = await AsyncStorage.getItem(StorageService.KEYS.DAILY_NUTRITION);
      return nutrition ? JSON.parse(nutrition) : {};
    } catch (error) {
      console.error('Error getting daily nutrition:', error);
      return {};
    }
  }

  /**
   * Get nutrition data for a specific date
   * @param {string} date - Date string (YYYY-MM-DD)
   * @returns {Promise<Object|null>} Nutrition data for the date
   */
  async getNutritionForDate(date) {
    try {
      const allNutrition = await this.getDailyNutrition();
      return allNutrition[date] || null;
    } catch (error) {
      console.error('Error getting nutrition for date:', error);
      return null;
    }
  }

  /**
   * Save user goals (calorie target, macros, etc.)
   * @param {Object} goals - User goals object
   */
  async saveUserGoals(goals) {
    try {
      await AsyncStorage.setItem(
        StorageService.KEYS.USER_GOALS,
        JSON.stringify(goals)
      );
    } catch (error) {
      console.error('Error saving user goals:', error);
      throw error;
    }
  }

  /**
   * Get user goals
   * @returns {Promise<Object|null>} User goals or null if not found
   */
  async getUserGoals() {
    try {
      const goals = await AsyncStorage.getItem(StorageService.KEYS.USER_GOALS);
      return goals ? JSON.parse(goals) : null;
    } catch (error) {
      console.error('Error getting user goals:', error);
      return null;
    }
  }

  /**
   * Save app settings
   * @param {Object} settings - App settings object
   */
  async saveAppSettings(settings) {
    try {
      await AsyncStorage.setItem(
        StorageService.KEYS.APP_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving app settings:', error);
      throw error;
    }
  }

  /**
   * Get app settings
   * @returns {Promise<Object>} App settings with defaults
   */
  async getAppSettings() {
    try {
      const settings = await AsyncStorage.getItem(StorageService.KEYS.APP_SETTINGS);
      const defaultSettings = {
        units: 'metric', // 'metric' or 'imperial'
        notifications: true,
        darkMode: false,
      };

      return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
    } catch (error) {
      console.error('Error getting app settings:', error);
      return {
        units: 'metric',
        notifications: true,
        darkMode: false,
      };
    }
  }

  /**
   * Delete food log entry
   * @param {number} logId - ID of the log entry to delete
   */
  async deleteFoodLog(logId) {
    try {
      const existingLogs = await this.getFoodLogs();
      const updatedLogs = existingLogs.filter(log => log.id !== logId);

      await AsyncStorage.setItem(
        StorageService.KEYS.FOOD_LOGS,
        JSON.stringify(updatedLogs)
      );
    } catch (error) {
      console.error('Error deleting food log:', error);
      throw error;
    }
  }

  /**
   * Clear all app data (use with caution)
   */
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(StorageService.KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export default new StorageService();
