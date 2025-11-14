import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../style/Theme';

const {width} = Dimensions.get('window');

const CaloriesScreen = () => {
  const {user, todayActivity, addMeal} = useAuth();
  const {styles} = useTheme();
  const navigation = useNavigation();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [consumed, setConsumed] = useState(0);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (user) {
      setDailyGoal(user.dailyCalorieGoal || 2000);
    }
  }, [user]);

  useEffect(() => {
    if (todayActivity) {
      setConsumed(todayActivity.totalCaloriesConsumed || 0);
      setMeals(todayActivity.meals || []);
    }
  }, [todayActivity]);

  const remaining = Math.max(0, dailyGoal - consumed);

  // Add macro estimates for quick adds
  const quickAddFoods = [
    {name: 'Banana', calories: 95, icon: '🍌', carbs: 24, protein: 1, fat: 0.3},
    {
      name: 'Apple',
      calories: 80,
      icon: '🍎',
      carbs: 21,
      protein: 0.3,
      fat: 0.2,
    },
    {name: 'Almonds', calories: 160, icon: '🥜', carbs: 6, protein: 6, fat: 14},
    {name: 'Water', calories: 0, icon: '💧', carbs: 0, protein: 0, fat: 0},
  ];

  const handleQuickAdd = async food => {
    if (!user) {
      Alert.alert('Error', 'Please log in to add food');
      return;
    }

    const result = await addMeal({
      name: `Quick Add - ${food.name}`,
      calories: food.calories,
      foods: [food.name],
      carbs: food.carbs,
      protein: food.protein,
      fat: food.fat,
    });

    if (result.success) {
      Alert.alert('Success', `${food.name} added to your diary!`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleAddMeal = () => {
    navigation.navigate('Scan', {source: 'calories_add_meal_button'});
  };

  // Dynamic nutrition breakdown component
  const NutritionBreakdown = ({goal, activity}) => {
    const totalCarbs = activity?.totalCarbs || 0;
    const totalProtein = activity?.totalProtein || 0;
    const totalFat = activity?.totalFat || 0;

    // Macro goals: simple default split (50% carbs, 20% protein, 30% fat)
    const carbGoal = Math.round((goal * 0.5) / 4);
    const proteinGoal = Math.round((goal * 0.2) / 4);
    const fatGoal = Math.round((goal * 0.3) / 9);

    const pct = (value, goal) =>
      Math.min(100, goal > 0 ? (value / goal) * 100 : 0);

    const macroItems = [
      {label: 'Carbs', value: totalCarbs, goal: carbGoal, color: '#FF6B6B'},
      {
        label: 'Protein',
        value: totalProtein,
        goal: proteinGoal,
        color: '#4ECDC4',
      },
      {label: 'Fat', value: totalFat, goal: fatGoal, color: '#45B7D1'},
    ];

    return (
      <View style={[styles.card, styles.marginBottom]}>
        <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
        {macroItems.map(item => (
          <View key={item.label} style={styles.marginBottom}>
            <View style={[styles.row, styles.spaceBetween]}>
              <Text style={styles.bodyText}>{item.label}</Text>
              <Text style={styles.bodyTextSecondary}>
                {item.value}g / {item.goal}g
              </Text>
            </View>
            <View style={[styles.progressBar, styles.progressBarMargin]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pct(item.value, item.goal)}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Daily Nutrition</Text>
            <Text style={styles.headerSubtitle}>Today</Text>
          </View>
        </View>

        {/* Calorie Summary Card */}
        <View style={styles.cardPrimary}>
          <View style={styles.alignCenter}>
            <Text
              style={[
                styles.title,
                styles.textWhite,
                {fontSize: width * 0.1, paddingTop: 10},
              ]}>
              {remaining}
            </Text>
            <Text style={[styles.bodyText, styles.textWhite]}>
              Calories Remaining
            </Text>
          </View>

          <View style={[styles.row, styles.spaceAround, {marginTop: 24}]}>
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {dailyGoal}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Goal</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {consumed}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Consumed</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {remaining > 0 ? remaining : 0}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Quick Add Section */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.actionGrid}>
            {quickAddFoods.map((food, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => handleQuickAdd(food)}>
                <Text style={styles.actionIcon}>{food.icon}</Text>
                <Text style={[styles.actionText, {fontSize: width * 0.03}]}>
                  {food.name}
                </Text>
                <Text style={[styles.caption, {color: colors.primary}]}>
                  {food.calories} cal
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.paddingHorizontal}>
          <View style={[styles.row, styles.spaceBetween, styles.marginBottom]}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={handleAddMeal}>
              <Text style={styles.textPrimary}>+ Add Meal</Text>
            </TouchableOpacity>
          </View>

          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No meals logged yet today
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Add Meal" to get started!
              </Text>
            </View>
          ) : (
            meals.map(meal => (
              <View key={meal.id} style={styles.listItem}>
                <View style={styles.flexContainer}>
                  <View style={[styles.row, styles.spaceBetween]}>
                    <Text style={styles.listItemText}>{meal.name}</Text>
                    <View style={styles.alignCenter}>
                      <Text style={styles.caption}>{meal.time}</Text>
                      <Text style={[styles.bodyText, styles.textPrimary]}>
                        {meal.calories} cal
                      </Text>
                    </View>
                  </View>
                  <View style={styles.marginTop8}>
                    {meal.foods.map((food, index) => (
                      <Text key={index} style={styles.listItemSecondary}>
                        • {food}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Nutrition Summary */}
        <NutritionBreakdown goal={dailyGoal} activity={todayActivity} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CaloriesScreen;
