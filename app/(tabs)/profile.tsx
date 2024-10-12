import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
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
        <ThemedText>
          <ThemedText type="defaultSemiBold">Username: </ThemedText>Jon
        </ThemedText>
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
