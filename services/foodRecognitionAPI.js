import axios from 'axios';

// Calorie Mama API Configuration
const CALORIE_MAMA_API_URL = 'https://api.foodvisor.io/v1/recognition';
const API_KEY = 'YOUR_CALORIE_MAMA_API_KEY'; // This should be stored in environment variables

/**
 * Food Recognition API Service using Calorie Mama/Foodvisor API
 */
class FoodRecognitionAPI {
  constructor() {
    this.client = axios.create({
      baseURL: CALORIE_MAMA_API_URL,
      timeout: 30000,
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Analyze food image and get nutritional information
   * @param {string} imageUri - Local image URI from camera/gallery
   * @returns {Promise<Object>} Nutrition analysis results
   */
  async analyzeFood(imageUri) {
    try {
      // Create form data for image upload
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'food-image.jpg',
      });

      const response = await this.client.post('', formData);

      return this.parseNutritionData(response.data);
    } catch (error) {
      console.error('Food recognition API error:', error);
      throw this.handleAPIError(error);
    }
  }

  /**
   * Parse API response and extract relevant nutrition data
   * @param {Object} apiResponse - Raw API response
   * @returns {Object} Formatted nutrition data
   */
  parseNutritionData(apiResponse) {
    // Mock data structure for demo purposes
    // This should be adapted based on actual Calorie Mama API response format
    const mockNutritionData = {
      foodItems: [
        {
          name: 'Detected Food Item',
          calories: 250,
          protein: 15,
          carbs: 30,
          fat: 8,
          fiber: 5,
          sugar: 12,
          sodium: 300,
          confidence: 0.85,
          servingSize: '1 serving',
          weight: 150, // in grams
        },
      ],
      totalCalories: 250,
      confidence: 0.85,
      timestamp: new Date().toISOString(),
    };

    // For now, return mock data. In production, parse actual API response:
    // return {
    //   foodItems: apiResponse.items?.map(item => ({
    //     name: item.food?.food_info?.display_name || 'Unknown',
    //     calories: item.food?.food_info?.nutrition?.calories_100g || 0,
    //     protein: item.food?.food_info?.nutrition?.proteins_100g || 0,
    //     carbs: item.food?.food_info?.nutrition?.carbs_100g || 0,
    //     fat: item.food?.food_info?.nutrition?.fat_100g || 0,
    //     confidence: item.confidence || 0,
    //   })) || [],
    //   totalCalories: apiResponse.total_calories || 0,
    //   confidence: apiResponse.confidence || 0,
    //   timestamp: new Date().toISOString(),
    // };

    return mockNutritionData;
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Error} error - API error object
   * @returns {Error} Formatted error
   */
  handleAPIError(error) {
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      switch (status) {
        case 401:
          return new Error('Invalid API key. Please check your credentials.');
        case 429:
          return new Error('API rate limit exceeded. Please try again later.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(`API error: ${error.response.data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your internet connection.');
    } else {
      // Other error
      return new Error('An unexpected error occurred.');
    }
  }

  /**
   * Get nutrition information for a food item by name (fallback method)
   * @param {string} foodName - Name of the food item
   * @returns {Promise<Object>} Nutrition data
   */
  async searchFood(foodName) {
    try {
      // This would use a text-based food search API
      // For now, return mock data
      return {
        name: foodName,
        calories: 200,
        protein: 10,
        carbs: 25,
        fat: 5,
        fiber: 3,
        sugar: 8,
        sodium: 200,
        servingSize: '1 serving',
        weight: 100,
      };
    } catch (error) {
      console.error('Food search error:', error);
      throw this.handleAPIError(error);
    }
  }
}

export default new FoodRecognitionAPI();
