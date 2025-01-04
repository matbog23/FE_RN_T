import React, { useEffect } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { API_URL } from '@/constants/Api';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import GlobalStyles from '@/constants/GlobalStyles';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        router.replace('/(tabs)');
      }
    };

    checkLogin();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const authUrl = `${API_URL}/auth/google`;
      const redirectUrl = AuthSession.makeRedirectUri();

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success' && result.url) {
        const params = new URL(result.url).searchParams;
        const user = params.get('user');

        if (user) {
          await AsyncStorage.setItem('userId', user);
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Authentication canceled or failed');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to authenticate with Google');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Pattern */}
      <Svg height="100%" width="100%" style={styles.backgroundPattern}>
        <Path
          d="M0,200 C150,100 350,300 500,200 C650,100 850,300 1000,200 L1000,0 L0,0 Z"
          fill="#FF5722"
          opacity="0.2"
        />
      </Svg>

      <View style={styles.container}>
        {/* App Name */}
        <Text style={styles.appName}>Restoview</Text>

        {/* Login Button */}
        <View style={styles.loginCard}>
          <FontAwesome name="google" size={40} color={GlobalStyles.primaryText} style={styles.icon} />
          <TouchableOpacity onPress={() => handleGoogleLogin()} style={GlobalStyles.button}>
            <Text style={GlobalStyles.primaryText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GlobalStyles.container.backgroundColor,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: GlobalStyles.primaryText.color,
    marginBottom: 40,
  },
  loginCard: {
    width: '100%',
    maxWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: GlobalStyles.card.backgroundColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
    color: GlobalStyles.primaryText.color
  },
});
