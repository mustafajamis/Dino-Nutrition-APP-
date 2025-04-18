import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from '../screens/welcome/WelcomePage';     
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="WelcomePage"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WelcomePage" component={WelcomePage} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator; 