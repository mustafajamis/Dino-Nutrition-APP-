/**
 * Utility functions for formatting and calculating nutritional data
 */

/**
 * Format calories with proper units and decimal places
 * @param {number} calories - Calorie value
 * @returns {string} Formatted calorie string
 */
export const formatCalories = (calories) => {
  if (typeof calories !== 'number' || isNaN(calories)) {return '0 cal';}
  return `${Math.round(calories)} cal`;
};

/**
 * Format macronutrients (protein, carbs, fat) with units
 * @param {number} value - Macro value in grams
 * @param {string} unit - Unit (default: 'g')
 * @returns {string} Formatted macro string
 */
export const formatMacros = (value, unit = 'g') => {
  if (typeof value !== 'number' || isNaN(value)) {return `0${unit}`;}
  return `${Math.round(value)}${unit}`;
};

/**
 * Calculate total daily nutrition from food logs
 * @param {Array} foodLogs - Array of food log entries for a day
 * @returns {Object} Total nutrition summary
 */
export const calculateDailyNutrition = (foodLogs) => {
  if (!Array.isArray(foodLogs) || foodLogs.length === 0) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };
  }

  return foodLogs.reduce(
    (total, log) => {
      const nutrition = log.nutrition || {};
      return {
        calories: total.calories + (nutrition.calories || 0),
        protein: total.protein + (nutrition.protein || 0),
        carbs: total.carbs + (nutrition.carbs || 0),
        fat: total.fat + (nutrition.fat || 0),
        fiber: total.fiber + (nutrition.fiber || 0),
        sugar: total.sugar + (nutrition.sugar || 0),
        sodium: total.sodium + (nutrition.sodium || 0),
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }
  );
};

/**
 * Calculate percentage of daily goal achieved
 * @param {number} consumed - Amount consumed
 * @param {number} goal - Daily goal
 * @returns {number} Percentage (0-100)
 */
export const calculateGoalPercentage = (consumed, goal) => {
  if (typeof consumed !== 'number' || typeof goal !== 'number' || goal === 0) {
    return 0;
  }
  return Math.min(Math.round((consumed / goal) * 100), 100);
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date string
 */
export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Format date for display (e.g., "Jan 15, 2024")
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 * @param {Object} profile - User profile with weight, height, age, gender
 * @returns {number} BMR in calories
 */
export const calculateBMR = (profile) => {
  const { weight, height, age, gender } = profile;

  if (!weight || !height || !age || !gender) {
    return 2000; // Default fallback
  }

  // Convert to metric if needed
  const weightKg = weight;
  const heightCm = height;

  if (gender.toLowerCase() === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure) based on activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level ('sedentary', 'light', 'moderate', 'active', 'very_active')
 * @returns {number} TDEE in calories
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Get recommended daily goals based on TDEE and goals
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - User goal ('maintain', 'lose', 'gain')
 * @returns {Object} Recommended daily nutrition goals
 */
export const getRecommendedGoals = (tdee, goal = 'maintain') => {
  let calorieAdjustment = 0;

  switch (goal) {
    case 'lose':
      calorieAdjustment = -500; // 1 lb per week
      break;
    case 'gain':
      calorieAdjustment = 500; // 1 lb per week
      break;
    default:
      calorieAdjustment = 0;
  }

  const targetCalories = tdee + calorieAdjustment;

  return {
    calories: targetCalories,
    protein: Math.round(targetCalories * 0.15 / 4), // 15% of calories from protein
    carbs: Math.round(targetCalories * 0.50 / 4), // 50% of calories from carbs
    fat: Math.round(targetCalories * 0.35 / 9), // 35% of calories from fat
    fiber: 25, // Recommended daily fiber
    sodium: 2300, // Recommended daily sodium limit (mg)
  };
};

/**
 * Validate nutrition data
 * @param {Object} nutrition - Nutrition object to validate
 * @returns {boolean} True if valid
 */
export const validateNutritionData = (nutrition) => {
  if (!nutrition || typeof nutrition !== 'object') {return false;}

  const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
  return requiredFields.every(field =>
    nutrition.hasOwnProperty(field) &&
    typeof nutrition[field] === 'number' &&
    !isNaN(nutrition[field])
  );
};

/**
 * Get meal time based on current hour
 * @returns {string} Meal time ('breakfast', 'lunch', 'dinner', 'snack')
 */
export const getCurrentMealTime = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) {return 'breakfast';}
  if (hour >= 11 && hour < 16) {return 'lunch';}
  if (hour >= 16 && hour < 21) {return 'dinner';}
  return 'snack';
};
