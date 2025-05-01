import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const HomeScreen = () => {
  const [isSilent, setIsSilent] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/icons/Mustafa.png')}
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hi , Mus</Text>

        <TouchableOpacity onPress={() => setIsSilent(!isSilent)}>
          <Text style={styles.bell}>{isSilent ? '🔕' : '🔔'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  bell: {
    fontSize: 20,
  },
});

export default HomeScreen;
