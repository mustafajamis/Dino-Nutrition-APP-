import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather'; // Eye icon

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [secureText, setSecureText] = useState(true); // toggle for password

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Green Wave using SVG */}
      <Svg
        height="200"
        width={width}
        viewBox="0 0 1440 320"
        style={styles.greenWave}>
        <Path
          fill="#91C788"
          d="M0,160L48,154.7C96,149,192,139,288,144C384,149,480,171,576,165.3C672,160,768,128,864,106.7C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </Svg>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login to Dino</Text>

        {/* Email */}
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
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
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Text style={styles.inputIcon}>👁️</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Confirm and continue</Text>
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerText}>
            Don’t have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenWave: {
    position: 'absolute',
    top: 0,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 160,
  },
  title: {
    fontSize: 22,
    color: '#91C788',
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
  },
  loginButton: {
    backgroundColor: '#91C788',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  link: {
    color: '#91C788',
    fontWeight: 'bold',
  },
});
