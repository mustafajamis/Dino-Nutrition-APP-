import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import {responsiveStyles as styles} from '../../style/ResponsiveUI';

const {width} = Dimensions.get('window');

const SignupScreen = ({navigation}) => {
  const [secureText, setSecureText] = useState(true);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>
          <SafeAreaView style={styles.container}>
            {/* Top Green Wave */}
            <Svg
              height="90"
              width={width}
              viewBox="0 0 1440 320"
              style={styles.greenWave}>
              <Path
                fill="#91C788"
                d="M0,160L48,154.7C96,149,192,139,288,144C384,149,480,171,576,165.3C672,160,768,128,864,106.7C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
            </Svg>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Start your healthy with</Text>
              <Text style={styles.cotitle}>Dino Today</Text>

              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.inputIcon}>👤</Text>
              </View>

              {/* Email */}
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Dino@yahoo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.inputIcon}>✉️</Text>
              </View>

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Text style={styles.inputIcon}>👁️</Text>
                </TouchableOpacity>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate('CreateProfile')}>
                <Text style={styles.loginText}>Signup</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
