// src/api/foodRecognition.ts
import { CALORIE_MAMA_API_KEY_CONFIG, CALORIE_MAMA_API_URL_CONFIG } from '../config';

export interface NutritionData {
  calories?: number;
  totalFat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  totalCarbs?: number;
  dietaryFiber?: number;
  sugars?: number;
  protein?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitaminA?: number;
  vitaminC?: number;
  monounsaturatedFat?: number;
  polyunsaturatedFat?: number;
}

export interface ServingSize {
  unit: string;
  servingWeight: number;
}

export interface FoodItem {
  name: string;
  score: number;
  nutrition: NutritionData;
  servingSizes?: ServingSize[];
  brand?: string;
  generic?: boolean;
  servingInfo?: string; // Add serving info for clarity
}

export interface FoodGroup {
  group: string;
  items: FoodItem[];
  packagedgoods?: boolean;
}

export interface FoodRecognitionResponse {
  model: string;
  results: FoodGroup[];
}

/**
 * Convert Calorie Mama nutrition values to realistic serving sizes
 * Calorie Mama returns data per 1kg, we need to convert to typical serving sizes
 */
function convertToRealisticServing(nutrition: NutritionData, foodName: string): { nutrition: NutritionData, servingInfo: string } {
  // Define typical serving sizes for different food types (in grams)
  const getServingSize = (name: string): { size: number, description: string } => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('pizza')) {return { size: 150, description: '1 slice (150g)' };}
    if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork')) {return { size: 120, description: '1 serving (120g)' };}
    if (lowerName.includes('rice') || lowerName.includes('pasta')) {return { size: 150, description: '1 cup cooked (150g)' };}
    if (lowerName.includes('bread') || lowerName.includes('toast')) {return { size: 30, description: '1 slice (30g)' };}
    if (lowerName.includes('salad')) {return { size: 100, description: '1 cup (100g)' };}
    if (lowerName.includes('soup')) {return { size: 250, description: '1 bowl (250g)' };}
    if (lowerName.includes('burger')) {return { size: 200, description: '1 burger (200g)' };}
    if (lowerName.includes('sandwich')) {return { size: 150, description: '1 sandwich (150g)' };}
    if (lowerName.includes('apple') || lowerName.includes('banana') || lowerName.includes('orange')) {return { size: 150, description: '1 medium fruit (150g)' };}
    if (lowerName.includes('cookie') || lowerName.includes('biscuit')) {return { size: 25, description: '1 cookie (25g)' };}

    // Default serving size
    return { size: 100, description: '1 serving (100g)' };
  };

  const serving = getServingSize(foodName);
  const multiplier = serving.size / 1000; // Convert from per-kg to per-serving

  const converted: NutritionData = {};

  // Convert all values with proper rounding
  if (nutrition.calories !== undefined) {
    converted.calories = Math.round(nutrition.calories * multiplier);
  }
  if (nutrition.totalFat !== undefined) {
    converted.totalFat = Math.round(nutrition.totalFat * multiplier * 10) / 10;
  }
  if (nutrition.saturatedFat !== undefined) {
    converted.saturatedFat = Math.round(nutrition.saturatedFat * multiplier * 10) / 10;
  }
  if (nutrition.totalCarbs !== undefined) {
    converted.totalCarbs = Math.round(nutrition.totalCarbs * multiplier * 10) / 10;
  }
  if (nutrition.protein !== undefined) {
    converted.protein = Math.round(nutrition.protein * multiplier * 10) / 10;
  }
  if (nutrition.sodium !== undefined) {
    converted.sodium = Math.round(nutrition.sodium * multiplier);
  }
  if (nutrition.sugars !== undefined) {
    converted.sugars = Math.round(nutrition.sugars * multiplier * 10) / 10;
  }
  if (nutrition.dietaryFiber !== undefined) {
    converted.dietaryFiber = Math.round(nutrition.dietaryFiber * multiplier * 10) / 10;
  }

  // Copy other nutrients
  ['transFat', 'cholesterol', 'calcium', 'iron', 'potassium', 'vitaminA', 'vitaminC', 'monounsaturatedFat', 'polyunsaturatedFat'].forEach(key => {
    if (nutrition[key] !== undefined) {
      converted[key] = Math.round(nutrition[key] * multiplier * 10) / 10;
    }
  });

  return {
    nutrition: converted,
    servingInfo: serving.description,
  };
}

/**
 * Validate nutrition data for reasonableness
 */
function validateNutritionData(nutrition: NutritionData, foodName: string): boolean {
  // Basic sanity checks
  if (nutrition.calories && (nutrition.calories < 1 || nutrition.calories > 900)) {
    console.warn(`Unusual calorie count for ${foodName}: ${nutrition.calories}`);
  }

  if (nutrition.totalFat && nutrition.totalFat > 50) {
    console.warn(`Very high fat content for ${foodName}: ${nutrition.totalFat}g`);
  }

  if (nutrition.protein && nutrition.protein > 50) {
    console.warn(`Very high protein content for ${foodName}: ${nutrition.protein}g`);
  }

  if (nutrition.totalCarbs && nutrition.totalCarbs > 80) {
    console.warn(`Very high carb content for ${foodName}: ${nutrition.totalCarbs}g`);
  }

  return true;
}

/**
 * Search for food using USDA FoodData Central API (Free alternative)
 * @param foodName - The name of the food to search for
 * @returns Promise with food data
 */
export async function searchFoodByName(foodName: string): Promise<FoodItem[]> {
  try {
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(foodName)}&pageSize=5`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`USDA API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.foods || data.foods.length === 0) {
      return [];
    }

    // Convert USDA data to our FoodItem format
    return data.foods.slice(0, 3).map((food: any) => {
      const nutrients = food.foodNutrients || [];

      // Map USDA nutrient IDs to our format
      const getUsdaNutrient = (nutrientId: number) => {
        const nutrient = nutrients.find((n: any) => n.nutrientId === nutrientId);
        return nutrient ? nutrient.value : 0;
      };

      return {
        name: food.description || 'Unknown Food',
        score: 0.8, // Default confidence score
        nutrition: {
          calories: getUsdaNutrient(1008), // Energy (kcal)
          totalFat: getUsdaNutrient(1004), // Total lipid (fat)
          saturatedFat: getUsdaNutrient(1258), // Fatty acids, total saturated
          totalCarbs: getUsdaNutrient(1005), // Carbohydrate, by difference
          dietaryFiber: getUsdaNutrient(1079), // Fiber, total dietary
          sugars: getUsdaNutrient(2000), // Sugars, total including NLEA
          protein: getUsdaNutrient(1003), // Protein
          sodium: getUsdaNutrient(1093), // Sodium, Na
        },
        generic: true,
      };
    });
  } catch (error: any) {
    console.error('USDA food search error:', error);
    throw new Error(error.message || 'Failed to search for food');
  }
}

/**
 * Recognizes food from an image using the Calorie Mama API
 * @param imageUri - The URI of the image to recognize (can be base64 or file path)
 * @param fullNutrition - Whether to use the full nutrition endpoint
 * @returns Promise with the food recognition results
 */
export async function recognizeFood(
  imageUri: string,
  fullNutrition: boolean = false
): Promise<FoodRecognitionResponse> {
  try {
    // Check if we have a valid API key
    if (!CALORIE_MAMA_API_KEY_CONFIG || CALORIE_MAMA_API_KEY_CONFIG === 'your_actual_calorie_mama_key_here' || CALORIE_MAMA_API_KEY_CONFIG === 'free_usda_api') {
      throw new Error('Food image recognition requires a valid Calorie Mama API key. Please use manual food entry instead.');
    }

    const endpoint = fullNutrition
      ? `${CALORIE_MAMA_API_URL_CONFIG}/full`
      : CALORIE_MAMA_API_URL_CONFIG;

    // Create form data
    const formData = new FormData();

    // Handle different image sources
    const imageData: any = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food.jpg',
    };

    formData.append('media', imageData);

    const response = await fetch(`${endpoint}?user_key=${CALORIE_MAMA_API_KEY_CONFIG}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.errorDetail || `API request failed with status ${response.status}`;

      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key or restricted access. Please use manual food entry instead.');
      }

      throw new Error(errorMessage);
    }

    const data: FoodRecognitionResponse = await response.json();

    // Convert nutrition values to realistic serving sizes
    if (data.results) {
      data.results = data.results.map(group => ({
        ...group,
        items: group.items.map(item => {
          const converted = convertToRealisticServing(item.nutrition, item.name);
          validateNutritionData(converted.nutrition, item.name);

          return {
            ...item,
            nutrition: converted.nutrition,
            servingInfo: converted.servingInfo,
          };
        }),
      }));
    }

    return data;
  } catch (error: any) {
    console.error('Food recognition error:', error);
    throw new Error(error.message || 'Failed to recognize food. Please try manual entry instead.');
  }
}

/**
 * Get the top recognized food item from the API response
 * @param response - The API response
 * @returns The top food item or null
 */
export function getTopFoodItem(response: FoodRecognitionResponse): FoodItem | null {
  if (!response.results || response.results.length === 0) {
    return null;
  }

  // Get the first non-packaged-goods group with items
  for (const group of response.results) {
    if (group.items && group.items.length > 0) {
      // Return the item with the highest score
      return group.items.reduce((prev, current) =>
        (current.score > prev.score) ? current : prev
      );
    }
  }

  return null;
}

/**
 * Calculate nutrition for a custom serving size
 * @param nutrition - Nutrition data per serving
 * @param currentServingSize - Current serving size in grams
 * @param targetServingSize - Target serving size in grams
 * @returns Scaled nutrition data
 */
export function scaleNutritionToServing(
  nutrition: NutritionData,
  currentServingSize: number,
  targetServingSize: number
): NutritionData {
  const multiplier = targetServingSize / currentServingSize;
  const result: NutritionData = {};

  Object.keys(nutrition).forEach(key => {
    if (nutrition[key] !== undefined) {
      result[key] = Math.round(nutrition[key] * multiplier * 10) / 10;
    }
  });

  return result;
}
