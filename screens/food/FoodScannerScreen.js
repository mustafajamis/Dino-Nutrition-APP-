import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from '../../context/AuthContext';
import {recognizeFood, getTopFoodItem} from '../../src/api/foodRecognition';

// Simple manual fallbacks for a few common foods
const fallbackNutrition = {
  pizza: {calories: 350, carbs: 45, protein: 15, fat: 14},
  pasta: {calories: 158, carbs: 31, protein: 6, fat: 1},
  rice: {calories: 130, carbs: 28, protein: 2, fat: 0},
};

const getFallbackNutrition = foodName => {
  const lower = (foodName || '').toLowerCase();
  if (lower.includes('pizza')) return fallbackNutrition.pizza;
  if (lower.includes('pasta') || lower.includes('spaghetti'))
    return fallbackNutrition.pasta;
  if (lower.includes('rice')) return fallbackNutrition.rice;
  return null;
};

const FoodScannerScreen = () => {
  const {addMeal} = useAuth();
  const [selectedMealType, setSelectedMealType] = useState('');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [scanning, setScanning] = useState(false);
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleImagePicked = async imageUri => {
    try {
      setScanning(true);

      const response = await recognizeFood(imageUri, true);
      console.log('Full API Response:', JSON.stringify(response, null, 2));

      const topItem = getTopFoodItem(response);
      console.log('Top Food Item:', JSON.stringify(topItem, null, 2));

      if (topItem) {
        const n = topItem.nutrition || {};
        const fb = getFallbackNutrition(topItem.name);
        console.log('Nutrition Values from Calorie Mama (per serving):', n);

        setFoodName(topItem.name || '');

        // Prefer API values; if missing/zero and we have a fallback, use fallback
        const cal = n.calories || (fb ? fb.calories : undefined);
        const c = n.totalCarbs || (fb ? fb.carbs : undefined);
        const p = n.protein || (fb ? fb.protein : undefined);
        const f = n.totalFat || (fb ? fb.fat : undefined);

        setCalories(cal != null ? String(Math.round(cal)) : '');
        setCarbs(c != null ? String(c) : '');
        setProtein(p != null ? String(p) : '');
        setFat(f != null ? String(f) : '');

        const servingInfo = topItem.servingInfo || 'per serving';

        Alert.alert(
          'Food Detected!',
          `${topItem.name}\n${servingInfo}\n\n` +
            `Calories: ${cal ?? '—'}\n` +
            `Carbs: ${c ?? '—'}g\n` +
            `Protein: ${p ?? '—'}g\n` +
            `Fat: ${f ?? '—'}g\n\n` +
            'Please verify the values and select meal type.',
          [{text: 'OK'}],
        );
      } else {
        Alert.alert(
          'No Food Detected',
          'Could not recognize any food in the image. Please try again or enter manually.',
        );
      }
    } catch (error) {
      console.error('Food recognition error:', error);
      Alert.alert(
        'Recognition Error',
        error.message ||
          'Failed to recognize food. Please try the search feature or manual entry instead.',
        [{text: 'OK'}],
      );
    } finally {
      setScanning(false);
    }
  };

  const selectImage = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => {
          launchCamera(
            {
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 544,
              maxHeight: 544,
            },
            response => {
              if (response.didCancel) {
                console.log('User cancelled camera');
              } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage);
              } else if (response.assets && response.assets[0]) {
                handleImagePicked(response.assets[0].uri);
              }
            },
          );
        },
      },
      {
        text: 'Choose from Library',
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
              maxWidth: 544,
              maxHeight: 544,
            },
            response => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage);
              } else if (response.assets && response.assets[0]) {
                handleImagePicked(response.assets[0].uri);
              }
            },
          );
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleAddMeal = async () => {
    if (!selectedMealType) {
      Alert.alert('Error', 'Please select a meal type');
      return;
    }
    if (!foodName.trim() || !calories.trim()) {
      Alert.alert('Error', 'Please enter food name and calories');
      return;
    }

    const result = await addMeal({
      name: selectedMealType,
      calories: parseInt(calories, 10),
      foods: [foodName],
      carbs: parseFloat(carbs) || 0,
      protein: parseFloat(protein) || 0,
      fat: parseFloat(fat) || 0,
    });

    if (result.success) {
      Alert.alert('Success', `Added ${foodName} to ${selectedMealType}!`);
      // Reset form
      setFoodName('');
      setCalories('');
      setSelectedMealType('');
      setCarbs('');
      setProtein('');
      setFat('');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Food Scanner</Text>
          <Text style={styles.subtitle}>
            Scan or manually add food to your meals
          </Text>
        </View>

        {/* Scanner Section */}
        <View style={styles.scannerSection}>
          <View style={styles.scannerFrame}>
            {scanning ? (
              <ActivityIndicator size="large" color="#91C788" />
            ) : (
              <>
                <Text style={styles.scannerIcon}>📸</Text>
                <Text style={styles.scannerText}>Tap to scan food</Text>
              </>
            )}
          </View>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            onPress={selectImage}
            disabled={scanning}>
            <Text style={styles.scanButtonText}>
              {scanning ? 'Recognizing Food...' : 'Scan Food with Camera'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Entry Section */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>Or Enter Manually</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chicken Salad"
              value={foodName}
              onChangeText={setFoodName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 350"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 25"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 12"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
            />
          </View>

          <MacroSummary
            carbs={carbs}
            protein={protein}
            fat={fat}
            calories={calories}
          />

          {/* Meal Type Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {mealTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    selectedMealType === type && styles.mealTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedMealType(type)}>
                  <Text
                    style={[
                      styles.mealTypeText,
                      selectedMealType === type && styles.mealTypeTextSelected,
                    ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Text style={styles.addButtonText}>Add to Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MacroSummary = ({carbs, protein, fat, calories}) => {
  const c = parseFloat(carbs) || 0;
  const p = parseFloat(protein) || 0;
  const f = parseFloat(fat) || 0;

  const macroBasedCalories = c * 4 + p * 4 + f * 9;
  const apiCalories = parseFloat(calories);
  const caloriesEstimate = !isNaN(apiCalories) && apiCalories > 0
    ? apiCalories
    : macroBasedCalories;

  return (
    <View
      style={{
        marginBottom: 10,
        backgroundColor: '#F0F6F0',
        padding: 12,
        borderRadius: 10,
      }}>
      <Text style={{fontWeight: '600', color: '#333', marginBottom: 4}}>
        Macro Summary
      </Text>
      <Text style={{color: '#333'}}>
        Carbs: {c}g · Protein: {p}g · Fat: {f}g
      </Text>
      <Text style={{color: '#666', marginTop: 2}}>
        Estimated macro calories: {Math.round(caloriesEstimate)} kcal
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scannerSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  scannerFrame: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#DDD',
  },
  scannerIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  scannerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#91C788',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#CCC',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  manualSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealTypeButton: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  mealTypeButtonSelected: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  mealTypeTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#91C788',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodScannerScreen;
