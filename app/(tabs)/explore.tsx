import { View, SafeAreaView, StyleSheet, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import useMessages from '@/data/messages.js';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
/*import { ThemedView } from '@/components/ThemedView';
import FoodCard from '@/components/FoodCard';*/

export default function HomeScreen() {
  const {data, isLoading, isError} = useMessages();

  console.log(data);

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (isError) {
    return <ThemedText>An error has occured.</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#FF0000' }}
      headerImage={
        <Image
          source={require('@/assets/images/Tomatoes.jpg')}
          style={styles.headerImage}
        />
      }>
      <View>
        <ThemedText type="title" style={styles.titleContainer}>Home</ThemedText>
        {data.map((message: any) => (<ThemedText type="tagline" key={message._id}>{message.text}</ThemedText>))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
