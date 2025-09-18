import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import {useApp} from '../../context/AppContext';
import {getCurrentDate, formatDate} from '../../utils/nutritionUtils';

const {width} = Dimensions.get('window');

const ActivityScreen = () => {
  const {state} = useApp();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState('');
  const [activities, setActivities] = useState([]);

  // Common activities with calorie burn rates per minute
  const activityTypes = [
    {id: 'walking', name: 'Walking', caloriesPerMinute: 3.5, icon: '🚶'},
    {id: 'running', name: 'Running', caloriesPerMinute: 10, icon: '🏃'},
    {id: 'cycling', name: 'Cycling', caloriesPerMinute: 8, icon: '🚴'},
    {id: 'swimming', name: 'Swimming', caloriesPerMinute: 12, icon: '🏊'},
    {id: 'weightlifting', name: 'Weight Lifting', caloriesPerMinute: 6, icon: '🏋️'},
    {id: 'yoga', name: 'Yoga', caloriesPerMinute: 3, icon: '🧘'},
    {id: 'dancing', name: 'Dancing', caloriesPerMinute: 5, icon: '💃'},
    {id: 'basketball', name: 'Basketball', caloriesPerMinute: 8, icon: '⛹️'},
    {id: 'tennis', name: 'Tennis', caloriesPerMinute: 7, icon: '🎾'},
    {id: 'hiking', name: 'Hiking', caloriesPerMinute: 6, icon: '🥾'},
  ];

  const calculateCaloriesBurned = (activity, durationMinutes) => {
    if (!activity || !durationMinutes) {return 0;}
    return Math.round(activity.caloriesPerMinute * durationMinutes);
  };

  const addActivity = () => {
    if (!selectedActivity || !duration || duration === '0') {
      Alert.alert('Error', 'Please select an activity and enter duration');
      return;
    }

    const durationNum = parseInt(duration);
    const caloriesBurned = calculateCaloriesBurned(selectedActivity, durationNum);

    const newActivity = {
      id: Date.now(),
      ...selectedActivity,
      duration: durationNum,
      caloriesBurned,
      date: getCurrentDate(),
      timestamp: new Date().toISOString(),
    };

    setActivities([...activities, newActivity]);
    setSelectedActivity(null);
    setDuration('');

    Alert.alert(
      'Activity Added!',
      `You burned ${caloriesBurned} calories with ${selectedActivity.name}`
    );
  };

  const deleteActivity = (activityId) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setActivities(activities.filter(a => a.id !== activityId));
          },
        },
      ]
    );
  };

  const getTotalCaloriesBurned = () => {
    return activities.reduce((total, activity) => total + activity.caloriesBurned, 0);
  };

  const ActivityTypeCard = ({activity}) => (
    <TouchableOpacity
      style={[
        styles.activityCard,
        selectedActivity?.id === activity.id && styles.selectedActivityCard,
      ]}
      onPress={() => setSelectedActivity(activity)}>
      <Text style={styles.activityIcon}>{activity.icon}</Text>
      <Text style={styles.activityName}>{activity.name}</Text>
      <Text style={styles.activityRate}>
        {activity.caloriesPerMinute} cal/min
      </Text>
    </TouchableOpacity>
  );

  const ActivityLogItem = ({item}) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={styles.logTitleContainer}>
          <Text style={styles.logIcon}>{item.icon}</Text>
          <View>
            <Text style={styles.logName}>{item.name}</Text>
            <Text style={styles.logTime}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteActivity(item.id)}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.duration}</Text>
          <Text style={styles.statLabel}>minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.caloriesBurned}</Text>
          <Text style={styles.statLabel}>calories</Text>
        </View>
      </View>
    </View>
  );

  const SummaryCard = () => {
    const totalCalories = getTotalCaloriesBurned();
    const totalDuration = activities.reduce((total, activity) => total + activity.duration, 0);
    const activitiesCount = activities.length;

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Activity</Text>
        <Text style={styles.summaryDate}>{formatDate(getCurrentDate())}</Text>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{totalCalories}</Text>
            <Text style={styles.summaryStatLabel}>Calories Burned</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{totalDuration}</Text>
            <Text style={styles.summaryStatLabel}>Minutes Active</Text>
          </View>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatValue}>{activitiesCount}</Text>
            <Text style={styles.summaryStatLabel}>Activities</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Tracker</Text>
        <Text style={styles.subtitle}>Track your exercises and calorie burn</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SummaryCard />

        <View style={styles.addActivitySection}>
          <Text style={styles.sectionTitle}>Add Activity</Text>

          <Text style={styles.label}>Select Activity:</Text>
          <FlatList
            data={activityTypes}
            renderItem={({item}) => <ActivityTypeCard activity={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.activityRow}
            ItemSeparatorComponent={() => <View style={styles.activitySeparator} />}
          />

          {selectedActivity && (
            <View style={styles.durationSection}>
              <Text style={styles.label}>Duration (minutes):</Text>
              <TextInput
                style={styles.durationInput}
                value={duration}
                onChangeText={setDuration}
                placeholder="Enter duration"
                keyboardType="numeric"
                maxLength={3}
              />

              {duration && (
                <Text style={styles.caloriePreview}>
                  Estimated calories burned: {calculateCaloriesBurned(selectedActivity, parseInt(duration) || 0)}
                </Text>
              )}

              <TouchableOpacity style={styles.addButton} onPress={addActivity}>
                <Text style={styles.addButtonText}>Add Activity</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.activityLogSection}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>

          {activities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No activities logged today</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first activity above!
              </Text>
            </View>
          ) : (
            <FlatList
              data={activities}
              renderItem={({item}) => <ActivityLogItem item={item} />}
              keyExtractor={item => item.id.toString()}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#91C788',
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  addActivitySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 12,
  },
  activityRow: {
    justifyContent: 'space-between',
  },
  activityCard: {
    flex: 0.48,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedActivityCard: {
    borderColor: '#91C788',
    backgroundColor: '#e8f5e6',
  },
  activityIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityRate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activitySeparator: {
    height: 12,
  },
  durationSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  caloriePreview: {
    fontSize: 14,
    color: '#91C788',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#91C788',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityLogSection: {
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
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  logName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  logTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
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
  logStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#91C788',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 12,
  },
});

export default ActivityScreen;
