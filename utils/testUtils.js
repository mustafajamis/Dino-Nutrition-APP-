import DatabaseService from '../services/DatabaseService';

// Simple test utility to verify database functionality
export const testDatabaseFunctionality = async () => {
  try {
    console.log('🧪 Testing Database Service...');

    // Clear any existing data
    await DatabaseService.clearAllData();
    console.log('✅ Cleared existing data');

    // Test user creation
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
      age: 25,
      gender: 'Male',
    };

    const createdUser = await DatabaseService.createUser(testUser);
    console.log('✅ User created:', createdUser.username);

    // Test user authentication
    const authenticatedUser = await DatabaseService.getUserByCredentials('testuser', 'test123');
    if (authenticatedUser) {
      console.log('✅ User authentication successful');
    } else {
      console.log('❌ User authentication failed');
      return false;
    }

    // Test adding daily activity
    const mealActivity = await DatabaseService.addDailyActivity(createdUser.id, {
      type: 'meal',
      name: 'Breakfast',
      calories: 400,
      foods: ['Oatmeal', 'Banana'],
    });
    console.log('✅ Meal activity added');

    const exerciseActivity = await DatabaseService.addDailyActivity(createdUser.id, {
      type: 'exercise',
      exerciseType: 'Running',
      duration: 30,
      calories: 300,
    });
    console.log('✅ Exercise activity added');

    // Test getting today's activity
    const todayActivity = await DatabaseService.getTodayActivity(createdUser.id);
    if (todayActivity && todayActivity.meals.length > 0 && todayActivity.exercises.length > 0) {
      console.log('✅ Today activity retrieved successfully');
      console.log('📊 Stats:', {
        meals: todayActivity.meals.length,
        exercises: todayActivity.exercises.length,
        totalCaloriesConsumed: todayActivity.totalCaloriesConsumed,
        totalCaloriesBurned: todayActivity.totalCaloriesBurned,
      });
    } else {
      console.log('❌ Failed to retrieve today activity');
      return false;
    }

    // Test weekly stats
    const weeklyStats = await DatabaseService.getWeeklyStats(createdUser.id);
    console.log('✅ Weekly stats retrieved:', weeklyStats.length, 'days');

    // Test monthly stats
    const monthlyStats = await DatabaseService.getMonthlyStats(createdUser.id);
    console.log('✅ Monthly stats retrieved:', monthlyStats);

    console.log('🎉 All database tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
};

export default {
  testDatabaseFunctionality,
};
