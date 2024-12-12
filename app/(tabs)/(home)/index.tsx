import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import useRestaurantGet from '@/data/restaurant-get';
import { ThemedText } from '@/components/ThemedText';
import FoodCard from '@/components/FoodCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Fuse from 'fuse.js';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Fuzzy search setup using Fuse.js
  const fuse = new Fuse(restaurants || [], {
    keys: ['name', 'cuisine', 'location.city'], // Specify fields to search
    threshold: 0.4, // Adjust for tolerance to typos
  });

  console.log('Restaurant Data:', restaurants);

  // Filter restaurants based on search query and tag
  const filteredRestaurants = (searchQuery
    ? fuse.search(searchQuery).map((result) => result.item) // Apply fuzzy search first
    : restaurants // No search query, use all restaurants
  )?.filter((restaurant: any) => {
    // Filter by selected tag
    return selectedTag === 'All' || restaurant.tags?.includes(selectedTag);
  });

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

      <ThemedText type="title">Discover</ThemedText>
      
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Tag Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagContainer}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTag === tag && styles.selectedTag]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text style={[styles.tagText, selectedTag === tag && styles.selectedTagText]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Highlighted Food Cards */}
      {filteredRestaurants?.length > 0 ? (
        filteredRestaurants.map((restaurant: any, index: any) => (
          <FoodCard
            key={restaurant._id}
            imageUrl={HARDCODED_IMAGES[index % HARDCODED_IMAGES.length]} // Assign hardcoded images
            title={restaurant.name}
            subtitle={`${restaurant.cuisine} - ${restaurant.location.city}`}
            restaurant={restaurant} // Pass the entire restaurant object
          />


        ))
      ) : (
        <ThemedText>No restaurants found.</ThemedText>
      )}
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
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
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
    backgroundColor: '#FFE3CE',
  },
  tagText: {
    color: '#000',
    fontSize: 14,
  },
  selectedTagText: {
    color: '#DF6800',
    fontWeight: 'bold',
  },
});
