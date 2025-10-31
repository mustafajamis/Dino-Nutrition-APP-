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
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

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

  const simulateScanning = () => {
    setScanning(true);
    // Simulate a scanning process
    setTimeout(() => {
      setScanning(false);
      // Simulate detecting food
      setFoodName('Chicken Salad');
      setCalories('350');
      Alert.alert('Food Detected!', 'Chicken Salad - 350 calories detected. Please verify and select meal type.');
    }, 2000);
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
          <Text style={styles.subtitle}>Scan or manually add food to your meals</Text>
        </View>

        {/* Scanner Section */}
        <View style={styles.scannerSection}>
          <View style={styles.scannerFrame}>
            <Text style={styles.scannerIcon}>📸</Text>
            <Text style={styles.scannerText}>
              {scanning ? 'Scanning...' : 'Tap to scan food'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            onPress={simulateScanning}
            disabled={scanning}>
            <Text style={styles.scanButtonText}>
              {scanning ? 'Scanning...' : 'Start Scan'}
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

          <MacroSummary carbs={carbs} protein={protein} fat={fat} />

          {/* Meal Type Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {mealTypes.map((type) => (
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

const MacroSummary = ({ carbs, protein, fat }) => {
  const c = parseFloat(carbs) || 0;
  const p = parseFloat(protein) || 0;
  const f = parseFloat(fat) || 0;
  const caloriesEstimate = c * 4 + p * 4 + f * 9;
  return (
    <View style={{ marginBottom: 10, backgroundColor: '#F0F6F0', padding: 12, borderRadius: 10 }}>
      <Text style={{ fontWeight: '600', color: '#333', marginBottom: 4 }}>Macro Summary</Text>
      <Text style={{ color: '#333' }}>Carbs: {c}g · Protein: {p}g · Fat: {f}g</Text>
      <Text style={{ color: '#666', marginTop: 2 }}>Estimated macro calories: {caloriesEstimate} kcal</Text>
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
