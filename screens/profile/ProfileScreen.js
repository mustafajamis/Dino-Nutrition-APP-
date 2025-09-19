import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Switch,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const {width} = Dimensions.get('window');

const ProfileScreen = () => {
  const {user, logout, getMonthlyStats} = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
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
      action: () => console.log('Edit Profile'),
    },
    {
      id: 2,
      title: 'Nutrition Goals',
      subtitle: 'Set your daily calorie and macro targets',
      icon: '🎯',
      action: () => console.log('Nutrition Goals'),
    },
    {
      id: 3,
      title: 'Food Preferences',
      subtitle: 'Dietary restrictions and preferences',
      icon: '🍽️',
      action: () => console.log('Food Preferences'),
    },
    {
      id: 4,
      title: 'Notifications',
      subtitle: 'Manage your app notifications',
      icon: '🔔',
      action: () => console.log('Notifications'),
    },
    {
      id: 5,
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: '🚪',
      action: handleLogout,
    },
  ];

  const achievements = [
    {title: 'First Week', description: 'Completed your first week', icon: '🏆', unlocked: true},
    {title: 'Calorie Master', description: 'Logged 1000 meals', icon: '🍽️', unlocked: true},
    {title: 'Fitness Fanatic', description: '30 days of activity', icon: '💪', unlocked: false},
    {title: 'Goal Getter', description: 'Reached weight goal', icon: '⭐', unlocked: false},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/icons/Mustafa.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.joinDate}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📈</Text>
              <Text style={styles.quickActionText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🎯</Text>
              <Text style={styles.quickActionText}>Set Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📱</Text>
              <Text style={styles.quickActionText}>Share Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Toggle Settings */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Text style={styles.toggleIcon}>🔔</Text>
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>Push Notifications</Text>
                  <Text style={styles.toggleSubtitle}>Get reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{false: '#E0E0E0', true: '#91C788'}}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Text style={styles.toggleIcon}>🌙</Text>
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>Dark Mode</Text>
                  <Text style={styles.toggleSubtitle}>Use dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{false: '#E0E0E0', true: '#91C788'}}
                thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <Text style={styles.toggleIcon}>🔒</Text>
                <View style={styles.toggleContent}>
                  <Text style={styles.toggleTitle}>Private Profile</Text>
                  <Text style={styles.toggleSubtitle}>Hide your activity from others</Text>
                </View>
              </View>
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                trackColor={{false: '#E0E0E0', true: '#91C788'}}
                thumbColor={privateProfile ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View
                key={index}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementLocked,
                ]}>
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked,
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTextLocked,
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementTextLocked,
                ]}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>❓</Text>
            <Text style={styles.supportText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>📝</Text>
            <Text style={styles.supportText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportIcon}>📋</Text>
            <Text style={styles.supportText}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.supportItem, styles.logoutItem]}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Dino v1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#91C788',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarText: {
    fontSize: 16,
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
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
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    width: width * 0.42,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
  },
  achievementTextLocked: {
    opacity: 0.6,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  versionText: {
    fontSize: width * 0.035,
    color: '#999',
  },
});

export default ProfileScreen;
