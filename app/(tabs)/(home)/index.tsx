import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import FoodCard from '@/components/FoodCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Fuse from 'fuse.js';
import GlobalStyles from '@/constants/GlobalStyles';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '@/constants/Api';

const TAGS = ['All','Meat', 'Pasta', 'Pizza', 'Fish', 'Vegetarian', 'Vegan'];

const HARDCODED_IMAGES = [
  require('@/assets/images/Lobster.jpg'),
  require('@/assets/images/Oysters.jpg'),
  require('@/assets/images/Meal.jpg'),
  require('@/assets/images/Tomatoes.jpg'),
];

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({});
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants`);
        const data = await res.json();
        setRestaurants(data);

        // Fetch reviews for each restaurant
        const reviewsData = {};
        for (const restaurant of data) {
          const reviewsRes = await fetch(`${API_URL}/reviews/${restaurant._id}`);
          const reviews = await reviewsRes.json();
          reviewsData[restaurant._id] = reviews;
        }
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const fuse = new Fuse(restaurants || [], {
    keys: ['name', 'cuisine', 'location.city'],
    threshold: 0.4,
  });

  const filteredRestaurants = (searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : restaurants
  )?.filter((restaurant) => {
    return selectedTag === 'All' || restaurant.tags?.includes(selectedTag);
  }).map((restaurant) => {
    const restaurantReviews = reviews[restaurant._id] || [];
    const totalRatings = restaurantReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = restaurantReviews.length
      ? (totalRatings / restaurantReviews.length).toFixed(1)
      : null;
    return { ...restaurant, averageRating };
  });

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (isError) {
    return <ThemedText>An error has occurred.</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#FF0000' }}
      headerImage={<Image source={require('@/assets/images/Tomatoes.jpg')} style={GlobalStyles.headerImage} />}
    >
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

      {filteredRestaurants?.length > 0 ? (
        filteredRestaurants.map((restaurant, index) => (
          <FoodCard
            key={restaurant._id}
            imageUrl={HARDCODED_IMAGES[index % HARDCODED_IMAGES.length]}
            title={restaurant.name}
            subtitle={`${restaurant.cuisine} - ${restaurant.location.city}`}
            averageRating={restaurant.averageRating}
            restaurant={restaurant}
          />
        ))
      ) : (
        <ThemedText>No restaurants found.</ThemedText>
      )}
    </ParallaxScrollView>
  );
}
