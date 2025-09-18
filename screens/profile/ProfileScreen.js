import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import {
  calculateBMR,
  calculateDailyCalories,
  calculateMacros,
  convertWeight,
  convertHeight,
} from '../../utils/formatCalories';

const {width} = Dimensions.get('window');

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Mustafa',
    email: 'mustafa@example.com',
    age: 25,
    gender: 'male',
    weight: 70, // kg
    height: 175, // cm
    activityLevel: 'moderate',
    goal: 'maintain', // maintain, lose, gain
    notifications: true,
    units: 'metric', // metric or imperial
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({...userProfile});

  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65,
  });

  useEffect(() => {
    calculateNutritionGoals();
  }, [userProfile.weight, userProfile.height, userProfile.age, userProfile.gender, userProfile.activityLevel, userProfile.goal]);

  const calculateNutritionGoals = () => {
    const bmr = calculateBMR(
      userProfile.weight,
      userProfile.height,
      userProfile.age,
      userProfile.gender,
    );

    let dailyCalories = calculateDailyCalories(bmr, userProfile.activityLevel);

    // Adjust based on goal
    if (userProfile.goal === 'lose') {
      dailyCalories -= 500; // 500 calorie deficit for 1 lb/week loss
    } else if (userProfile.goal === 'gain') {
      dailyCalories += 500; // 500 calorie surplus for 1 lb/week gain
    }

    const macros = calculateMacros(dailyCalories);

    setNutritionGoals({
      calories: dailyCalories,
      ...macros,
    });
  };

  const handleSaveProfile = () => {
    setUserProfile({...editableProfile});
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditableProfile({...userProfile});
    setIsEditing(false);
  };

  const ProfileSection = ({title, children}) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const ProfileField = ({label, value, onChangeText, keyboardType = 'default'}) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value?.toString()}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  const SelectField = ({label, value, options, onSelect}) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <View style={styles.selectContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.selectOption,
                value === option.value && styles.selectedOption,
              ]}
              onPress={() => onSelect(option.value)}>
              <Text
                style={[
                  styles.selectOptionText,
                  value === option.value && styles.selectedOptionText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>
          {options.find(opt => opt.value === value)?.label || value}
        </Text>
      )}
    </View>
  );

  const SwitchField = ({label, value, onValueChange}) => (
    <View style={styles.switchContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: '#e1e8ed', true: '#91C788'}}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const GoalCard = ({title, value, unit, description}) => (
    <View style={styles.goalCard}>
      <Text style={styles.goalTitle}>{title}</Text>
      <Text style={styles.goalValue}>
        {value}
        <Text style={styles.goalUnit}>{unit}</Text>
      </Text>
      <Text style={styles.goalDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <ProfileSection title="Personal Information">
          <ProfileField
            label="Name"
            value={editableProfile.name}
            onChangeText={text =>
              setEditableProfile({...editableProfile, name: text})
            }
          />
          <ProfileField
            label="Email"
            value={editableProfile.email}
            onChangeText={text =>
              setEditableProfile({...editableProfile, email: text})
            }
            keyboardType="email-address"
          />
          <ProfileField
            label="Age"
            value={editableProfile.age}
            onChangeText={text =>
              setEditableProfile({...editableProfile, age: parseInt(text) || 0})
            }
            keyboardType="numeric"
          />
          <SelectField
            label="Gender"
            value={editableProfile.gender}
            options={[
              {label: 'Male', value: 'male'},
              {label: 'Female', value: 'female'},
            ]}
            onSelect={value =>
              setEditableProfile({...editableProfile, gender: value})
            }
          />
        </ProfileSection>

        {/* Physical Information */}
        <ProfileSection title="Physical Information">
          <ProfileField
            label="Weight (kg)"
            value={editableProfile.weight}
            onChangeText={text =>
              setEditableProfile({
                ...editableProfile,
                weight: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          <ProfileField
            label="Height (cm)"
            value={editableProfile.height}
            onChangeText={text =>
              setEditableProfile({
                ...editableProfile,
                height: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          <SelectField
            label="Activity Level"
            value={editableProfile.activityLevel}
            options={[
              {label: 'Sedentary', value: 'sedentary'},
              {label: 'Light', value: 'light'},
              {label: 'Moderate', value: 'moderate'},
              {label: 'Active', value: 'active'},
              {label: 'Very Active', value: 'veryActive'},
            ]}
            onSelect={value =>
              setEditableProfile({...editableProfile, activityLevel: value})
            }
          />
          <SelectField
            label="Goal"
            value={editableProfile.goal}
            options={[
              {label: 'Lose Weight', value: 'lose'},
              {label: 'Maintain Weight', value: 'maintain'},
              {label: 'Gain Weight', value: 'gain'},
            ]}
            onSelect={value =>
              setEditableProfile({...editableProfile, goal: value})
            }
          />
        </ProfileSection>

        {/* Nutrition Goals */}
        <ProfileSection title="Daily Nutrition Goals">
          <View style={styles.goalsGrid}>
            <GoalCard
              title="Calories"
              value={nutritionGoals.calories}
              unit=" cal"
              description="Daily target"
            />
            <GoalCard
              title="Protein"
              value={nutritionGoals.protein}
              unit="g"
              description="Daily target"
            />
            <GoalCard
              title="Carbs"
              value={nutritionGoals.carbs}
              unit="g"
              description="Daily target"
            />
            <GoalCard
              title="Fat"
              value={nutritionGoals.fat}
              unit="g"
              description="Daily target"
            />
          </View>
        </ProfileSection>

        {/* Preferences */}
        <ProfileSection title="Preferences">
          <SwitchField
            label="Push Notifications"
            value={editableProfile.notifications}
            onValueChange={value =>
              setEditableProfile({...editableProfile, notifications: value})
            }
          />
          <SelectField
            label="Units"
            value={editableProfile.units}
            options={[
              {label: 'Metric (kg, cm)', value: 'metric'},
              {label: 'Imperial (lbs, ft)', value: 'imperial'},
            ]}
            onSelect={value =>
              setEditableProfile({...editableProfile, units: value})
            }
          />
        </ProfileSection>

        {/* App Information */}
        <ProfileSection title="App Information">
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>About Dino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.infoButton, styles.logoutButton]}>
            <Text style={[styles.infoButtonText, styles.logoutButtonText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </ProfileSection>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91C788',
  },
  editButtonText: {
    color: '#91C788',
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#91C788',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  sectionContent: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#666',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#91C788',
    backgroundColor: '#f0f8f0',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#91C788',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: (width - 64) / 2,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  goalUnit: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  goalDescription: {
    fontSize: 12,
    color: '#999',
  },
  infoButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  infoButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default ProfileScreen;
