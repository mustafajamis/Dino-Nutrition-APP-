import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../style/Theme';

const {width} = Dimensions.get('window');

const ProfileScreen = () => {
  const {user, logout, getMonthlyStats} = useAuth();
  const {styles, isDark, toggleTheme} = useTheme();
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    loadMonthlyStats();
  }, [user, loadMonthlyStats]);

  const loadMonthlyStats = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const stats = await getMonthlyStats();
      setMonthlyStats(stats);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  }, [user, getMonthlyStats]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{name: 'Welcome'}],
            });
          } catch (e) {
            console.error('Logout navigation error:', e);
          }
        },
      },
    ]);
  };

  const userStats = [
    {
      label: 'Days Active',
      value: monthlyStats.activeDays?.toString() || '0',
      subtitle: 'This month',
    },
    {
      label: 'Total Calories',
      value: `${Math.round((monthlyStats.totalCalories || 0) / 1000)}k`,
      subtitle: 'Tracked',
    },
    {
      label: 'Avg Daily',
      value: monthlyStats.averageDaily?.toString() || '0',
      subtitle: 'Calories',
    },
    {
      label: 'Goal',
      value: user?.dailyCalorieGoal?.toString() || '2000',
      subtitle: 'Daily target',
    },
  ];

  const menuItems = [
    {
      id: 1,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: '👤',
      action: () => navigation.navigate('EditProfile'),
    },
    {
      id: 2,
      title: 'Nutrition Goals',
      subtitle: 'Set your daily calorie and macro targets',
      icon: '🎯',
      action: () => navigation.navigate('NutritionGoals'),
    },
    {
      id: 3,
      title: 'Food Preferences',
      subtitle: 'Dietary restrictions and preferences',
      icon: '🍽️',
      action: () => navigation.navigate('FoodPreferences'),
    },
    {
      id: 4,
      title: 'Notifications',
      subtitle: 'Manage your app notifications',
      icon: '🔔',
      action: () => {
        Alert.alert(
          'Coming Soon',
          'Notification settings will be available in a future update.',
        );
      },
    },
    {
      id: 5,
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: '🚪',
      action: handleLogout,
    },
  ];

  // Sample data for reports chart
  const getReportsData = () => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [
      monthlyStats.activeDays ? monthlyStats.activeDays * 300 : 1800,
      monthlyStats.averageDaily || 2100,
      2300,
      1900,
      2500,
      2200,
      2000,
    ];
    return {labels, datasets: [{data}]};
  };

  const displayName =
    user?.user_metadata?.display_name ||
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{displayName || 'Profile'}</Text>
          <Text style={styles.headerSubtitle}>
            {user?.email || 'user@example.com'}
          </Text>
          <Text style={styles.caption}>
            Member since{' '}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View
            style={[
              styles.row,
              {flexWrap: 'wrap', justifyContent: 'space-between'},
            ]}>
            {userStats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statCard,
                  {width: width * 0.42, marginBottom: 15},
                ]}>
                <Text style={[styles.statNumber, styles.textPrimary]}>
                  {stat.value}
                </Text>
                <Text style={styles.bodyText}>{stat.label}</Text>
                <Text style={styles.caption}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* View Reports Chart */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.cardSurface}>
            <LineChart
              data={getReportsData()}
              width={width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" cal"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                backgroundGradientFrom: isDark ? '#2d2d2d' : '#ffffff',
                backgroundGradientTo: isDark ? '#1a1a1a' : '#f8f8f8',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(145, 199, 136, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDark
                    ? `rgba(255, 255, 255, ${opacity})`
                    : `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
              }}
              bezier
              style={{marginVertical: 8, borderRadius: 16}}
            />
            <Text style={[styles.caption, styles.textCenter]}>
              Weekly calorie intake trends
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                Alert.alert(
                  'Reports Chart',
                  'View your detailed reports in the chart above.',
                );
              }}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('NutritionGoals')}>
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Set Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                Alert.alert(
                  'Coming Soon',
                  'Share progress feature will be available in a future update.',
                );
              }}>
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionText}>Share Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.paddingHorizontal}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {menuItems.map(item => (
            <View
              key={item.id}
              style={[
                styles.listItem,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                },
              ]}>
              <View style={{flex: 1}}>
                <Text style={styles.listItemText}>{item.title}</Text>
                <Text style={styles.listItemSecondary}>{item.subtitle}</Text>
              </View>
            </View>
          ))}

          {/* Toggle Settings */}
          <View
            style={[
              styles.listItem,
              styles.spaceBetween,
              {flexDirection: 'row', alignItems: 'center', paddingVertical: 12},
            ]}>
            <View style={styles.row}>
              <View>
                <Text style={styles.listItemText}>Push Notifications</Text>
                <Text style={styles.listItemSecondary}>
                  Get reminders and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: isDark ? '#444' : '#E0E0E0',
                true: colors.primary,
              }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View
            style={[
              styles.listItem,
              styles.spaceBetween,
              {flexDirection: 'row', alignItems: 'center', paddingVertical: 12},
            ]}>
            <View style={styles.row}>
              <View>
                <Text style={styles.listItemText}>Dark Mode</Text>
                <Text style={styles.listItemSecondary}>Use dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: isDark ? '#444' : '#E0E0E0',
                true: colors.primary,
              }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View
            style={[
              styles.listItem,
              styles.spaceBetween,
              {flexDirection: 'row', alignItems: 'center', paddingVertical: 12},
            ]}>
            <View style={styles.row}>
              <View>
                <Text style={styles.listItemText}>Private Profile</Text>
                <Text style={styles.listItemSecondary}>
                  Hide your activity from others
                </Text>
              </View>
            </View>
            <Switch
              value={privateProfile}
              onValueChange={setPrivateProfile}
              trackColor={{
                false: isDark ? '#444' : '#E0E0E0',
                true: colors.primary,
              }}
              thumbColor={privateProfile ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.paddingHorizontal}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              Alert.alert(
                'Help & Support',
                'For support, please contact us at support@dinoapp.com',
              );
            }}>
            <View style={styles.row}>
              <Text style={styles.listItemText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.alignCenter, styles.paddingVertical]}>
          <Text style={styles.caption}>Dino v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
