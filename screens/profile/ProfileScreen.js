import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import {useApp} from '../../context/AppContext';
import {
  calculateBMR,
  calculateTDEE,
  getRecommendedGoals,
} from '../../utils/nutritionUtils';

const {width} = Dimensions.get('window');

const ProfileScreen = () => {
  const {state, actions} = useApp();
  const {profile, goals} = state.user;
  const {settings} = state;

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  // Settings state
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    units: 'metric',
    darkMode: false,
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        gender: profile.gender || 'male',
        activityLevel: profile.activityLevel || 'moderate',
        goal: profile.goal || 'maintain',
      });
    }

    setAppSettings({
      notifications: settings.notifications,
      units: settings.units,
      darkMode: settings.darkMode,
    });
  }, [profile, settings]);

  const handleSaveProfile = () => {
    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const profileData = {
      name: formData.name,
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      updatedAt: new Date().toISOString(),
    };

    // Calculate recommended goals
    const bmr = calculateBMR(profileData);
    const tdee = calculateTDEE(bmr, profileData.activityLevel);
    const recommendedGoals = getRecommendedGoals(tdee, profileData.goal);

    actions.setUserProfile(profileData);
    actions.setUserGoals(recommendedGoals);

    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...appSettings, [key]: value };
    setAppSettings(newSettings);
    actions.updateSettings(newSettings);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => actions.logout(),
        },
      ]
    );
  };

  const ProfileForm = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(!editing)}>
          <Text style={styles.editButtonText}>
            {editing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder="Enter your name"
          editable={editing}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={formData.age}
            onChangeText={(text) => setFormData({...formData, age: text})}
            placeholder="Age"
            keyboardType="numeric"
            editable={editing}
          />
        </View>

        <View style={[styles.formGroup, {flex: 1, marginLeft: 8}]}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'male' && styles.activeGenderButton,
                !editing && styles.disabledButton,
              ]}
              onPress={() => editing && setFormData({...formData, gender: 'male'})}
              disabled={!editing}>
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === 'male' && styles.activeGenderButtonText,
                ]}>
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                formData.gender === 'female' && styles.activeGenderButton,
                !editing && styles.disabledButton,
              ]}
              onPress={() => editing && setFormData({...formData, gender: 'female'})}
              disabled={!editing}>
              <Text
                style={[
                  styles.genderButtonText,
                  formData.gender === 'female' && styles.activeGenderButtonText,
                ]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, {flex: 1, marginRight: 8}]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={formData.height}
            onChangeText={(text) => setFormData({...formData, height: text})}
            placeholder="Height"
            keyboardType="numeric"
            editable={editing}
          />
        </View>

        <View style={[styles.formGroup, {flex: 1, marginLeft: 8}]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, !editing && styles.disabledInput]}
            value={formData.weight}
            onChangeText={(text) => setFormData({...formData, weight: text})}
            placeholder="Weight"
            keyboardType="numeric"
            editable={editing}
          />
        </View>
      </View>

      {editing && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={styles.optionContainer}>
              {[
                {key: 'sedentary', label: 'Sedentary (little to no exercise)'},
                {key: 'light', label: 'Light (exercise 1-3 days/week)'},
                {key: 'moderate', label: 'Moderate (exercise 3-5 days/week)'},
                {key: 'active', label: 'Active (exercise 6-7 days/week)'},
                {key: 'very_active', label: 'Very Active (intense exercise)'},
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    formData.activityLevel === option.key && styles.activeOptionButton,
                  ]}
                  onPress={() => setFormData({...formData, activityLevel: option.key})}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.activityLevel === option.key && styles.activeOptionButtonText,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Goal</Text>
            <View style={styles.goalContainer}>
              {[
                {key: 'lose', label: 'Lose Weight'},
                {key: 'maintain', label: 'Maintain Weight'},
                {key: 'gain', label: 'Gain Weight'},
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.goalButton,
                    formData.goal === option.key && styles.activeGoalButton,
                  ]}
                  onPress={() => setFormData({...formData, goal: option.key})}>
                  <Text
                    style={[
                      styles.goalButtonText,
                      formData.goal === option.key && styles.activeGoalButtonText,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const StatsSection = () => {
    if (!profile) {return null;}

    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(bmr)}</Text>
            <Text style={styles.statLabel}>BMR (cal/day)</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(tdee)}</Text>
            <Text style={styles.statLabel}>TDEE (cal/day)</Text>
          </View>
        </View>

        {goals && (
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsTitle}>Daily Goals</Text>
            <Text style={styles.goalItem}>Calories: {goals.calories}</Text>
            <Text style={styles.goalItem}>Protein: {goals.protein}g</Text>
            <Text style={styles.goalItem}>Carbs: {goals.carbs}g</Text>
            <Text style={styles.goalItem}>Fat: {goals.fat}g</Text>
          </View>
        )}
      </View>
    );
  };

  const SettingsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={appSettings.notifications}
          onValueChange={(value) => handleSettingChange('notifications', value)}
          trackColor={{false: '#e0e0e0', true: '#91C788'}}
          thumbColor={appSettings.notifications ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Units</Text>
        <View style={styles.unitsContainer}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              appSettings.units === 'metric' && styles.activeUnitButton,
            ]}
            onPress={() => handleSettingChange('units', 'metric')}>
            <Text
              style={[
                styles.unitButtonText,
                appSettings.units === 'metric' && styles.activeUnitButtonText,
              ]}>
              Metric
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.unitButton,
              appSettings.units === 'imperial' && styles.activeUnitButton,
            ]}
            onPress={() => handleSettingChange('units', 'imperial')}>
            <Text
              style={[
                styles.unitButtonText,
                appSettings.units === 'imperial' && styles.activeUnitButtonText,
              ]}>
              Imperial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileForm />
        <StatsSection />
        <SettingsSection />
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
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d2d2d',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#91C788',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  genderContainer: {
    flexDirection: 'row',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 4,
  },
  activeGenderButton: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  disabledButton: {
    opacity: 0.6,
  },
  genderButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeGenderButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionContainer: {
    marginTop: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  activeOptionButton: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeOptionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeGoalButton: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  goalButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activeGoalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#91C788',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#91C788',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  goalsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d2d2d',
    marginBottom: 8,
  },
  goalItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2d2d2d',
  },
  unitsContainer: {
    flexDirection: 'row',
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginLeft: 4,
  },
  activeUnitButton: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeUnitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
