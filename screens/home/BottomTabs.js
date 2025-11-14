import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {colors} from '../../style/Theme';
import HomeScreen from '../home/HomeScreen';
import FoodScannerScreen from '../food/FoodScannerScreen';
import CaloriesScreen from '../calories/CaloriesScreen';
import ProfileScreen from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const {isDark} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#888' : '#ccc',
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          backgroundColor: isDark ? '#2d2d2d' : '#fff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 8,
        },
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
                tintColor: focused ? colors.primary : isDark ? '#888' : '#ccc',
              }}
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
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? colors.primary : isDark ? '#888' : '#ccc',
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
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: () => (
            <View
              style={{
                top: -20,
                width: 65,
                height: 65,
                borderRadius: 32.5,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 6,
              }}>
              <Image
                source={require('../../assets/icons/CameraIcon.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: '#fff',
                }}
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
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? colors.primary : isDark ? '#888' : '#ccc',
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
