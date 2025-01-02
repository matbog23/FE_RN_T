import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function TabLayout() {

  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const getUserId = async () => {
        const user = await AsyncStorage.getItem('userId');
        if (user) {
            const parsedUser = JSON.parse(user);
            const userId = parsedUser.id;
            console.log(userId);
            setUserId(userId);
        }
    }
    getUserId();
}, []);

  if (!userId) {
    return null;
  }

  return (
    <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen name="(home)" initialParams={{ userId }} options={{
        headerShown: false, title: 'Home', tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ), }} />
      <Tabs.Screen
        name="addReview"
        initialParams={{ userId }}
        options={{
          title: 'Add Review',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'create' : 'create-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="profile" initialParams={{ userId }} options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'man' : 'man-outline'} color={color} />
          ),
        }}/>
    </Tabs>
  );
}