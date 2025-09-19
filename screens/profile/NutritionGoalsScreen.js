import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

const NutritionGoalsScreen = () => {
  const {user, setDailyGoal} = useAuth();
  const navigation = useNavigation();
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [carbGoal, setCarbGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCalorieGoal(user.dailyCalorieGoal?.toString() || '2000');
      // Set default macro goals based on calorie goal
      const calories = user.dailyCalorieGoal || 2000;
      setProteinGoal((calories * 0.25 / 4).toFixed(0)); // 25% of calories from protein
      setCarbGoal((calories * 0.45 / 4).toFixed(0)); // 45% of calories from carbs
      setFatGoal((calories * 0.30 / 9).toFixed(0)); // 30% of calories from fat
    }
  }, [user]);

  const handleSave = async () => {
    const calGoal = parseInt(calorieGoal, 10);
    if (!calGoal || calGoal <= 0) {
      Alert.alert('Error', 'Please enter a valid calorie goal');
      return;
    }

    setLoading(true);
    try {
      const result = await setDailyGoal(calGoal);

      if (result.success) {
        Alert.alert('Success', 'Nutrition goals updated successfully!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateMacroGoals = (newCalories) => {
    const calories = parseInt(newCalories, 10) || 0;
    setProteinGoal((calories * 0.25 / 4).toFixed(0));
    setCarbGoal((calories * 0.45 / 4).toFixed(0));
    setFatGoal((calories * 0.30 / 9).toFixed(0));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Goals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Set your daily nutrition targets to help track your progress and maintain a healthy diet.
        </Text>

        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calorie Goal *</Text>
            <TextInput
              style={styles.input}
              placeholder="2000"
              value={calorieGoal}
              onChangeText={(value) => {
                setCalorieGoal(value);
                updateMacroGoals(value);
              }}
              keyboardType="numeric"
            />
            <Text style={styles.helpText}>Recommended: 1800-2500 calories per day</Text>
          </View>

          <View style={styles.macroSection}>
            <Text style={styles.sectionTitle}>Macro Goals (Auto-calculated)</Text>

            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Protein</Text>
                <View style={styles.macroInputContainer}>
                  <TextInput
                    style={styles.macroInput}
                    value={proteinGoal}
                    onChangeText={setProteinGoal}
                    keyboardType="numeric"
                  />
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroPercentage}>25%</Text>
              </View>

              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <View style={styles.macroInputContainer}>
                  <TextInput
                    style={styles.macroInput}
                    value={carbGoal}
                    onChangeText={setCarbGoal}
                    keyboardType="numeric"
                  />
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroPercentage}>45%</Text>
              </View>

              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Fat</Text>
                <View style={styles.macroInputContainer}>
                  <TextInput
                    style={styles.macroInput}
                    value={fatGoal}
                    onChangeText={setFatGoal}
                    keyboardType="numeric"
                  />
                  <Text style={styles.macroUnit}>g</Text>
                </View>
                <Text style={styles.macroPercentage}>30%</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>💡 Tips</Text>
            <Text style={styles.tipText}>• Adjust goals based on your activity level</Text>
            <Text style={styles.tipText}>• Goals can be modified anytime</Text>
            <Text style={styles.tipText}>• Track consistently for best results</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Goals'}
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    fontSize: 18,
    color: '#91C788',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
  },
  goalSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  macroSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  macroInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  macroInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    width: 50,
    textAlign: 'center',
  },
  macroUnit: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  macroPercentage: {
    fontSize: 12,
    color: '#91C788',
    fontWeight: '500',
  },
  tipSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#91C788',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NutritionGoalsScreen;
