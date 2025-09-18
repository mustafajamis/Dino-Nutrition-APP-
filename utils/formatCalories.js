/**
 * Format calorie number for display
 * @param {number} calories - Number of calories
 * @returns {string} - Formatted calorie string
 */
export const formatCalories = calories => {
  if (calories === null || calories === undefined) {
    return '0 cal';
  }
  return `${Math.round(calories)} cal`;
};

/**
 * Format macronutrient values
 * @param {number} value - Nutrient value in grams
 * @param {string} unit - Unit (default: 'g')
 * @returns {string} - Formatted nutrient string
 */
export const formatNutrient = (value, unit = 'g') => {
  if (value === null || value === undefined) {
    return `0${unit}`;
  }
  return `${Math.round(value * 10) / 10}${unit}`;
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} - BMR in calories
 */
export const calculateBMR = (weight, height, age, gender) => {
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? bmr + 5 : bmr - 161;
};

/**
 * Calculate daily calorie needs based on activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level
 * @returns {number} - Daily calorie needs
 */
export const calculateDailyCalories = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2, // Little/no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    active: 1.725, // Hard exercise 6-7 days/week
    veryActive: 1.9, // Very hard exercise, physical job
  };

  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
};

/**
 * Calculate macronutrient distribution
 * @param {number} totalCalories - Total daily calories
 * @param {object} ratios - Macro ratios (default: balanced diet)
 * @returns {object} - Macro targets in grams
 */
export const calculateMacros = (
  totalCalories,
  ratios = {protein: 0.25, carbs: 0.45, fat: 0.3},
) => {
  return {
    protein: Math.round((totalCalories * ratios.protein) / 4), // 4 cal/g
    carbs: Math.round((totalCalories * ratios.carbs) / 4), // 4 cal/g
    fat: Math.round((totalCalories * ratios.fat) / 9), // 9 cal/g
  };
};

/**
 * Calculate percentage of daily goal achieved
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @returns {number} - Percentage (0-100+)
 */
export const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.round((current / goal) * 100);
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = date => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date for API calls (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} - API-formatted date string
 */
export const formatDateForAPI = date => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get color based on progress percentage
 * @param {number} percentage - Progress percentage
 * @returns {string} - Color hex code
 */
export const getProgressColor = percentage => {
  if (percentage < 50) return '#FF6B6B'; // Red for low
  if (percentage < 80) return '#FFE66D'; // Yellow for medium
  if (percentage <= 100) return '#91C788'; // Green for good
  return '#FF8E53'; // Orange for over goal
};

/**
 * Validate nutrition input values
 * @param {object} values - Object with nutrition values
 * @returns {object} - Validation result
 */
export const validateNutritionInput = values => {
  const errors = {};

  if (!values.calories || values.calories < 0) {
    errors.calories = 'Calories must be a positive number';
  }
  if (values.protein && values.protein < 0) {
    errors.protein = 'Protein must be a positive number';
  }
  if (values.carbs && values.carbs < 0) {
    errors.carbs = 'Carbs must be a positive number';
  }
  if (values.fat && values.fat < 0) {
    errors.fat = 'Fat must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Convert weight between units
 * @param {number} weight - Weight value
 * @param {string} fromUnit - Source unit ('kg' or 'lbs')
 * @param {string} toUnit - Target unit ('kg' or 'lbs')
 * @returns {number} - Converted weight
 */
export const convertWeight = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  }

  return weight;
};

/**
 * Convert height between units
 * @param {number} height - Height value
 * @param {string} fromUnit - Source unit ('cm', 'ft', 'in')
 * @param {string} toUnit - Target unit ('cm', 'ft', 'in')
 * @returns {number} - Converted height
 */
export const convertHeight = (height, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return height;

  // Convert to cm first
  let heightInCm = height;
  if (fromUnit === 'ft') {
    heightInCm = height * 30.48;
  } else if (fromUnit === 'in') {
    heightInCm = height * 2.54;
  }

  // Convert from cm to target unit
  if (toUnit === 'ft') {
    return heightInCm / 30.48;
  } else if (toUnit === 'in') {
    return heightInCm / 2.54;
  }

  return heightInCm; // Already in cm
};
