import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import foodRecognitionAPI from '../services/foodRecognitionAPI';
import {useApp} from '../../context/AppContext';
import {formatCalories, formatMacros, getCurrentMealTime} from '../../utils/nutritionUtils';

const {width, height} = Dimensions.get('window');

const FoodScannerScreen = () => {
  const {actions} = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const openImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to select a photo of your food',
      [
        {text: 'Camera', onPress: openCamera},
        {text: 'Gallery', onPress: openGallery},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response) => {
    if (response.didCancel || response.error) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      setSelectedImage(asset);
      setNutritionData(null);
      analyzeFood(asset.uri);
    }
  };

  const analyzeFood = async (imageUri) => {
    try {
      setAnalyzing(true);
      const result = await foodRecognitionAPI.analyzeFood(imageUri);
      setNutritionData(result);
    } catch (error) {
      Alert.alert('Analysis Error', error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveFoodLog = async () => {
    if (!nutritionData) {return;}

    try {
      const foodLog = {
        imageUri: selectedImage.uri,
        mealTime: getCurrentMealTime(),
        nutrition: nutritionData.foodItems[0], // Use first detected item
        confidence: nutritionData.confidence,
        analysisData: nutritionData,
      };

      await actions.addFoodLog(foodLog);

      Alert.alert(
        'Success',
        'Food logged successfully!',
        [
          {
            text: 'Log Another',
            onPress: () => {
              setSelectedImage(null);
              setNutritionData(null);
            },
          },
          {text: 'OK'},
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save food log');
    }
  };

  const NutritionCard = ({nutrition}) => (
    <View style={styles.nutritionCard}>
      <Text style={styles.foodName}>{nutrition.name}</Text>
      <Text style={styles.servingSize}>{nutrition.servingSize}</Text>

      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{formatCalories(nutrition.calories)}</Text>
          <Text style={styles.nutritionLabel}>Calories</Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{formatMacros(nutrition.protein)}</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{formatMacros(nutrition.carbs)}</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{formatMacros(nutrition.fat)}</Text>
          <Text style={styles.nutritionLabel}>Fat</Text>
        </View>
      </View>

      {nutrition.confidence && (
        <Text style={styles.confidence}>
          Confidence: {Math.round(nutrition.confidence * 100)}%
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Scanner</Text>
        <Text style={styles.subtitle}>Take a photo to analyze your food</Text>
      </View>

      {!selectedImage ? (
        <View style={styles.imagePlaceholder}>
          <TouchableOpacity style={styles.cameraButton} onPress={openImagePicker}>
            <Image
              source={require('../../assets/icons/CameraIcon.png')}
              style={styles.cameraIcon}
            />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{uri: selectedImage.uri}} style={styles.selectedImage} />
          <TouchableOpacity style={styles.retakeButton} onPress={openImagePicker}>
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {analyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#91C788" />
          <Text style={styles.loadingText}>Analyzing your food...</Text>
        </View>
      )}

      {nutritionData && !analyzing && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Analysis Results</Text>

          {nutritionData.foodItems.map((item, index) => (
            <NutritionCard key={index} nutrition={item} />
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={saveFoodLog}>
            <Text style={styles.saveButtonText}>Save to Food Log</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedImage && !analyzing && !nutritionData && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to analyze this image. Please try another photo.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => analyzeFood(selectedImage.uri)}>
            <Text style={styles.retryButtonText}>Retry Analysis</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 100, // Account for tab bar
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4,
    margin: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#91C788',
    borderRadius: 60,
    width: 120,
    height: 120,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
    marginBottom: 8,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    margin: 20,
    alignItems: 'center',
  },
  selectedImage: {
    width: width - 40,
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  retakeButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    margin: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#91C788',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  confidence: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#91C788',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodScannerScreen;
