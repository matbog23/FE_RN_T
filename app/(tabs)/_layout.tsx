import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {

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
      <Tabs.Screen name="(home)"  options={{
        headerShown: false, title: 'Home', tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ), }} />
      <Tabs.Screen name="explore" options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}/>
      <Tabs.Screen name="profile" options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'man' : 'man-outline'} color={color} />
          ),
        }}/>
    </Tabs>
  );
}