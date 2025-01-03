import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import useRestaurantGet from '@/data/restaurant-get';
import { ThemedText } from '@/components/ThemedText';
import FoodCard from '@/components/FoodCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Fuse from 'fuse.js';
import GlobalStyles from '@/constants/GlobalStyles';
import { FontAwesome } from '@expo/vector-icons';

const TAGS = ['All', 'Popular', 'Recommended', 'Fish', 'Meat', 'Vegan'];

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
          style={GlobalStyles.headerImage}
        />
      }
    >
      {/* Search Bar */}
      <View style={{ marginHorizontal: 16, marginTop: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 5, borderWidth: 1, borderColor: '#444' }}>
        <TextInput
          style={[GlobalStyles.cardSubtitle, { flex: 1, padding: 10, color: '#FFF' }]}
          placeholder="Search restaurants..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholderTextColor="#888"
        />
        <FontAwesome name="search" size={20} color="#FFF" style={{ padding: 10 }} />
      </View>

      {/* Tag Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[GlobalStyles.tagContainer, { marginHorizontal: 16 }]}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[GlobalStyles.tag, selectedTag === tag && GlobalStyles.selectedTag]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text style={[GlobalStyles.tagText, selectedTag === tag && GlobalStyles.selectedTagText]}>
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
