import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoardingPage1 from '../screens/OnBoarding/OnBoardingPage1';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnBoard1"
      screenOptions={{ headerShown: false }}
    >
      {/* Only one onboarding screen for now */}
      <Stack.Screen name="OnBoard1" component={OnBoardingPage1} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 