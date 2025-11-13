// src/api/foodRecognition.ts
import { CALORIE_MAMA_API_KEY, CALORIE_MAMA_API_URL } from '../config';

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
 * Convert nutrition values from kg to grams
 * The API returns values in SI units (kg), but we want to display in grams
 */
function convertNutritionToGrams(nutrition: NutritionData): NutritionData {
  const converted: NutritionData = {};
  
  // Convert from kg to grams (multiply by 1000)
  if (nutrition.totalFat !== undefined) converted.totalFat = nutrition.totalFat * 1000;
  if (nutrition.saturatedFat !== undefined) converted.saturatedFat = nutrition.saturatedFat * 1000;
  if (nutrition.transFat !== undefined) converted.transFat = nutrition.transFat * 1000;
  if (nutrition.cholesterol !== undefined) converted.cholesterol = nutrition.cholesterol * 1000;
  if (nutrition.sodium !== undefined) converted.sodium = nutrition.sodium * 1000;
  if (nutrition.totalCarbs !== undefined) converted.totalCarbs = nutrition.totalCarbs * 1000;
  if (nutrition.dietaryFiber !== undefined) converted.dietaryFiber = nutrition.dietaryFiber * 1000;
  if (nutrition.sugars !== undefined) converted.sugars = nutrition.sugars * 1000;
  if (nutrition.protein !== undefined) converted.protein = nutrition.protein * 1000;
  if (nutrition.calcium !== undefined) converted.calcium = nutrition.calcium * 1000;
  if (nutrition.iron !== undefined) converted.iron = nutrition.iron * 1000;
  if (nutrition.potassium !== undefined) converted.potassium = nutrition.potassium * 1000;
  if (nutrition.vitaminA !== undefined) converted.vitaminA = nutrition.vitaminA * 1000;
  if (nutrition.vitaminC !== undefined) converted.vitaminC = nutrition.vitaminC * 1000;
  if (nutrition.monounsaturatedFat !== undefined) converted.monounsaturatedFat = nutrition.monounsaturatedFat * 1000;
  if (nutrition.polyunsaturatedFat !== undefined) converted.polyunsaturatedFat = nutrition.polyunsaturatedFat * 1000;
  
  // Calories stay as-is (they're already in kcal per 1kg)
  if (nutrition.calories !== undefined) converted.calories = nutrition.calories;
  
  return converted;
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
    const endpoint = fullNutrition 
      ? `${CALORIE_MAMA_API_URL}/full`
      : CALORIE_MAMA_API_URL;

    // Create form data
    const formData = new FormData();
    
    // Handle different image sources
    const imageData: any = {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food.jpg',
    };
    
    formData.append('media', imageData);

    const response = await fetch(`${endpoint}?user_key=${CALORIE_MAMA_API_KEY}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.errorDetail || 
        `API request failed with status ${response.status}`
      );
    }

    const data: FoodRecognitionResponse = await response.json();
    
    // Convert nutrition values from kg to grams for better display
    if (data.results) {
      data.results = data.results.map(group => ({
        ...group,
        items: group.items.map(item => ({
          ...item,
          nutrition: convertNutritionToGrams(item.nutrition),
        })),
      }));
    }
    
    return data;
  } catch (error: any) {
    console.error('Food recognition error:', error);
    throw new Error(error.message || 'Failed to recognize food');
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
 * Calculate nutrition per 100g serving
 * @param nutrition - Nutrition data (assumed to be per 1kg)
 * @param servingWeight - Weight in kg
 * @returns Nutrition per 100g
 */
export function getNutritionPer100g(nutrition: NutritionData, servingWeight: number = 0.1): NutritionData {
  const multiplier = servingWeight / 0.1; // Convert to 100g base
  const result: NutritionData = {};
  
  if (nutrition.calories !== undefined) result.calories = Math.round(nutrition.calories * multiplier);
  if (nutrition.totalFat !== undefined) result.totalFat = Math.round(nutrition.totalFat * multiplier * 100) / 100;
  if (nutrition.saturatedFat !== undefined) result.saturatedFat = Math.round(nutrition.saturatedFat * multiplier * 100) / 100;
  if (nutrition.totalCarbs !== undefined) result.totalCarbs = Math.round(nutrition.totalCarbs * multiplier * 100) / 100;
  if (nutrition.protein !== undefined) result.protein = Math.round(nutrition.protein * multiplier * 100) / 100;
  if (nutrition.sodium !== undefined) result.sodium = Math.round(nutrition.sodium * multiplier * 100) / 100;
  if (nutrition.sugars !== undefined) result.sugars = Math.round(nutrition.sugars * multiplier * 100) / 100;
  
  return result;
}
