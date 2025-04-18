import React from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text } from 'react-native';

export default function GreenScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/image/DinoLog.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Image
        source={require('../../assets/image/DinoGif.gif')}
        style={styles.gif}
        resizeMode="contain"
      />

      <Text style={styles.text}>Dino</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#91C788',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    top: -50,
  },
  gif: {
    width: 75,
    height: 75,
    top: 75,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    top: 60,
    color: '#fff', // White text for contrast
  },
});
