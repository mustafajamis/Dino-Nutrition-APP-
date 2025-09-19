import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CaloriesScreen = () => {
  const [dailyGoal] = useState(2000);
  const [consumed] = useState(1420);
  const [burned] = useState(300);

  const remaining = dailyGoal - consumed + burned;
  const progressPercentage = Math.min((consumed / dailyGoal) * 100, 100);

  const meals = [
    {
      id: 1,
      name: 'Breakfast',
      calories: 450,
      foods: ['Oatmeal with berries', 'Greek yogurt'],
      time: '8:30 AM',
    },
    {
      id: 2,
      name: 'Lunch',
      calories: 620,
      foods: ['Grilled chicken salad', 'Apple'],
      time: '12:45 PM',
    },
    {
      id: 3,
      name: 'Dinner',
      calories: 350,
      foods: ['Salmon', 'Steamed vegetables'],
      time: '7:15 PM',
    },
  ];

  const quickAddFoods = [
    {name: 'Banana', calories: 95, icon: '🍌'},
    {name: 'Apple', calories: 80, icon: '🍎'},
    {name: 'Almonds', calories: 160, icon: '🥜'},
    {name: 'Water', calories: 0, icon: '💧'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Nutrition</Text>
          <Text style={styles.headerDate}>Today</Text>
        </View>

        {/* Calorie Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.calorieCircle}>
            <View style={[styles.progressRing, {transform: [{rotate: `${progressPercentage * 3.6}deg`}]}]}>
              <View style={styles.progressBar} />
            </View>
            <View style={styles.calorieContent}>
              <Text style={styles.remainingCalories}>{remaining}</Text>
              <Text style={styles.remainingLabel}>Remaining</Text>
            </View>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{dailyGoal}</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{consumed}</Text>
              <Text style={styles.statLabel}>Food</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{burned}</Text>
              <Text style={styles.statLabel}>Exercise</Text>
            </View>
          </View>
        </View>

        {/* Quick Add Section */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAddFoods.map((food, index) => (
              <TouchableOpacity key={index} style={styles.quickAddItem}>
                <Text style={styles.quickAddIcon}>{food.icon}</Text>
                <Text style={styles.quickAddName}>{food.name}</Text>
                <Text style={styles.quickAddCalories}>{food.calories} cal</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Add Meal</Text>
            </TouchableOpacity>
          </View>

          {meals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                </View>
              </View>
              <View style={styles.mealFoods}>
                {meal.foods.map((food, index) => (
                  <Text key={index} style={styles.foodItem}>
                    • {food}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Nutrition Summary */}
        <View style={styles.nutritionSection}>
          <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>180g</Text>
              <View style={styles.nutritionBar}>
                <View style={[styles.nutritionProgress, styles.carbsProgress]} />
              </View>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>95g</Text>
              <View style={styles.nutritionBar}>
                <View style={[styles.nutritionProgress, styles.proteinProgress]} />
              </View>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>62g</Text>
              <View style={styles.nutritionBar}>
                <View style={[styles.nutritionProgress, styles.fatProgress]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDate: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: '#91C788',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
  },
  calorieCircle: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    width: '100%',
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  calorieContent: {
    alignItems: 'center',
  },
  remainingCalories: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
  },
  remainingLabel: {
    fontSize: width * 0.035,
    color: '#fff',
    opacity: 0.9,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  quickAddSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickAddGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: width * 0.2,
  },
  quickAddIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickAddName: {
    fontSize: width * 0.03,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  quickAddCalories: {
    fontSize: width * 0.025,
    color: '#666',
  },
  mealsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    color: '#91C788',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  mealInfo: {
    alignItems: 'flex-end',
  },
  mealTime: {
    fontSize: width * 0.03,
    color: '#666',
  },
  mealCalories: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#91C788',
  },
  mealFoods: {
    marginLeft: 10,
  },
  foodItem: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: 2,
  },
  nutritionSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  nutritionGrid: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
  },
  nutritionItem: {
    marginBottom: 15,
  },
  nutritionLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: 8,
  },
  nutritionBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  nutritionProgress: {
    height: '100%',
    borderRadius: 3,
  },
  carbsProgress: {
    width: '65%',
    backgroundColor: '#FF6B6B',
  },
  proteinProgress: {
    width: '80%',
    backgroundColor: '#4ECDC4',
  },
  fatProgress: {
    width: '70%',
    backgroundColor: '#45B7D1',
  },
});

export default CaloriesScreen;
