import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TextInput, Switch, Button, View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useUserGet from '@/data/user-get';
import useUserPut from '@/data/user-put';

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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Profile</ThemedText>
      </ThemedView>

      <ScrollView style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image source={require('../../assets/images/Meal.jpg')} style={styles.profilePicture} />
        </View>

        {/* Username */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Enter your username"
          />
        </View>

        {/* Email (Non-editable) */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.nonEditableField}>{data.email}</ThemedText>
        </View>

        {/* Notifications Toggle (Fake) */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Enable Notifications</ThemedText>
          <Switch
            value={notifications}
            onValueChange={setNotifications} // This won't be linked to anything
          />
        </View>

        {/* Save and Log Out */}
        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSave} />
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
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  title: {
    fontFamily: 'SpaceGrotesk',
    fontSize: 24,
    color: '#FFF',
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
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#444',
  },
  nonEditableField: {
    color: '#AAA',
    fontSize: 16,
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
