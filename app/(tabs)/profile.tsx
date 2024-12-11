import { StyleSheet, Image, Platform, TextInput, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router'
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

import useUserGet from '@/data/user-get';
import useUserPut from '@/data/user-put';

export default function TabTwoScreen() {
  const params = useLocalSearchParams();

  console.log("params: ", params);
  
  const {data, isLoading, isError} = useUserGet(params.userId);
  const {trigger, isMutating} = useUserPut(params.userId);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (data) {
      setUsername(data.username);
    }
  }, [data]);

  if (isMutating || isLoading || !data) {
    return <ThemedText>Loading...</ThemedText>;
  }

  console.log("first: ", data.username);
  console.log("now: ", username);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#FF0000' }}
      /*headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>*/
      headerImage={<Image source={require('@/assets/images/walkingTroughGrass.jpg')} style={styles.headerImage}/>}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: 'SpaceGrotesk'}}>Profile</ThemedText>
      </ThemedView>
      <ThemedText type="defaultSemiBold">Hi there, Jon!</ThemedText>
      <ThemedText type="default">Welcome to your profile. The place where we just keep talking about you and some fake settings to test my developing capababilities</ThemedText>
      <ThemedText type='subtitle'>Settings</ThemedText>
      <Collapsible title="Personal information">
        <ThemedText type="defaultSemiBold">Username: </ThemedText>
          <TextInput value={username} onChangeText={setUsername}/>
          <Button title="Save" onPress={() => trigger({username})}/>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Email: </ThemedText>Jon@gmail.com
        </ThemedText>
      </Collapsible>
      <Collapsible title="System settings">
        <ThemedText>
          <ThemedText type="defaultSemiBold">mode: </ThemedText>light
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">privacy: </ThemedText> Off
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
