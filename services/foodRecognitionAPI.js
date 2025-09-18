import {Alert} from 'react-native';

// Mock food database for demo purposes
const MOCK_FOOD_DATABASE = [
  {
    id: 1,
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4,
    sugar: 19,
  },
  {
    id: 2,
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3,
    sugar: 14,
  },
  {
    id: 3,
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
  },
  {
    id: 4,
    name: 'Rice Bowl',
    calories: 206,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    fiber: 0.6,
    sugar: 0.1,
  },
  {
    id: 5,
    name: 'Salad',
    calories: 20,
    protein: 1.4,
    carbs: 4,
    fat: 0.2,
    fiber: 2,
    sugar: 2,
  },
];

/**
 * Simulates food recognition from an image
 * In a real app, this would call a machine learning API service
 * @param {string} imageUri - The URI of the captured image
 * @returns {Promise<object>} - Recognized food data
 */
export const recognizeFood = async imageUri => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock random food recognition
    const randomFood =
      MOCK_FOOD_DATABASE[Math.floor(Math.random() * MOCK_FOOD_DATABASE.length)];

    // Add confidence score and portion estimation
    const result = {
      ...randomFood,
      confidence: Math.random() * (0.95 - 0.7) + 0.7, // 70-95% confidence
      portion: Math.random() * (1.5 - 0.5) + 0.5, // 0.5x to 1.5x portion
      imageUri,
      recognizedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Food recognition error:', error);
    return {
      success: false,
      error: 'Failed to recognize food. Please try again.',
    };
  }
};

/**
 * Search for food items by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of matching food items
 */
export const searchFood = async query => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const filtered = MOCK_FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()),
    );

    return {
      success: true,
      data: filtered,
    };
  } catch (error) {
    console.error('Food search error:', error);
    return {
      success: false,
      error: 'Failed to search foods. Please try again.',
    };
  }
};

/**
 * Get nutrition information for a specific food item
 * @param {number} foodId - Food item ID
 * @param {number} portion - Portion multiplier (1.0 = standard serving)
 * @returns {Promise<object>} - Detailed nutrition information
 */
export const getNutritionInfo = async (foodId, portion = 1.0) => {
  try {
    const food = MOCK_FOOD_DATABASE.find(f => f.id === foodId);
    if (!food) {
      throw new Error('Food not found');
    }

    const nutritionInfo = {
      ...food,
      calories: Math.round(food.calories * portion),
      protein: Math.round(food.protein * portion * 10) / 10,
      carbs: Math.round(food.carbs * portion * 10) / 10,
      fat: Math.round(food.fat * portion * 10) / 10,
      fiber: Math.round(food.fiber * portion * 10) / 10,
      sugar: Math.round(food.sugar * portion * 10) / 10,
      portion,
    };

    return {
      success: true,
      data: nutritionInfo,
    };
  } catch (error) {
    console.error('Nutrition info error:', error);
    return {
      success: false,
      error: 'Failed to get nutrition information.',
    };
  }
};

/**
 * Log a meal to the user's daily intake
 * @param {object} mealData - Meal information to log
 * @returns {Promise<object>} - Success/failure response
 */
export const logMeal = async mealData => {
  try {
    // Simulate API call to save meal
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Meal logged:', mealData);

    return {
      success: true,
      message: 'Meal logged successfully!',
      data: {
        ...mealData,
        loggedAt: new Date().toISOString(),
        id: Date.now(), // Mock ID
      },
    };
  } catch (error) {
    console.error('Meal logging error:', error);
    return {
      success: false,
      error: 'Failed to log meal. Please try again.',
    };
  }
};

/**
 * Get user's daily nutrition summary
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>} - Daily nutrition summary
 */
export const getDailyNutrition = async (date = null) => {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock daily data - in real app this would come from API
    const mockDailyData = {
      date: targetDate,
      totalCalories: Math.floor(Math.random() * 800) + 1200, // 1200-2000
      totalProtein: Math.floor(Math.random() * 50) + 50, // 50-100g
      totalCarbs: Math.floor(Math.random() * 100) + 150, // 150-250g
      totalFat: Math.floor(Math.random() * 30) + 40, // 40-70g
      totalFiber: Math.floor(Math.random() * 10) + 15, // 15-25g
      meals: [],
      calorieGoal: 2000,
      proteinGoal: 120,
      carbsGoal: 250,
      fatGoal: 65,
    };

    return {
      success: true,
      data: mockDailyData,
    };
  } catch (error) {
    console.error('Daily nutrition error:', error);
    return {
      success: false,
      error: 'Failed to get daily nutrition data.',
    };
  }
};
