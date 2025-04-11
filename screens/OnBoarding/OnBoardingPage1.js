import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnBoardingPage1() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* App logo title */}
      <Text style={styles.logo}>DINO</Text>

      {/* Center image and motivational message */}
      <View style={styles.textContainer}>
        <Image 
          source={require('../../assets/image/DinoLog.png')} 
          style={styles.image}
        />
        <Text style={styles.title}>Eat Healthy</Text>
        <Text style={styles.subtitle}>
          Maintaining good health should be the primary focus of everyone.
        </Text>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomContainer}>
        {/* For now just log action */}
        <TouchableOpacity style={styles.button} onPress={() => console.log('Get Started pressed')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
          <Text style={styles.loginButtonText}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { 
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A2C79A',
    marginTop: 0,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 200,
    marginHorizontal: 40,
    marginTop: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: height / 4,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A2C79A',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10, 
  },
  loginButtonText: {
    color: '#A2C79A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
});