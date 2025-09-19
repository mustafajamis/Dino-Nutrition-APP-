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

  // Generate unique IDs
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User Management
  async createUser(userData) {
    try {
      const users = await this.getAllUsers();
      const existingUser = users.find(user =>
        user.username === userData.username || user.email === userData.email
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
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const usersJson = await AsyncStorage.getItem('users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async getUserByCredentials(username, password) {
    try {
      const users = await this.getAllUsers();
      return users.find(user =>
        (user.username === username || user.email === username) &&
        user.password === password
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

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('users', JSON.stringify(users));
      return users[userIndex];
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
      let todayActivity = activities.find(activity =>
        activity.date === today
      );

      if (!todayActivity) {
        todayActivity = {
          id: this.generateId(),
          userId: userId,
          date: today,
          meals: [],
          exercises: [],
          totalCaloriesConsumed: 0,
          totalCaloriesBurned: 0,
          waterIntake: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        activities.push(todayActivity);
      }

      // Add meal or exercise data
      if (activityData.type === 'meal') {
        todayActivity.meals.push({
          id: this.generateId(),
          name: activityData.name,
          calories: activityData.calories,
          foods: activityData.foods || [],
          time: activityData.time || new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
        });
        todayActivity.totalCaloriesConsumed += activityData.calories;
      } else if (activityData.type === 'exercise') {
        todayActivity.exercises.push({
          id: this.generateId(),
          type: activityData.exerciseType,
          duration: activityData.duration,
          calories: activityData.calories,
          time: activityData.time || new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString(),
        });
        todayActivity.totalCaloriesBurned += activityData.calories;
      }

      todayActivity.updatedAt = new Date().toISOString();

      const key = `activities_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(activities));
      return todayActivity;
    } catch (error) {
      console.error('Error adding daily activity:', error);
      throw error;
    }
  }

  async getUserActivities(userId, limit = 30) {
    try {
      const key = `activities_${userId}`;
      const activitiesJson = await AsyncStorage.getItem(key);
      const activities = activitiesJson ? JSON.parse(activitiesJson) : [];

      // Sort by date descending and limit results
      return activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  async getTodayActivity(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const activities = await this.getUserActivities(userId);

      return activities.find(activity => activity.date === today) || {
        id: this.generateId(),
        userId: userId,
        date: today,
        meals: [],
        exercises: [],
        totalCaloriesConsumed: 0,
        totalCaloriesBurned: 0,
        waterIntake: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
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

        const dayActivity = activities.find(activity => activity.date === dateStr);

        weeklyData.push({
          date: dateStr,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          calories: dayActivity ? dayActivity.totalCaloriesConsumed : 0,
          burned: dayActivity ? dayActivity.totalCaloriesBurned : 0,
          exerciseMinutes: dayActivity ?
            dayActivity.exercises.reduce((total, ex) => total + ex.duration, 0) : 0,
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
        totalBurned: 0,
        averageDaily: 0,
        activeDays: 0,
        totalExerciseMinutes: 0,
      };

      activities.forEach(activity => {
        monthlyData.totalCalories += activity.totalCaloriesConsumed;
        monthlyData.totalBurned += activity.totalCaloriesBurned;
        if (activity.totalCaloriesConsumed > 0) {
          monthlyData.activeDays++;
        }
        monthlyData.totalExerciseMinutes += activity.exercises.reduce(
          (total, ex) => total + ex.duration, 0
        );
      });

      monthlyData.averageDaily = monthlyData.activeDays > 0 ?
        Math.round(monthlyData.totalCalories / monthlyData.activeDays) : 0;

      return monthlyData;
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      return {
        totalCalories: 0,
        totalBurned: 0,
        averageDaily: 0,
        activeDays: 0,
        totalExerciseMinutes: 0,
      };
    }
  }

  // Session Management
  async setCurrentUser(user) {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Clear all data (for testing purposes)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(['users', 'currentUser']);
      // Also clear activity data for all users
      const keys = await AsyncStorage.getAllKeys();
      const activityKeys = keys.filter(key => key.startsWith('activities_'));
      await AsyncStorage.multiRemove(activityKeys);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default new DatabaseService();
