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

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [weeklyGoal] = useState(150); // minutes
  const [completedMinutes] = useState(108);

  const todayActivities = [
    {
      id: 1,
      type: 'Running',
      duration: 30,
      calories: 285,
      time: '7:00 AM',
      icon: '🏃‍♂️',
    },
    {
      id: 2,
      type: 'Yoga',
      duration: 45,
      calories: 120,
      time: '6:30 PM',
      icon: '🧘‍♀️',
    },
    {
      id: 3,
      type: 'Walking',
      duration: 25,
      calories: 95,
      time: '8:15 PM',
      icon: '🚶‍♂️',
    },
  ];

  const weeklyStats = [
    {day: 'Mon', minutes: 45, goal: 30},
    {day: 'Tue', minutes: 60, goal: 30},
    {day: 'Wed', minutes: 20, goal: 30},
    {day: 'Thu', minutes: 35, goal: 30},
    {day: 'Fri', minutes: 50, goal: 30},
    {day: 'Sat', minutes: 40, goal: 30},
    {day: 'Sun', minutes: 15, goal: 30},
  ];

  const quickWorkouts = [
    {name: '5-min Stretch', duration: 5, icon: '🤸‍♀️'},
    {name: 'Quick Walk', duration: 15, icon: '🚶‍♂️'},
    {name: 'HIIT Workout', duration: 20, icon: '💪'},
    {name: 'Meditation', duration: 10, icon: '🧘‍♀️'},
  ];

  const progressPercentage = (completedMinutes / weeklyGoal) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity Tracker</Text>
          <Text style={styles.headerDate}>Week of Dec 11-17</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['Today', 'Week', 'Stats'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Goal Progress */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Weekly Goal</Text>
            <Text style={styles.goalSubtitle}>Active Minutes</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <View style={[styles.progressFill, {height: `${Math.min(progressPercentage, 100)}%`}]}>
                <View style={styles.progressBar} />
              </View>
              <View style={styles.progressContent}>
                <Text style={styles.progressNumber}>{completedMinutes}</Text>
                <Text style={styles.progressLabel}>of {weeklyGoal}</Text>
              </View>
            </View>

            <View style={styles.goalStats}>
              <View style={styles.goalStat}>
                <Text style={styles.goalStatNumber}>7</Text>
                <Text style={styles.goalStatLabel}>Days Active</Text>
              </View>
              <View style={styles.goalStat}>
                <Text style={styles.goalStatNumber}>500</Text>
                <Text style={styles.goalStatLabel}>Calories Burned</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Start Workouts */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.quickGrid}>
            {quickWorkouts.map((workout, index) => (
              <TouchableOpacity key={index} style={styles.quickItem}>
                <Text style={styles.quickIcon}>{workout.icon}</Text>
                <Text style={styles.quickName}>{workout.name}</Text>
                <Text style={styles.quickDuration}>{workout.duration} min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Activities */}
        {activeTab === 'Today' && (
          <View style={styles.activitiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Activities</Text>
              <TouchableOpacity>
                <Text style={styles.addButton}>+ Add Activity</Text>
              </TouchableOpacity>
            </View>

            {todayActivities.map(activity => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>{activity.icon}</Text>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityType}>{activity.type}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View style={styles.activityStats}>
                  <Text style={styles.activityDuration}>{activity.duration} min</Text>
                  <Text style={styles.activityCalories}>{activity.calories} cal</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Weekly Chart */}
        {activeTab === 'Week' && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Weekly Overview</Text>
            <View style={styles.chart}>
              {weeklyStats.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max((day.minutes / 60) * 100, 10),
                          backgroundColor: day.minutes >= day.goal ? '#91C788' : '#E0E0E0',
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.goalLine,
                        {bottom: (day.goal / 60) * 100},
                      ]}
                    />
                  </View>
                  <Text style={styles.chartDay}>{day.day}</Text>
                  <Text style={styles.chartMinutes}>{day.minutes}m</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats Tab */}
        {activeTab === 'Stats' && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Days Active</Text>
                <Text style={styles.statSubtext}>This Month</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>2.1k</Text>
                <Text style={styles.statLabel}>Calories Burned</Text>
                <Text style={styles.statSubtext}>This Week</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Avg Duration</Text>
                <Text style={styles.statSubtext}>Minutes</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
                <Text style={styles.statSubtext}>Days</Text>
              </View>
            </View>

            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsTitle}>Recent Achievements</Text>
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🏆</Text>
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementName}>Week Warrior</Text>
                  <Text style={styles.achievementDesc}>Completed 7 days in a row</Text>
                </View>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementName}>Calorie Crusher</Text>
                  <Text style={styles.achievementDesc}>Burned 500+ calories in one day</Text>
                </View>
              </View>
            </View>
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#91C788',
  },
  tabText: {
    fontSize: width * 0.04,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  goalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
  },
  goalSubtitle: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#91C788',
    borderRadius: 50,
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#91C788',
  },
  progressContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  progressNumber: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  goalStats: {
    flex: 1,
    marginLeft: 20,
  },
  goalStat: {
    marginBottom: 15,
  },
  goalStatNumber: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#91C788',
  },
  goalStatLabel: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 2,
  },
  quickSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: width * 0.2,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickName: {
    fontSize: width * 0.03,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickDuration: {
    fontSize: width * 0.025,
    color: '#666',
  },
  activitiesSection: {
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
  activityCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 2,
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  activityDuration: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#91C788',
  },
  activityCalories: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 2,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    width: 20,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: '#91C788',
    borderRadius: 2,
    minHeight: 4,
  },
  goalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#FF6B6B',
    opacity: 0.7,
  },
  chartDay: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 8,
  },
  chartMinutes: {
    fontSize: width * 0.025,
    color: '#91C788',
    fontWeight: '600',
    marginTop: 2,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    width: width * 0.42,
    marginBottom: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#91C788',
  },
  statLabel: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  statSubtext: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 2,
  },
  achievementsSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
  },
  achievementsTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementName: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  achievementDesc: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 2,
  },
});

export default ActivityScreen;
