import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import {
  formatCalories,
  formatNutrient,
  calculateProgress,
  getProgressColor,
  formatDate,
} from '../../utils/formatCalories';
import {
  getDailyNutrition,
  searchFood,
  logMeal,
  getNutritionInfo,
} from '../../services/foodRecognitionAPI';

const {width} = Dimensions.get('window');

const CaloriesScreen = () => {
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      await loadDailyData();
    };
    loadData();
  }, [selectedDate]);

  const loadDailyData = async () => {
    setLoading(true);
    try {
      const result = await getDailyNutrition(selectedDate);
      if (result.success) {
        setDailyData(result.data);
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFood = async query => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await searchFood(query);
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error('Error searching food:', error);
    }
  };

  const handleSelectFood = food => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery(food.name);
  };

  const handleLogMeal = async () => {
    if (!selectedFood) {
      Alert.alert('Error', 'Please select a food item');
      return;
    }

    try {
      const mealData = {
        ...selectedFood,
        loggedAt: new Date().toISOString(),
        date: selectedDate.toISOString().split('T')[0],
      };

      const result = await logMeal(mealData);
      if (result.success) {
        Alert.alert('Success', 'Meal logged successfully!');
        setShowAddModal(false);
        setSearchQuery('');
        setSelectedFood(null);
        loadDailyData(); // Refresh data
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  const CalorieProgress = ({current, goal, label, color}) => {
    const percentage = calculateProgress(current, goal);
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressText}>
            {current}/{goal}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: color || getProgressColor(percentage),
              },
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
      </View>
    );
  };

  const MacroCard = ({title, current, goal, unit, color}) => (
    <View style={styles.macroCard}>
      <Text style={styles.macroTitle}>{title}</Text>
      <Text style={[styles.macroValue, {color}]}>
        {formatNutrient(current, unit)}
      </Text>
      <Text style={styles.macroGoal}>Goal: {formatNutrient(goal, unit)}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading nutrition data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Nutrition</Text>
          <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
        </View>

        {/* Main Calorie Progress */}
        {dailyData && (
          <View style={styles.mainProgress}>
            <Text style={styles.calorieTitle}>Calories</Text>
            <Text style={styles.calorieCount}>
              {formatCalories(dailyData.totalCalories)}
            </Text>
            <Text style={styles.calorieGoal}>
              Goal: {formatCalories(dailyData.calorieGoal)}
            </Text>
            <CalorieProgress
              current={dailyData.totalCalories}
              goal={dailyData.calorieGoal}
              label=""
              color="#91C788"
            />
          </View>
        )}

        {/* Macronutrients */}
        {dailyData && (
          <View style={styles.macroSection}>
            <Text style={styles.sectionTitle}>Macronutrients</Text>
            <View style={styles.macroGrid}>
              <MacroCard
                title="Protein"
                current={dailyData.totalProtein}
                goal={dailyData.proteinGoal}
                unit="g"
                color="#FF6B6B"
              />
              <MacroCard
                title="Carbs"
                current={dailyData.totalCarbs}
                goal={dailyData.carbsGoal}
                unit="g"
                color="#4ECDC4"
              />
              <MacroCard
                title="Fat"
                current={dailyData.totalFat}
                goal={dailyData.fatGoal}
                unit="g"
                color="#FFE66D"
              />
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Text style={styles.addButtonText}>+ Add Food</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Food</Text>
            <TouchableOpacity onPress={handleLogMeal}>
              <Text style={styles.modalSaveText}>Log</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food..."
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                handleSearchFood(text);
              }}
            />

            <ScrollView style={styles.searchResults}>
              {searchResults.map(food => (
                <TouchableOpacity
                  key={food.id}
                  style={[
                    styles.foodItem,
                    selectedFood?.id === food.id && styles.selectedFoodItem,
                  ]}
                  onPress={() => handleSelectFood(food)}>
                  <View>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodCalories}>
                      {formatCalories(food.calories)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedFood && (
              <View style={styles.selectedFoodDetails}>
                <Text style={styles.selectedFoodTitle}>
                  {selectedFood.name}
                </Text>
                <Text style={styles.selectedFoodNutrition}>
                  {formatCalories(selectedFood.calories)} • Protein:{' '}
                  {formatNutrient(selectedFood.protein)} • Carbs:{' '}
                  {formatNutrient(selectedFood.carbs)} • Fat:{' '}
                  {formatNutrient(selectedFood.fat)}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mainProgress: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  calorieCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#91C788',
    marginVertical: 8,
  },
  calorieGoal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e1e8ed',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  macroSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroTitle: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroGoal: {
    fontSize: 10,
    color: '#999',
  },
  actionsSection: {
    margin: 16,
  },
  addButton: {
    backgroundColor: '#91C788',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSaveText: {
    color: '#91C788',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    fontSize: 16,
    marginBottom: 16,
  },
  searchResults: {
    flex: 1,
  },
  foodItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  selectedFoodItem: {
    borderColor: '#91C788',
    backgroundColor: '#f0f8f0',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  foodCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedFoodDetails: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91C788',
    marginTop: 16,
  },
  selectedFoodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  selectedFoodNutrition: {
    fontSize: 14,
    color: '#666',
  },
});

export default CaloriesScreen;
