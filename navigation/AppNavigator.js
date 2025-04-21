import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from '../screens/Welcome/WelcomePage';
import OnboardingWrapper from '../screens/OnBoarding/OnboardingWrapper';
import LoginScreen from '../screens/login/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
