import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// Header section with logo and title
const WelcomeHeader = () => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Dino</Text>
      <Image
        source={require('../../assets/image/OnBoardingPage2.gif')}
        style={styles.welcomeImage}
        resizeMode="contain"
      />
    </View>
  );
};

// Content section with title and description
const ContentSection = () => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.contentTitle}>Track Your Health</Text>
      <Text style={styles.contentDescription}>
        With amazing inbuilt tools you can track your progress!
      </Text>
    </View>
  );
};

// Action section with navigation buttons
const ActionButtons = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already Have An Account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main component combining all sections
const InputDesign = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WelcomeHeader />
        <ContentSection />
        <ActionButtons />
      </View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },

  // Welcome Header Styles
  welcomeContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  welcomeTitle: {
    color: '#CFE7CB',
    fontFamily: 'Nunito',
    fontSize: width * 0.07,
    fontWeight: '800',
  },
  welcomeImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: height * 0.08,
  },

  // Content Section Styles
  contentContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  contentTitle: {
    color: 'rgba(0,0,0,0.85)',
    fontFamily: 'Signika',
    fontSize: width * 0.06,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentDescription: {
    color: 'rgba(0,0,0,0.45)',
    fontFamily: 'Signika',
    fontSize: width * 0.045,
    fontWeight: '400',
    maxWidth: width * 0.8,
    textAlign: 'center',
  },

  // Action Buttons Styles
  actionContainer: {
    marginTop: height * 0.06,
    alignItems: 'center',
    gap: 15,
  },
  actionButton: {
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 24,
    backgroundColor: '#91C788',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Signika',
    fontSize: width * 0.055,
    fontWeight: '600',
    letterSpacing: 1.25,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  loginText: {
    color: '#7C7C7C',
    fontFamily: 'Signika',
    fontSize: width * 0.04,
    fontWeight: '400',
  },
  loginLink: {
    color: '#91C788',
    fontFamily: 'Signika',
    fontSize: width * 0.04,
    fontWeight: '700',
  },
});

export default InputDesign;
