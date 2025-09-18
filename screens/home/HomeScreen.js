import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {getDailyNutrition} from '../../services/foodRecognitionAPI';
import {formatCalories, formatDate, calculateProgress, getProgressColor} from '../../utils/formatCalories';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const [isSilent, setIsSilent] = useState(false);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const result = await getDailyNutrition();
      if (result.success) {
        setDailyData(result.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickStatCard = ({title, value, color, subtitle}) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const ProgressRing = ({percentage, size = 80, strokeWidth = 8, color = '#91C788'}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.progressRing, {width: size, height: size}]}>
        <View style={styles.progressRingBackground}>
          <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  };

  const CalorieProgress = () => {
    if (!dailyData) return null;
    
    const percentage = calculateProgress(dailyData.totalCalories, dailyData.calorieGoal);
    const remaining = Math.max(0, dailyData.calorieGoal - dailyData.totalCalories);
    
    return (
      <View style={styles.calorieProgressCard}>
        <Text style={styles.calorieTitle}>Today's Calories</Text>
        <View style={styles.calorieContent}>
          <View style={styles.calorieLeft}>
            <Text style={styles.calorieMain}>{formatCalories(dailyData.totalCalories)}</Text>
            <Text style={styles.calorieGoal}>of {formatCalories(dailyData.calorieGoal)}</Text>
            <Text style={styles.calorieRemaining}>
              {remaining > 0 ? `${formatCalories(remaining)} remaining` : 'Goal reached!'}
            </Text>
          </View>
          <ProgressRing 
            percentage={Math.min(percentage, 100)} 
            color={getProgressColor(percentage)}
          />
        </View>
      </View>
    );
  };

  const RecentActivity = () => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>Recent Activity</Text>
      <View style={styles.activityItem}>
        <Text style={styles.activityIcon}>🍎</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>Apple logged</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <Text style={styles.activityCalories}>95 cal</Text>
      </View>
      <View style={styles.activityItem}>
        <Text style={styles.activityIcon}>🏃‍♂️</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>Morning run</Text>
          <Text style={styles.activityTime}>4 hours ago</Text>
        </View>
        <Text style={styles.activityCalories}>-250 cal</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/icons/Mustafa.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hi, Mus! 👋</Text>
              <Text style={styles.date}>{formatDate(new Date())}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setIsSilent(!isSilent)}>
            <Text style={styles.bell}>{isSilent ? '🔕' : '🔔'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Scan Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🏃‍♂️</Text>
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
        </View>

        {/* Calorie Progress */}
        <CalorieProgress />

        {/* Daily Stats */}
        {dailyData && (
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <QuickStatCard
                title="Protein"
                value={`${dailyData.totalProtein}g`}
                color="#FF6B6B"
                subtitle={`${dailyData.proteinGoal}g goal`}
              />
              <QuickStatCard
                title="Carbs"
                value={`${dailyData.totalCarbs}g`}
                color="#4ECDC4"
                subtitle={`${dailyData.carbsGoal}g goal`}
              />
              <QuickStatCard
                title="Fat"
                value={`${dailyData.totalFat}g`}
                color="#FFE66D"
                subtitle={`${dailyData.fatGoal}g goal`}
              />
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <RecentActivity />

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Today's Tip</Text>
          <Text style={styles.tipsText}>
            Drink plenty of water throughout the day to support your metabolism and stay hydrated!
          </Text>
        </View>
      </ScrollView>
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
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bell: {
    fontSize: 24,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  calorieProgressCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  calorieContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieLeft: {
    flex: 1,
  },
  calorieMain: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#91C788',
  },
  calorieGoal: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  calorieRemaining: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#e1e8ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statsSection: {
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
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
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#91C788',
  },
  tipsCard: {
    backgroundColor: '#91C788',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});

export default HomeScreen;
