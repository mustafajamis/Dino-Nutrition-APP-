import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import {useApp} from '../../context/AppContext';
import {
  formatCalories,
  formatMacros,
  calculateGoalPercentage,
  getCurrentDate,
  formatDate,
} from '../../utils/nutritionUtils';

const {width} = Dimensions.get('window');

const CaloriesScreen = () => {
  const {state, actions} = useApp();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  const {todayLogs, todayNutrition, loading} = state.nutrition;
  const {goals} = state.user;

  useEffect(() => {
    if (selectedDate !== getCurrentDate()) {
      actions.loadLogsForDate(selectedDate);
    }
  }, [selectedDate]);

  const defaultGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  };

  const currentGoals = goals || defaultGoals;

  const ProgressBar = ({current, goal, label, color = '#91C788'}) => {
    const percentage = calculateGoalPercentage(current, goal);

    return (
      <View style={styles.progressBar}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressText}>
            {Math.round(current)} / {Math.round(goal)}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
      </View>
    );
  };

  const NutritionSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Daily Progress</Text>
      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>

      <View style={styles.progressGrid}>
        <ProgressBar
          current={todayNutrition.calories}
          goal={currentGoals.calories}
          label="Calories"
          color="#91C788"
        />
        <ProgressBar
          current={todayNutrition.protein}
          goal={currentGoals.protein}
          label="Protein (g)"
          color="#3498db"
        />
        <ProgressBar
          current={todayNutrition.carbs}
          goal={currentGoals.carbs}
          label="Carbs (g)"
          color="#f39c12"
        />
        <ProgressBar
          current={todayNutrition.fat}
          goal={currentGoals.fat}
          label="Fat (g)"
          color="#e74c3c"
        />
      </View>

      <View style={styles.additionalNutrition}>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionRowLabel}>Fiber:</Text>
          <Text style={styles.nutritionRowValue}>{formatMacros(todayNutrition.fiber)}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionRowLabel}>Sugar:</Text>
          <Text style={styles.nutritionRowValue}>{formatMacros(todayNutrition.sugar)}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionRowLabel}>Sodium:</Text>
          <Text style={styles.nutritionRowValue}>{formatMacros(todayNutrition.sodium, 'mg')}</Text>
        </View>
      </View>
    </View>
  );

  const FoodLogItem = ({item, index}) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <Text style={styles.logMealTime}>{item.mealTime || 'Meal'}</Text>
        <Text style={styles.logTime}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.logContent}>
        <Text style={styles.logFoodName}>
          {item.nutrition?.name || item.analysisData?.foodItems?.[0]?.name || 'Food Item'}
        </Text>

        <View style={styles.logNutritionGrid}>
          <View style={styles.logNutritionItem}>
            <Text style={styles.logNutritionValue}>
              {formatCalories(item.nutrition?.calories || 0)}
            </Text>
            <Text style={styles.logNutritionLabel}>Cal</Text>
          </View>
          <View style={styles.logNutritionItem}>
            <Text style={styles.logNutritionValue}>
              {formatMacros(item.nutrition?.protein || 0)}
            </Text>
            <Text style={styles.logNutritionLabel}>Protein</Text>
          </View>
          <View style={styles.logNutritionItem}>
            <Text style={styles.logNutritionValue}>
              {formatMacros(item.nutrition?.carbs || 0)}
            </Text>
            <Text style={styles.logNutritionLabel}>Carbs</Text>
          </View>
          <View style={styles.logNutritionItem}>
            <Text style={styles.logNutritionValue}>
              {formatMacros(item.nutrition?.fat || 0)}
            </Text>
            <Text style={styles.logNutritionLabel}>Fat</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this food log entry?',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => actions.deleteFoodLog(item.id),
              },
            ]
          );
        }}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const DateSelector = () => {
    const today = getCurrentDate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    return (
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            selectedDate === yesterdayStr && styles.activeDateButton,
          ]}
          onPress={() => setSelectedDate(yesterdayStr)}>
          <Text
            style={[
              styles.dateButtonText,
              selectedDate === yesterdayStr && styles.activeDateButtonText,
            ]}>
            Yesterday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateButton,
            selectedDate === today && styles.activeDateButton,
          ]}
          onPress={() => setSelectedDate(today)}>
          <Text
            style={[
              styles.dateButtonText,
              selectedDate === today && styles.activeDateButtonText,
            ]}>
            Today
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calories & Nutrition</Text>
        <DateSelector />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NutritionSummary />

        <View style={styles.foodLogsContainer}>
          <Text style={styles.sectionTitle}>Food Log</Text>

          {todayLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No food logged for {selectedDate === getCurrentDate() ? 'today' : 'this date'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Use the scanner to add your first meal!
              </Text>
            </View>
          ) : (
            <FlatList
              data={todayLogs}
              renderItem={FoodLogItem}
              keyExtractor={(item, index) => `${item.id || index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 4,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeDateButton: {
    backgroundColor: '#91C788',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeDateButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  progressGrid: {
    marginBottom: 20,
  },
  progressBar: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  additionalNutrition: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  nutritionRowLabel: {
    fontSize: 16,
    color: '#666',
  },
  nutritionRowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  foodLogsContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  logItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logMealTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#91C788',
    textTransform: 'capitalize',
  },
  logTime: {
    fontSize: 14,
    color: '#666',
  },
  logContent: {
    marginBottom: 8,
  },
  logFoodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 12,
  },
  logNutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logNutritionItem: {
    alignItems: 'center',
  },
  logNutritionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  logNutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 12,
  },
});

export default CaloriesScreen;
