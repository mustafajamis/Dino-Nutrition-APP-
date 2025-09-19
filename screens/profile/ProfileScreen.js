import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';

const {width} = Dimensions.get('window');

const ProfileScreen = () => {
  const {user, logout, getMonthlyStats} = useAuth();
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    loadMonthlyStats();
  }, [user, loadMonthlyStats]);

  const loadMonthlyStats = useCallback(async () => {
    if (!user) {return;}

    try {
      const stats = await getMonthlyStats();
      setMonthlyStats(stats);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  }, [user, getMonthlyStats]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', onPress: logout, style: 'destructive'},
      ]
    );
  };

  const userStats = [
    {label: 'Days Active', value: monthlyStats.activeDays?.toString() || '0', subtitle: 'This month'},
    {label: 'Total Calories', value: `${Math.round((monthlyStats.totalCalories || 0) / 1000)}k`, subtitle: 'Tracked'},
    {label: 'Avg Daily', value: monthlyStats.averageDaily?.toString() || '0', subtitle: 'Calories'},
    {label: 'Goal', value: user?.dailyCalorieGoal?.toString() || '2000', subtitle: 'Daily target'},
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
        Alert.alert('Coming Soon', 'Notification settings will be available in a future update.');
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
    return { labels, datasets: [{ data }] };
  };

  return (
    <SafeAreaView style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info - No Image */}
        <View style={[styles.profileHeader, darkModeEnabled && styles.darkProfileHeader]}>
          <Text style={[styles.userName, darkModeEnabled && styles.darkText]}>{user?.name || user?.username || 'User'}</Text>
          <Text style={[styles.userEmail, darkModeEnabled && styles.darkSubText]}>{user?.email || 'user@example.com'}</Text>
          <Text style={[styles.joinDate, darkModeEnabled && styles.darkSubText]}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={[styles.statsSection, darkModeEnabled && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, darkModeEnabled && styles.darkStatCard]}>
                <Text style={[styles.statValue, darkModeEnabled && styles.darkAccent]}>{stat.value}</Text>
                <Text style={[styles.statLabel, darkModeEnabled && styles.darkText]}>{stat.label}</Text>
                <Text style={[styles.statSubtitle, darkModeEnabled && styles.darkSubText]}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* View Reports Chart */}
        <View style={[styles.reportsSection, darkModeEnabled && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>View Reports Chart</Text>
          <View style={[styles.chartContainer, darkModeEnabled && styles.darkChartContainer]}>
            <LineChart
              data={getReportsData()}
              width={width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" cal"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: darkModeEnabled ? '#2d2d2d' : '#ffffff',
                backgroundGradientFrom: darkModeEnabled ? '#2d2d2d' : '#ffffff',
                backgroundGradientTo: darkModeEnabled ? '#1a1a1a' : '#f8f8f8',
                decimalPlaces: 0,
                color: (opacity = 1) => darkModeEnabled ? `rgba(145, 199, 136, ${opacity})` : `rgba(145, 199, 136, ${opacity})`,
                labelColor: (opacity = 1) => darkModeEnabled ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#91C788',
                },
              }}
              bezier
              style={styles.chartStyle}
            />
            <Text style={[styles.chartDescription, darkModeEnabled && styles.darkSubText]}>
              Weekly calorie intake trends
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActionsSection, darkModeEnabled && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickAction, darkModeEnabled && styles.darkQuickAction]} onPress={() => {
              Alert.alert('Reports Chart', 'View your detailed reports in the chart above.');
            }}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={[styles.quickActionText, darkModeEnabled && styles.darkText]}>View Reports Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, darkModeEnabled && styles.darkQuickAction]} onPress={() => navigation.navigate('NutritionGoals')}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={[styles.quickActionText, darkModeEnabled && styles.darkText]}>Set Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, darkModeEnabled && styles.darkQuickAction]} onPress={() => {
              Alert.alert('Coming Soon', 'Share progress feature will be available in a future update.');
            }}>
              <Text style={styles.quickActionIcon}>📱</Text>
              <Text style={[styles.quickActionText, darkModeEnabled && styles.darkText]}>Share Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={[styles.settingsSection, darkModeEnabled && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>Settings</Text>

          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, darkModeEnabled && styles.darkMenuItem]} onPress={item.action}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, darkModeEnabled && styles.darkMenuIcon]}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <View style={styles.menuContent}>
                  <Text style={[styles.menuTitle, darkModeEnabled && styles.darkText]}>{item.title}</Text>
                  <Text style={[styles.menuSubtitle, darkModeEnabled && styles.darkSubText]}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={[styles.menuArrow, darkModeEnabled && styles.darkSubText]}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Toggle Settings */}
          <View style={styles.toggleSection}>
            <View style={[styles.toggleItem, darkModeEnabled && styles.darkToggleItem]}>
              <View style={styles.toggleLeft}>
                <Text style={[styles.toggleIcon, darkModeEnabled && styles.darkToggleIcon]}>🔔</Text>
                <View style={styles.toggleContent}>
                  <Text style={[styles.toggleTitle, darkModeEnabled && styles.darkText]}>Push Notifications</Text>
                  <Text style={[styles.toggleSubtitle, darkModeEnabled && styles.darkSubText]}>Get reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{false: darkModeEnabled ? '#444' : '#E0E0E0', true: '#91C788'}}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.toggleItem, darkModeEnabled && styles.darkToggleItem]}>
              <View style={styles.toggleLeft}>
                <Text style={[styles.toggleIcon, darkModeEnabled && styles.darkToggleIcon]}>🌙</Text>
                <View style={styles.toggleContent}>
                  <Text style={[styles.toggleTitle, darkModeEnabled && styles.darkText]}>Dark Mode</Text>
                  <Text style={[styles.toggleSubtitle, darkModeEnabled && styles.darkSubText]}>Use dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{false: darkModeEnabled ? '#444' : '#E0E0E0', true: '#91C788'}}
                thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={[styles.toggleItem, darkModeEnabled && styles.darkToggleItem]}>
              <View style={styles.toggleLeft}>
                <Text style={[styles.toggleIcon, darkModeEnabled && styles.darkToggleIcon]}>🔒</Text>
                <View style={styles.toggleContent}>
                  <Text style={[styles.toggleTitle, darkModeEnabled && styles.darkText]}>Private Profile</Text>
                  <Text style={[styles.toggleSubtitle, darkModeEnabled && styles.darkSubText]}>Hide your activity from others</Text>
                </View>
              </View>
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                trackColor={{false: darkModeEnabled ? '#444' : '#E0E0E0', true: '#91C788'}}
                thumbColor={privateProfile ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Support Section - Removed Privacy Policy and Terms of Service */}
        <View style={[styles.supportSection, darkModeEnabled && styles.darkSection]}>
          <TouchableOpacity style={[styles.supportItem, darkModeEnabled && styles.darkSupportItem]} onPress={() => {
            Alert.alert('Help & Support', 'For support, please contact us at support@dinoapp.com');
          }}>
            <Text style={[styles.supportIcon, darkModeEnabled && styles.darkSupportIcon]}>❓</Text>
            <Text style={[styles.supportText, darkModeEnabled && styles.darkText]}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.supportItem, styles.logoutItem, darkModeEnabled && styles.darkSupportItem]} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.versionInfo, darkModeEnabled && styles.darkVersionInfo]}>
          <Text style={[styles.versionText, darkModeEnabled && styles.darkSubText]}>Dino v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  darkProfileHeader: {
    backgroundColor: '#2d2d2d',
  },
  userName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: width * 0.035,
    color: '#999',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubText: {
    color: '#cccccc',
  },
  darkAccent: {
    color: '#91C788',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    width: width * 0.42,
    marginBottom: 15,
    alignItems: 'center',
  },
  darkStatCard: {
    backgroundColor: '#404040',
  },
  statValue: {
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
  statSubtitle: {
    fontSize: width * 0.03,
    color: '#666',
    marginTop: 2,
  },
  reportsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  chartContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  darkChartContainer: {
    backgroundColor: '#404040',
  },
  chartDescription: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: width * 0.28,
  },
  darkQuickAction: {
    backgroundColor: '#404040',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: width * 0.03,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  darkMenuItem: {
    borderBottomColor: '#404040',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  darkMenuIcon: {
    backgroundColor: '#505050',
  },
  menuIconText: {
    fontSize: 18,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 18,
    color: '#CCC',
  },
  toggleSection: {
    marginTop: 10,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  darkToggleItem: {
    borderBottomColor: '#404040',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 18,
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 40,
  },
  darkToggleIcon: {
    backgroundColor: '#505050',
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
  },
  toggleSubtitle: {
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 2,
  },
  supportSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  darkSupportItem: {
    borderBottomColor: '#404040',
  },
  supportIcon: {
    fontSize: 18,
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 40,
  },
  darkSupportIcon: {
    backgroundColor: '#505050',
  },
  supportText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutIcon: {
    backgroundColor: '#FFE5E5',
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '500',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  darkVersionInfo: {
    backgroundColor: '#2d2d2d',
  },
  versionText: {
    fontSize: width * 0.035,
    color: '#999',
  },
});

export default ProfileScreen;
