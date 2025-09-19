import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {responsiveStyles as styles} from '../../style/ResponsiveUI';
import {useAuth} from '../../context/AuthContext';

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [secureText, setSecureText] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start the animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={localStyles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={localStyles.scrollContainer}>
          <SafeAreaView style={styles.container}>
            {/* Top Green Wave using SVG */}
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

            {/* Login Form */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              <Text style={styles.title}>Login to Dino</Text>

              {/* Email */}
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                  accessibilityLabel="Email input field"
                  accessibilityHint="Enter your email address"
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
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  accessibilityLabel="Password input field"
                  accessibilityHint="Enter your account password"
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Text style={styles.inputIcon}>👁️</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && localStyles.loadingButton,
                ]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}>
                <Text style={styles.loginText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={[styles.link]}> Sign up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const localStyles = {
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingButton: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },
};

export default LoginScreen;
