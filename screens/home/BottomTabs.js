import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Image, StyleSheet} from 'react-native';
import HomeScreen from '../home/HomeScreen';
import FoodScannerScreen from '../food/FoodScannerScreen';

const Tab = createBottomTabNavigator();

const DummyScreen = ({label}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>{label}</Text>
  </View>
);

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
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#91C788' : '#ccc',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Calories Tab */}
      <Tab.Screen
        name="Calories"
        component={() => <DummyScreen label="Calories Page" />}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/CaloriesIcon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#91C788' : '#ccc',
              }}
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
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.cameraButton}>
              <Image
                source={require('../../assets/icons/CameraIcon.png')}
                style={{width: 30, height: 30, tintColor: '#fff'}}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* Activity Tab */}
      <Tab.Screen
        name="Activity"
        component={() => <DummyScreen label="Activity Page" />}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/ActivityIcon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#91C788' : '#ccc',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={() => <DummyScreen label="Profile Page" />}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../../assets/icons/ProfileIcon.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#91C788' : '#ccc',
              }}
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
});

export default BottomTabs;
