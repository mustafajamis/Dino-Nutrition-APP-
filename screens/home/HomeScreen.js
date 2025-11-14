import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../style/Theme';

const HomeScreen = () => {
  const {user, todayActivity, setDailyGoal} = useAuth();
  const {styles, isDark, toggleTheme} = useTheme();
  const navigation = useNavigation();
  const [isSilent, setIsSilent] = useState(false);

  const handleSetGoal = () => {
    Alert.prompt(
      'Set Daily Calorie Goal',
      'Enter your daily calorie target:',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Set Goal',
          onPress: async input => {
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
      user?.dailyCalorieGoal?.toString() || '2000',
    );
  };

  const displayName =
    user?.user_metadata?.display_name ||
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Hi{displayName ? ', ' + displayName : ''}
            </Text>
            <Text style={styles.headerSubtitle}>Welcome back!</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setIsSilent(!isSilent)}
              style={{marginRight: 16}}>
              <Text style={{fontSize: 20}}>{isSilent ? '🔕' : '🔔'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme}>
              <Text style={{fontSize: 20}}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.cardPrimary}>
          <Text style={[styles.sectionTitle, styles.textWhite]}>
            Today's Summary
          </Text>
          <View style={[styles.row, styles.spaceAround]}>
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {todayActivity?.totalCaloriesConsumed || 0}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Calories</Text>
            </View>
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {todayActivity?.meals?.length || 0}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Meals</Text>
            </View>
            <View style={styles.alignCenter}>
              <Text style={[styles.statNumber, styles.textWhite]}>
                {user?.dailyCalorieGoal || 2000}
              </Text>
              <Text style={[styles.caption, styles.textWhite]}>Goal</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Calories')}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionText}>Log Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Scan')}>
              <Text style={styles.actionIcon}>📸</Text>
              <Text style={styles.actionText}>Scan Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={handleSetGoal}>
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Set Goal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.card}>
          <View style={[styles.row, styles.spaceBetween, styles.marginBottom]}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            <TouchableOpacity
              onPress={handleSetGoal}
              style={styles.buttonSmall}>
              <Text style={styles.buttonTextSmall}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.marginBottom}>
            <Text style={styles.bodyTextSecondary}>Calorie Goal</Text>
            <View style={[styles.progressBar, {marginVertical: 8}]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      ((todayActivity?.totalCaloriesConsumed || 0) /
                        (user?.dailyCalorieGoal || 2000)) *
                        100,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.bodyTextSecondary, styles.textCenter]}>
              {todayActivity?.totalCaloriesConsumed || 0} /{' '}
              {user?.dailyCalorieGoal || 2000}
            </Text>
          </View>

          <View style={[styles.row, styles.spaceAround]}>
            <View style={styles.alignCenter}>
              <Text style={styles.statNumber}>
                {Math.max(
                  0,
                  (user?.dailyCalorieGoal || 2000) -
                    (todayActivity?.totalCaloriesConsumed || 0),
                )}
              </Text>
              <Text style={styles.caption}>Remaining</Text>
            </View>
            <View style={styles.alignCenter}>
              <Text style={styles.statNumber}>
                {Math.round(
                  ((todayActivity?.totalCaloriesConsumed || 0) /
                    (user?.dailyCalorieGoal || 2000)) *
                    100,
                )}
                %
              </Text>
              <Text style={styles.caption}>Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
