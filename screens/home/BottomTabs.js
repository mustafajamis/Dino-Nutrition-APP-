import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image, StyleSheet} from 'react-native';
import HomeScreen from '../home/HomeScreen';
import FoodScannerScreen from '../food/FoodScannerScreen';
import CaloriesScreen from '../calories/CaloriesScreen';
import ProfileScreen from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#91C788',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: styles.tabBar,
      }}>
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/HomeIcone.png')}
              style={[styles.tabIcon, {tintColor: focused ? '#91C788' : '#ccc'}]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Calories Tab */}
      <Tab.Screen
        name="Calories"
        component={CaloriesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/CaloriesIcon.png')}
              style={[styles.tabIcon, {tintColor: focused ? '#91C788' : '#ccc'}]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Center Camera Button */}
      <Tab.Screen
        name="Scan"
        component={FoodScannerScreen}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.cameraButton}>
              <Image
                source={require('../../assets/icons/CameraIcon.png')}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/ProfileIcon.png')}
              style={[styles.tabIcon, {tintColor: focused ? '#91C788' : '#ccc'}]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    position: 'absolute',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  cameraButton: {
    top: -20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  cameraIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});

export default BottomTabs;
