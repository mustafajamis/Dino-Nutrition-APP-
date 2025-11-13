import AsyncStorage from '@react-native-async-storage/async-storage';

// Database Service for managing user data and activities using AsyncStorage
class DatabaseService {
  static instance = null;

  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    DatabaseService.instance = this;
  }

  // Helper method to handle AsyncStorage operations with retry logic
  async safeAsyncStorageOperation(operation, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (error.message?.includes("doesn't exist") && i < retries - 1) {
          // Wait a bit and retry - iOS simulator sometimes needs time to create directories
          await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
          continue;
        }
        throw error;
      }
    }
  }

  // Generate unique IDs
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User Management
  async createUser(userData) {
    try {
      const users = await this.getAllUsers();
      const existingUser = users.find(
        user =>
          user.username === userData.username || user.email === userData.email,
      );

      if (existingUser) {
        throw new Error('User with this username or email already exists');
      }

      const newUser = {
        id: this.generateId(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name || '',
        age: userData.age || '',
        gender: userData.gender || '',
        phone: userData.phone || '',
        profilePicture: userData.profilePicture || null,
        dailyCalorieGoal: userData.dailyCalorieGoal || 2000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);
      await this.safeAsyncStorageOperation(() =>
        AsyncStorage.setItem('users', JSON.stringify(users)),
      );
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await this.safeAsyncStorageOperation(async () => {
        const usersJson = await AsyncStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUserByCredentials(username, password) {
    try {
      const users = await this.getAllUsers();
      return users.find(
        user =>
          (user.username === username || user.email === username) &&
          user.password === password,
      );
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);

      // If a local user record doesn't exist (e.g., Supabase-only auth), create a minimal one
      if (userIndex === -1) {
        const now = new Date().toISOString();
        const newUser = {
          id: userId,
          username: '',
          email: '',
          password: '',
          name: '',
          age: '',
          gender: '',
          phone: '',
          profilePicture: null,
          dailyCalorieGoal: 2000,
          createdAt: now,
          updatedAt: now,
        };
        users.push(newUser);
      }

      const idx = users.findIndex(u => u.id === userId);
      users[idx] = {
        ...users[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      await this.safeAsyncStorageOperation(() =>
        AsyncStorage.setItem('users', JSON.stringify(users)),
      );
      return users[idx];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Daily Activity Management
  async addDailyActivity(userId, activityData) {
    try {
      const activities = await this.getUserActivities(userId);
      const today = new Date().toISOString().split('T')[0];

      // Find today's activity or create new one
      let todayActivity = activities.find(activity => activity.date === today);

      if (!todayActivity) {
        todayActivity = {
          id: this.generateId(),
          userId: userId,
          date: today,
          meals: [],
          totalCaloriesConsumed: 0,
          waterIntake: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        activities.push(todayActivity);
      }

      // Add meal data
      if (activityData.type === 'meal') {
        const meal = {
          id: this.generateId(),
          name: activityData.name,
          calories: activityData.calories,
          foods: activityData.foods || [],
          time: activityData.time || new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
          carbs: activityData.carbs || 0,
          protein: activityData.protein || 0,
          fat: activityData.fat || 0,
        };
        todayActivity.meals.push(meal);
        todayActivity.totalCaloriesConsumed += activityData.calories;

        // Initialize macro totals if not present
        if (typeof todayActivity.totalCarbs !== 'number') {
          todayActivity.totalCarbs = 0;
        }
        if (typeof todayActivity.totalProtein !== 'number') {
          todayActivity.totalProtein = 0;
        }
        if (typeof todayActivity.totalFat !== 'number') {
          todayActivity.totalFat = 0;
        }

        todayActivity.totalCarbs += meal.carbs;
        todayActivity.totalProtein += meal.protein;
        todayActivity.totalFat += meal.fat;
      }

      todayActivity.updatedAt = new Date().toISOString();

      const key = `activities_${userId}`;
      await this.safeAsyncStorageOperation(() =>
        AsyncStorage.setItem(key, JSON.stringify(activities)),
      );
      return todayActivity;
    } catch (error) {
      console.error('Error adding daily activity:', error);
      throw error;
    }
  }

  async getUserActivities(userId, limit = 30) {
    try {
      const key = `activities_${userId}`;
      return await this.safeAsyncStorageOperation(async () => {
        const activitiesJson = await AsyncStorage.getItem(key);
        const activities = activitiesJson ? JSON.parse(activitiesJson) : [];

        // Sort by date descending and limit results
        return activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit);
      });
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  async getTodayActivity(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const activities = await this.getUserActivities(userId);

      return (
        activities.find(activity => activity.date === today) || {
          id: this.generateId(),
          userId: userId,
          date: today,
          meals: [],
          totalCaloriesConsumed: 0,
          waterIntake: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error getting today activity:', error);
      return null;
    }
  }

  // Analytics and Statistics
  async getWeeklyStats(userId) {
    try {
      const activities = await this.getUserActivities(userId, 7);
      const today = new Date();
      const weeklyData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayActivity = activities.find(
          activity => activity.date === dateStr,
        );

        weeklyData.push({
          date: dateStr,
          day: date.toLocaleDateString('en-US', {weekday: 'short'}),
          calories: dayActivity ? dayActivity.totalCaloriesConsumed : 0,
        });
      }

      return weeklyData;
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      return [];
    }
  }

  async getMonthlyStats(userId) {
    try {
      const activities = await this.getUserActivities(userId, 30);
      const monthlyData = {
        totalCalories: 0,
        averageDaily: 0,
        activeDays: 0,
      };

      activities.forEach(activity => {
        monthlyData.totalCalories += activity.totalCaloriesConsumed;
        if (activity.totalCaloriesConsumed > 0) {
          monthlyData.activeDays++;
        }
      });

      monthlyData.averageDaily =
        monthlyData.activeDays > 0
          ? Math.round(monthlyData.totalCalories / monthlyData.activeDays)
          : 0;

      return monthlyData;
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      return {
        totalCalories: 0,
        averageDaily: 0,
        activeDays: 0,
      };
    }
  }

  // Session Management
  async setCurrentUser(user) {
    try {
      await this.safeAsyncStorageOperation(() =>
        AsyncStorage.setItem('currentUser', JSON.stringify(user)),
      );
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  async getCurrentUser() {
    try {
      return await this.safeAsyncStorageOperation(async () => {
        const userJson = await AsyncStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async logout() {
    try {
      await this.safeAsyncStorageOperation(() =>
        AsyncStorage.removeItem('currentUser'),
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Clear all data (for testing purposes)
  async clearAllData() {
    try {
      await this.safeAsyncStorageOperation(async () => {
        await AsyncStorage.multiRemove(['users', 'currentUser']);
        // Also clear activity data for all users
        const keys = await AsyncStorage.getAllKeys();
        const activityKeys = keys.filter(key => key.startsWith('activities_'));
        await AsyncStorage.multiRemove(activityKeys);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default new DatabaseService();
