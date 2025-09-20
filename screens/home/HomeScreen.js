import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {testDatabaseFunctionality} from '../../utils/testUtils';

const HomeScreen = () => {
  const {user, todayActivity, setDailyGoal} = useAuth();
  const navigation = useNavigation();
  const [isSilent, setIsSilent] = useState(false);
  const [darkModeEnabled] = useState(true); // Dark mode default

  const handleSetGoal = () => {
    Alert.prompt(
      'Set Daily Calorie Goal',
      'Enter your daily calorie target:',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Set Goal',
          onPress: async (input) => {
            const goal = parseInt(input, 10);
            if (goal && goal > 0) {
              const result = await setDailyGoal(goal);
              if (result.success) {
                Alert.alert('Success', `Daily goal set to ${goal} calories!`);
              } else {
                Alert.alert('Error', result.error);
              }
            } else {
              Alert.alert('Error', 'Please enter a valid calorie goal');
            }
          },
        },
      ],
      'plain-text',
      user?.dailyCalorieGoal?.toString() || '2000'
    );
  };

  const runDatabaseTest = async () => {
    Alert.alert(
      'Database Test',
      'This will run a test of the database functionality. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Run Test',
          onPress: async () => {
            const result = await testDatabaseFunctionality();
            Alert.alert(
              'Test Result',
              result ? 'All tests passed! ✅' : 'Some tests failed! ❌',
              [{text: 'OK'}]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <ScrollView>
        {/* Header Section */}
        <View style={[styles.header, darkModeEnabled && styles.darkHeader]}>
          <Text style={[styles.greeting, darkModeEnabled && styles.darkText]}>Hi, {user?.name || user?.username || 'User'}</Text>

          <TouchableOpacity onPress={() => setIsSilent(!isSilent)}>
            <Text style={styles.bell}>{isSilent ? '🔕' : '🔔'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={[styles.summaryCard, darkModeEnabled && styles.darkSummaryCard]}>
          <Text style={[styles.cardTitle, darkModeEnabled && styles.darkCardTitle]}>Today's Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, darkModeEnabled && styles.darkStatNumber]}>{todayActivity?.totalCaloriesConsumed || 0}</Text>
              <Text style={[styles.statLabel, darkModeEnabled && styles.darkStatLabel]}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, darkModeEnabled && styles.darkStatNumber]}>{todayActivity?.meals?.length || 0}</Text>
              <Text style={[styles.statLabel, darkModeEnabled && styles.darkStatLabel]}>Meals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, darkModeEnabled && styles.darkStatNumber]}>{user?.dailyCalorieGoal || 2000}</Text>
              <Text style={[styles.statLabel, darkModeEnabled && styles.darkStatLabel]}>Goal</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, darkModeEnabled && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, darkModeEnabled && styles.darkActionCard]} onPress={() => navigation.navigate('Calories')}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={[styles.actionText, darkModeEnabled && styles.darkText]}>Log Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, darkModeEnabled && styles.darkActionCard]} onPress={() => navigation.navigate('Scan')}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={[styles.actionText, darkModeEnabled && styles.darkText]}>Scan Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, darkModeEnabled && styles.darkActionCard]} onPress={handleSetGoal}>
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={[styles.actionText, darkModeEnabled && styles.darkText]}>Set Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCard, darkModeEnabled && styles.darkActionCard]} onPress={runDatabaseTest}>
              <Text style={styles.actionIcon}>🧪</Text>
              <Text style={[styles.actionText, darkModeEnabled && styles.darkText]}>Test DB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Goals Progress */}
        <View style={[styles.goalsCard, darkModeEnabled && styles.darkGoalsCard]}>
          <View style={styles.goalHeader}>
            <Text style={[styles.cardTitle, darkModeEnabled && styles.darkCardTitle]}>Daily Goals</Text>
            <TouchableOpacity onPress={handleSetGoal} style={[styles.editGoalButton, darkModeEnabled && styles.darkEditGoalButton]}>
              <Text style={[styles.editGoalText, darkModeEnabled && styles.darkEditGoalText]}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.goalItem}>
            <Text style={[styles.goalLabel, darkModeEnabled && styles.darkText]}>Calorie Goal</Text>
            <View style={[styles.progressBar, darkModeEnabled && styles.darkProgressBar]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(((todayActivity?.totalCaloriesConsumed || 0) / (user?.dailyCalorieGoal || 2000)) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.goalValue, darkModeEnabled && styles.darkText]}>
              {todayActivity?.totalCaloriesConsumed || 0} / {user?.dailyCalorieGoal || 2000}
            </Text>
          </View>
          <View style={styles.goalStats}>
            <View style={styles.goalStat}>
              <Text style={[styles.goalStatNumber, darkModeEnabled && styles.darkText]}>
                {Math.max(0, (user?.dailyCalorieGoal || 2000) - (todayActivity?.totalCaloriesConsumed || 0))}
              </Text>
              <Text style={[styles.goalStatLabel, darkModeEnabled && styles.darkSubText]}>Remaining</Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={[styles.goalStatNumber, darkModeEnabled && styles.darkText]}>
                {Math.round(((todayActivity?.totalCaloriesConsumed || 0) / (user?.dailyCalorieGoal || 2000)) * 100)}%
              </Text>
              <Text style={[styles.goalStatLabel, darkModeEnabled && styles.darkSubText]}>Complete</Text>
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
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubText: {
    color: '#cccccc',
  },
  bell: {
    fontSize: 20,
  },
  summaryCard: {
    backgroundColor: '#91C788',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  darkSummaryCard: {
    backgroundColor: '#404040',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  darkCardTitle: {
    color: '#ffffff',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkStatNumber: {
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  darkStatLabel: {
    color: '#cccccc',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '22%',
  },
  darkActionCard: {
    backgroundColor: '#404040',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  goalsCard: {
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  darkGoalsCard: {
    backgroundColor: '#404040',
  },
  goalItem: {
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editGoalButton: {
    backgroundColor: '#91C788',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  darkEditGoalButton: {
    backgroundColor: '#91C788',
  },
  editGoalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  darkEditGoalText: {
    color: '#ffffff',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  goalStat: {
    alignItems: 'center',
  },
  goalStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#91C788',
  },
  goalStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  darkProgressBar: {
    backgroundColor: '#555555',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#91C788',
    borderRadius: 4,
  },
  goalValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default HomeScreen;
