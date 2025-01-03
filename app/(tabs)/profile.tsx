import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Image, TextInput, Switch, Button, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import useUserGet from '@/data/user-get';
import useUserPut from '@/data/user-put';
import GlobalStyles from '@/constants/GlobalStyles';

export default function ProfileScreen() {

  const router = useRouter();

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId'); // Clear stored user ID
      router.replace('/') // Navigate to the login screen
      console.log('logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const params = useLocalSearchParams();
  
  const { data, isLoading, isError } = useUserGet(params.userId);
  const { trigger, isMutating } = useUserPut(params.userId);

  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState(true); // Fake notifications switch

  useEffect(() => {
    if (data) {
      setUsername(data.username || '');
    }
  }, [data]);

  if (isMutating || isLoading || !data) {
    return <ThemedText>Loading...</ThemedText>;
  }

  const handleSave = () => {
    trigger({ username }); // Save only the username
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#FF0000' }}
      headerImage={
        <Image
          source={require('@/assets/images/Tomatoes.jpg')}
          style={styles.headerImage}
        />
      }
    >

      <ScrollView style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image source={require('../../assets/images/Meal.jpg')} style={styles.profilePicture} />
        </View>

        {/* Username */}
        <View style={GlobalStyles.card}>
          <ThemedText style={GlobalStyles.cardTitle}>Username</ThemedText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={GlobalStyles.cardSubtitle}
            placeholder="Enter your username"
          />
        </View>

        {/* Email (Non-editable) */}
        <View style={GlobalStyles.card}>
          <ThemedText style={GlobalStyles.cardTitle}>Email</ThemedText>
          <ThemedText style={GlobalStyles.cardSubtitle}>{data.email}</ThemedText>
        </View>

        {/* Notifications Toggle (Fake) */}
        <View style={GlobalStyles.card}>
          <ThemedText style={GlobalStyles.cardTitle}>Enable Notifications</ThemedText>
          <Switch
            value={notifications}
            onValueChange={setNotifications} // This won't be linked to anything
          />
        </View>

        {/* Save and Log Out */}
        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSave}/>
          <Button title="Log Out" color="#FF6347" onPress={handleLogout} />
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    padding: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
