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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const CreateProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const genders = ['Male', 'Female', 'Non'];

  // Formats phone number to (XXX) XXX-XXXX
  const formatPhoneNumber = value => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const area = digits.slice(0, 3);
    const mid = digits.slice(3, 6);
    const last = digits.slice(6, 10);

    if (digits.length < 4) {
      return `(${area}`;
    }
    if (digits.length < 7) {
      return `(${area}) ${mid}`;
    }
    return `(${area}) ${mid}-${last}`;
  };

  const handlePhoneChange = text => {
    const cleaned = text.replace(/\D/g, '');
    setPhone(formatPhoneNumber(cleaned));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{marginLeft: 20, marginTop: 10}}>
        <Text style={{fontSize: 15}}>{'<'}</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, {marginTop: 10}]}>Create account</Text>

      {/* Avatar + Gender selection */}
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
              <Text style={{color: selectedGender === g ? '#fff' : '#000'}}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name Input */}
      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Age Input */}
      <Text style={styles.label}>Your Age</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.inputField}
        placeholder="(XXX) XXX-XXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={handlePhoneChange}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
