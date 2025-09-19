import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import {useAuth} from '../../context/AuthContext';

const {width, height} = Dimensions.get('window');

const CreateProfileScreen = () => {
  const navigation = useNavigation();
  const {updateProfile} = useAuth();
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [loading, setLoading] = useState(false);

  const genders = ['Male', 'Female', 'Non'];

  const handleNext = async () => {
    if (!name.trim() || !selectedGender || !age.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        gender: selectedGender,
        age: parseInt(age, 10),
        phone: phone.trim(),
      });

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('Main')},
        ]);
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
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 30}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginLeft: 20, marginTop: 10}}>
              <Text style={{fontSize: 15}}>{'<'}</Text>
            </TouchableOpacity>

            <Text style={[styles.title, {marginTop: 10}]}>Create account</Text>

            <View style={{alignItems: 'center', marginVertical: 10}}>
              <Image
                source={require('../../assets/icons/Mustafa.png')}
                style={styles.avatar}
                resizeMode="contain"
              />
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                {genders.map(g => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setSelectedGender(g)}
                    style={[
                      styles.genderButton,
                      selectedGender === g && styles.genderSelected,
                    ]}>
                    <Text
                      style={{color: selectedGender === g ? '#fff' : '#000'}}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Your Age</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />

            <Text style={styles.label}>Phone number</Text>
            <View style={styles.phoneRow}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withEmoji
                withCallingCodeButton
                onSelect={country => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
              />
              <TextInput
                style={styles.inputFieldFlex}
                placeholder="(XXX) XXX-XXXX"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && {opacity: 0.6}]}
              onPress={handleNext}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Next'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.08,
    color: '#91C788',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: height * 0.04,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  genderLabel: {
    marginTop: 10,
    fontSize: width * 0.045,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  genderSelected: {
    backgroundColor: '#91C788',
    borderColor: '#91C788',
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.008,
    marginLeft: width * 0.05,
  },
  inputField: {
    backgroundColor: '#CFE7CB',
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  inputFieldFlex: {
    backgroundColor: '#CFE7CB',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: width * 0.045,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#91C788',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.015,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.045,
  },
});

export default CreateProfileScreen;
