# Calorie Mama Food Recognition API Integration

This document describes the integration of the Calorie Mama Food Recognition API into the Dino Nutrition App.

## Overview

The Calorie Mama Food Recognition API allows users to scan food images and automatically retrieve nutritional information. This integration enables users to:

- Take photos of food with their camera
- Select food images from their photo library
- Get instant nutritional data including calories, carbs, protein, and fat
- Automatically populate meal entries with recognized food data

## API Configuration

### API Credentials

The API key is stored in `src/config.ts`:

```typescript
export const CALORIE_MAMA_API_KEY = 'c22f4f36080fca5d920725bf5dad7a3a';
export const CALORIE_MAMA_API_URL = 'https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition';
```

### API Documentation

Full API documentation is available at: https://dev.caloriemama.ai/

## Implementation Details

### File Structure

```
src/api/foodRecognition.ts   # API service for food recognition
src/config.ts                 # Configuration including API credentials
screens/food/FoodScannerScreen.js   # UI screen with image capture and recognition
```

### Key Features

#### 1. Image Capture (`FoodScannerScreen.js`)

The screen uses `react-native-image-picker` to capture or select images:

- **Take Photo**: Opens the device camera to capture a new photo
- **Choose from Library**: Allows selection of an existing photo from the device

Images are automatically resized to 544x544 pixels as required by the API.

#### 2. Food Recognition Service (`src/api/foodRecognition.ts`)

The service provides the following functions:

##### `recognizeFood(imageUri, fullNutrition)`

Sends an image to the Calorie Mama API for food recognition.

**Parameters:**
- `imageUri` (string): URI of the image to recognize
- `fullNutrition` (boolean, optional): Whether to use the full nutrition endpoint (default: false)

**Returns:** Promise with `FoodRecognitionResponse` containing recognized foods and their nutritional data

**Example:**
```javascript
const response = await recognizeFood(imageUri, true);
```

##### `getTopFoodItem(response)`

Extracts the top-scoring recognized food item from the API response.

**Parameters:**
- `response` (FoodRecognitionResponse): API response object

**Returns:** The food item with the highest score, or null if no items found

##### `getNutritionPer100g(nutrition, servingWeight)`

Calculates nutrition information per 100g serving.

**Parameters:**
- `nutrition` (NutritionData): Nutrition data object
- `servingWeight` (number, optional): Weight in kg (default: 0.1 for 100g)

**Returns:** Normalized nutrition data per 100g

### Data Conversion

The API returns nutrition values in SI units (kg). The service automatically converts these to grams for better usability:

```typescript
// Example: API returns totalCarbs in kg per 1kg of food
// Service converts to grams per 100g for display
const carbsInGrams = totalCarbs * 1000 / 10;  // Converts to grams per 100g
```

### Response Format

The API returns data in the following structure:

```json
{
  "model": "20170209",
  "results": [
    {
      "group": "Bacon",
      "items": [
        {
          "name": "Bacon",
          "score": 87,
          "nutrition": {
            "calories": 5410,
            "totalFat": 0.4178,
            "totalCarbs": 0.0143,
            "protein": 0.3704,
            "sodium": 0.0103,
            ...
          },
          "servingSizes": [
            {
              "unit": "1 slice, cooked",
              "servingWeight": 0.008
            }
          ]
        }
      ]
    }
  ]
}
```

## User Flow

1. User navigates to the Food Scanner screen
2. User taps "Scan Food with Camera"
3. User selects "Take Photo" or "Choose from Library"
4. Image is captured/selected
5. Image is sent to Calorie Mama API
6. API recognizes food and returns nutritional data
7. App extracts top food item and displays:
   - Food name
   - Calories (per 100g)
   - Carbohydrates (in grams)
   - Protein (in grams)
   - Fat (in grams)
8. User reviews and adjusts data if needed
9. User selects meal type (Breakfast, Lunch, Dinner, Snack)
10. User adds food to their meal log

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Displays user-friendly error message if API is unreachable
- **Recognition Failures**: Shows fallback message when food cannot be recognized
- **Invalid Images**: Handles cases where image format is incorrect
- **API Errors**: Parses and displays specific error messages from the API

Example error handling:
```javascript
try {
  const response = await recognizeFood(imageUri, true);
  // Process response...
} catch (error) {
  Alert.alert(
    'Recognition Failed',
    error.message || 'Failed to recognize food. Please try again or enter manually.'
  );
}
```

## Permissions

### Android (`android/app/src/main/AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (`ios/Dino/Info.plist`)

```xml
<key>NSCameraUsageDescription</key>
<string>Dino needs access to your camera to scan and recognize food items for nutrition tracking.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Dino needs access to your photo library to select food images for recognition.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Dino needs access to save food images to your photo library.</string>
```

## Dependencies

- **react-native-image-picker** (^5.x): For camera and photo library access
- Native platform permissions for camera and storage

## API Limitations

According to the Calorie Mama API documentation:

1. **Image Requirements**:
   - Format: JPEG
   - Size: 544x544 pixels (automatically handled by the app)

2. **Response Codes**:
   - `200`: Success
   - `400`: Bad Request (e.g., no photo attached)
   - `401`: Authorization failure (invalid API key)
   - `404`: Not found
   - `409`: Usage limit exceeded
   - `429`: Too Many Requests
   - `500`: Server error

3. **Rate Limits**: Check usage at https://dev.caloriemama.ai/buyer/stats

## Testing

To test the integration:

1. Build and run the app on a device (camera required)
2. Navigate to the "Food" tab
3. Tap "Scan Food with Camera"
4. Take a photo of food or select from library
5. Verify that:
   - Loading indicator appears
   - Food is recognized correctly
   - Nutritional data is displayed
   - Values can be adjusted manually
   - Food can be added to meal log

## Future Enhancements

Potential improvements for the integration:

1. **Offline Mode**: Cache common food items for offline recognition
2. **Batch Recognition**: Support scanning multiple food items at once
3. **History**: Save previously scanned foods for quick re-entry
4. **Custom Foods**: Allow users to save custom foods not recognized by the API
5. **Barcode Scanning**: Add barcode scanning for packaged goods
6. **Portion Control**: Add visual guides for portion size estimation

## Support

For issues or questions:

- API Support: https://dev.caloriemama.ai/
- App Issues: Create an issue in the GitHub repository

## References

- [Calorie Mama API Documentation](https://dev.caloriemama.ai/)
- [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)
- [React Native Documentation](https://reactnative.dev/)
