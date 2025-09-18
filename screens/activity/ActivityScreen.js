import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import {formatCalories, formatDate} from '../../utils/formatCalories';

const {width} = Dimensions.get('window');

// Mock activity database
const ACTIVITY_DATABASE = [
  {id: 1, name: 'Walking', caloriesPerMinute: 4},
  {id: 2, name: 'Running', caloriesPerMinute: 12},
  {id: 3, name: 'Cycling', caloriesPerMinute: 8},
  {id: 4, name: 'Swimming', caloriesPerMinute: 10},
  {id: 5, name: 'Weight Training', caloriesPerMinute: 6},
  {id: 6, name: 'Yoga', caloriesPerMinute: 3},
  {id: 7, name: 'Dancing', caloriesPerMinute: 5},
  {id: 8, name: 'Basketball', caloriesPerMinute: 9},
  {id: 9, name: 'Tennis', caloriesPerMinute: 7},
  {id: 10, name: 'Soccer', caloriesPerMinute: 9},
];

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await loadActivities();
    };
    loadData();
  }, [selectedDate]);

  const loadActivities = async () => {
    // Mock loading activities for selected date
    const mockActivities = [
      {
        id: 1,
        name: 'Morning Walk',
        activity: 'Walking',
        duration: 30,
        caloriesBurned: 120,
        time: '08:00 AM',
        date: selectedDate.toISOString().split('T')[0],
      },
      {
        id: 2,
        name: 'Gym Session',
        activity: 'Weight Training',
        duration: 45,
        caloriesBurned: 270,
        time: '06:00 PM',
        date: selectedDate.toISOString().split('T')[0],
      },
    ];

    setActivities(mockActivities);
    setTotalCaloriesBurned(
      mockActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0),
    );
  };

  const getFilteredActivities = () => {
    return ACTIVITY_DATABASE.filter(activity =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const handleSelectActivity = activity => {
    setSelectedActivity(activity);
    setSearchQuery(activity.name);
  };

  const handleLogActivity = () => {
    if (!selectedActivity || !duration || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please select an activity and enter valid duration');
      return;
    }

    const durationNum = parseInt(duration);
    const caloriesBurned = Math.round(
      selectedActivity.caloriesPerMinute * durationNum,
    );

    const newActivity = {
      id: Date.now(),
      name: selectedActivity.name,
      activity: selectedActivity.name,
      duration: durationNum,
      caloriesBurned,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: selectedDate.toISOString().split('T')[0],
    };

    setActivities([...activities, newActivity]);
    setTotalCaloriesBurned(totalCaloriesBurned + caloriesBurned);

    // Reset form
    setShowAddModal(false);
    setSelectedActivity(null);
    setDuration('');
    setSearchQuery('');

    Alert.alert('Success', 'Activity logged successfully!');
  };

  const handleDeleteActivity = activityId => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const activityToDelete = activities.find(a => a.id === activityId);
            const newActivities = activities.filter(a => a.id !== activityId);
            setActivities(newActivities);
            setTotalCaloriesBurned(
              totalCaloriesBurned - activityToDelete.caloriesBurned,
            );
          },
        },
      ],
    );
  };

  const ActivityCard = ({activity}) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>{activity.name}</Text>
          <Text style={styles.activityDetails}>
            {activity.duration} minutes • {activity.time}
          </Text>
        </View>
        <View style={styles.activityCalories}>
          <Text style={styles.caloriesText}>
            {formatCalories(activity.caloriesBurned)}
          </Text>
          <Text style={styles.burnedText}>burned</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteActivity(activity.id)}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const SummaryCard = ({title, value, subtitle, color}) => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryValue, {color}]}>{value}</Text>
      <Text style={styles.summarySubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity Tracker</Text>
          <Text style={styles.headerDate}>{formatDate(selectedDate)}</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <SummaryCard
              title="Calories Burned"
              value={formatCalories(totalCaloriesBurned)}
              subtitle="Today"
              color="#FF6B6B"
            />
            <SummaryCard
              title="Activities"
              value={activities.length}
              subtitle="Logged"
              color="#4ECDC4"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Text style={styles.addButtonText}>+ Log Activity</Text>
          </TouchableOpacity>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>
          {activities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No activities logged today
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Log Activity" to get started!
              </Text>
            </View>
          ) : (
            activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Log Activity</Text>
            <TouchableOpacity onPress={handleLogActivity}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Activity Search */}
            <Text style={styles.inputLabel}>Activity</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for an activity..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* Activity Results */}
            {searchQuery.length > 0 && (
              <ScrollView style={styles.searchResults}>
                {getFilteredActivities().map(activity => (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.activityOption,
                      selectedActivity?.id === activity.id &&
                        styles.selectedActivityOption,
                    ]}
                    onPress={() => handleSelectActivity(activity)}>
                    <Text style={styles.activityOptionName}>
                      {activity.name}
                    </Text>
                    <Text style={styles.activityOptionCalories}>
                      ~{activity.caloriesPerMinute} cal/min
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Duration Input */}
            <Text style={styles.inputLabel}>Duration (minutes)</Text>
            <TextInput
              style={styles.durationInput}
              placeholder="Enter duration in minutes"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />

            {/* Calories Preview */}
            {selectedActivity && duration && parseInt(duration) > 0 && (
              <View style={styles.caloriesPreview}>
                <Text style={styles.previewText}>
                  Estimated calories burned:{' '}
                  <Text style={styles.previewCalories}>
                    {formatCalories(
                      selectedActivity.caloriesPerMinute * parseInt(duration),
                    )}
                  </Text>
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
  summarySection: {
    margin: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
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
  activitiesSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
  },
  activityCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  burnedText: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
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
    maxHeight: 200,
    marginBottom: 16,
  },
  activityOption: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  selectedActivityOption: {
    borderColor: '#91C788',
    backgroundColor: '#f0f8f0',
  },
  activityOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityOptionCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  durationInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    fontSize: 16,
    marginBottom: 16,
  },
  caloriesPreview: {
    backgroundColor: '#f0f8f0',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91C788',
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  previewCalories: {
    fontWeight: 'bold',
    color: '#91C788',
  },
});

export default ActivityScreen;
