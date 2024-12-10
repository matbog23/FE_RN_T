import { View, SafeAreaView, StyleSheet, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import useMessages from '@/data/messages.js';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FoodCard from '@/components/FoodCard';

export default function HomeScreen() {
  const {data, isLoading, isError} = useMessages();

  console.log(data);

  if (isLoading || !data) {
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title"  style={{ fontFamily: 'SpaceGrotesk' }}>Welcome, Jon!</ThemedText>
        
        <HelloWave />
      </ThemedView>
      <ThemedText type="tagline">{Platform.select({ ios: "We noticed you're using an ios device", android: "We noticed you're using an android device" , web: "We noticed you're on the web"})} btw!</ThemedText>
      <ThemedText type="subtitle">Popular</ThemedText>
      <ThemedText type="defaultSemiBold">Most popular restaurants</ThemedText>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

          <FoodCard 
            imageUrl={require("@/assets/images/Lobster.jpg")}
            title="Lobsterman Antwerp"
            subtitle="96% like"
            href="details"
          />
          <FoodCard
            imageUrl={require("@/assets/images/Oysters.jpg")}
            title="Oesterput"
            subtitle="93% like"
            href="details"
            />
          <FoodCard 
            imageUrl={require("@/assets/images/Meal.jpg")}
            title="Fiera"
            subtitle="87% like"
            href="details"
          />

          </ScrollView>
            
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recommended</ThemedText>
          <ThemedText type="defaultSemiBold">Highest rated restaurants</ThemedText>
          <FoodCard 
            imageUrl={require("@/assets/images/Lobster.jpg")}
            title="Lobsterman Antwerp"
            subtitle="96% like"
            href="details"
          />
          <FoodCard 
            imageUrl={require("@/assets/images/Oysters.jpg")}
            title="Oesterput"
            subtitle="93% like"
            href="details"
          />
          <FoodCard 
            imageUrl={require("@/assets/images/Meal.jpg")}
            title="Fiera"
            subtitle="87% like"
            href="details"
          />
        </ThemedView>
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
