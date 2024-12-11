import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import useRestaurantGet from '@/data/restaurant-get';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import FoodCard from '@/components/FoodCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HelloWave } from '@/components/HelloWave';

const TAGS = ['All', 'Meat', 'Vegan', 'Popular'];

// Hardcoded images to assign to restaurants
const HARDCODED_IMAGES = [
  require('@/assets/images/Lobster.jpg'),
  require('@/assets/images/Oysters.jpg'),
  require('@/assets/images/Meal.jpg'),
  require('@/assets/images/Tomatoes.jpg'), // Add more images as needed
];

export default function HomeScreen() {
  const { data: restaurants, isLoading, isError } = useRestaurantGet();
  const [selectedTag, setSelectedTag] = useState('All');

  // Filter restaurants based on the selected tag
  const filteredRestaurants = restaurants?.filter(
    (restaurant: any) => selectedTag === 'All' || restaurant.tags?.includes(selectedTag)
  );

  if (isLoading || !restaurants) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (isError) {
    return <ThemedText>An error has occurred.</ThemedText>;
  }

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
        <ThemedText type="title" style={{ fontFamily: 'SpaceGrotesk' }}>
          Welcome, {restaurants[0]?.username || 'Guest'}!
        </ThemedText>
        <HelloWave />
      </ThemedView>
      

      {/* Recommended Section */}
      <ThemedView style={styles.cardsContainer}>
        <ThemedText type="title">Explore</ThemedText>
        {restaurants.slice(0, 3).map((restaurant: any, index: any) => (
          <FoodCard
            key={restaurant._id}
            imageUrl={HARDCODED_IMAGES[index % HARDCODED_IMAGES.length]} // Assign hardcoded images
            title={restaurant.name}
            subtitle={`${restaurant.cuisine} - ${restaurant.location.city}`}
            href="details"
          />
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  cardsContainer: {
    gap: 2,
    marginBottom: 2,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tag: {
    padding: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedTag: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#000',
    fontSize: 14,
  },
  selectedTagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
