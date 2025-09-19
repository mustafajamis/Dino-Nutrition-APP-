import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomePage from '../screens/Welcome/WelcomePage';
import OnboardingWrapper from '../screens/OnBoarding/OnboardingWrapper';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';
import BottomTabs from '../screens/home/BottomTabs';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
