import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

export default function GetStartedScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.logo}>DINO</Text>

      <View style={styles.textContainer}>

        <Image 
        source = {require('./assets/image/DinoLog.png')} 
        style ={styles.image}
        />
        <Text style={styles.title}>Eat Healthy</Text>
        <Text style={styles.subtitle}>Maintaining good health should be the primary focus of everyone.</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button}>
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
    marginTop: 100
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
    width: 150, // changes size of image
    height: 150, //changes height of image
    resizeMode: 'contain', //makes sure its proportionate
    marginBottom: 10, 
  },
  loginButtonText: {
    color: '#A2C79A',   // green
    fontSize: 14,
    fontWeight: 'bold',
  },
});