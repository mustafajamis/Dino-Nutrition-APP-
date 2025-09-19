import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const FoodPreferencesScreen = () => {
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false,
    keto: false,
    paleo: false,
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Food preferences saved successfully!', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const preferenceItems = [
    {
      key: 'vegetarian',
      title: 'Vegetarian',
      description: 'No meat, but includes dairy and eggs',
      icon: '🥗',
    },
    {
      key: 'vegan',
      title: 'Vegan',
      description: 'No animal products whatsoever',
      icon: '🌱',
    },
    {
      key: 'glutenFree',
      title: 'Gluten-Free',
      description: 'No wheat, barley, rye, or gluten',
      icon: '🌾',
    },
    {
      key: 'dairyFree',
      title: 'Dairy-Free',
      description: 'No milk, cheese, or dairy products',
      icon: '🥛',
    },
    {
      key: 'nutFree',
      title: 'Nut-Free',
      description: 'No tree nuts or peanuts',
      icon: '🥜',
    },
    {
      key: 'lowCarb',
      title: 'Low-Carb',
      description: 'Reduced carbohydrate intake',
      icon: '🥖',
    },
    {
      key: 'keto',
      title: 'Ketogenic',
      description: 'Very low carb, high fat diet',
      icon: '🥑',
    },
    {
      key: 'paleo',
      title: 'Paleo',
      description: 'Whole foods, no processed foods',
      icon: '🍖',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Food Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Select your dietary preferences and restrictions to get personalized food recommendations.
        </Text>

        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>

          {preferenceItems.map((item) => (
            <View key={item.key} style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceIcon}>{item.icon}</Text>
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceTitle}>{item.title}</Text>
                  <Text style={styles.preferenceDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={preferences[item.key]}
                onValueChange={() => togglePreference(item.key)}
                trackColor={{false: '#E0E0E0', true: '#91C788'}}
                thumbColor={preferences[item.key] ? '#fff' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ How this helps</Text>
          <Text style={styles.infoText}>• Get food suggestions that match your diet</Text>
          <Text style={styles.infoText}>• Avoid foods you can't or don't want to eat</Text>
          <Text style={styles.infoText}>• Better calorie and nutrition tracking</Text>
          <Text style={styles.infoText}>• Personalized meal recommendations</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  preferencesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#91C788',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodPreferencesScreen;
