import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@/constants/Api'

export default function AddReviewScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  // Fetch matching restaurants for autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (restaurantName.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/restaurants?name=${encodeURIComponent(restaurantName)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // Debounce API calls
    return () => clearTimeout(debounceTimeout);
  }, [restaurantName]);

  // Handle selecting a restaurant from suggestions
  const handleSelectRestaurant = (restaurant: any) => {
    setRestaurantName(restaurant.name);
    setAddress(restaurant.location.address || '');
    setCity(restaurant.location.city || '');
    setLat(restaurant.location.coordinates?.lat?.toString() || '');
    setLng(restaurant.location.coordinates?.lng?.toString() || '');
    setCuisine(restaurant.cuisine || '');
    setTags((restaurant.tags || []).join(', '));
    setSuggestions([]); // Clear suggestions
  };

  const handleSave = async () => {
    try {
      const user = await AsyncStorage.getItem('userId');
      if (!user) {
        throw new Error('User not logged in. Please log in to add a review.');
      }

      const userId = JSON.parse(user).id; // Extract the user ID
      let restaurantId;

      // Check if restaurant already exists
      const existingRestaurantResponse = await fetch(
        `${API_URL}/restaurants?name=${encodeURIComponent(restaurantName)}`
      );
      if (!existingRestaurantResponse.ok) {
        console.error(`Failed to check existing restaurants: ${existingRestaurantResponse.statusText}`);
        throw new Error('Failed to check for existing restaurants.');
      }
      const existingRestaurants = await existingRestaurantResponse.json();

      if (existingRestaurants.length > 0) {
        // Use existing restaurant ID
        restaurantId = existingRestaurants[0]._id;
        console.log('Existing restaurant found:', restaurantId);
      } else {
        // Create a new restaurant
        const restaurantData = {
          name: restaurantName,
          location: {
            address,
            city,
            coordinates: {
              lat: parseFloat(lat) || null,
              lng: parseFloat(lng) || null,
            },
          },
          cuisine,
          tags: tags.split(',').map((tag) => tag.trim()),
          createdAt: new Date().toISOString(),
        };

        console.log('Creating new restaurant:', restaurantData);

        const restaurantResponse = await fetch(`${API_URL}/restaurants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restaurantData),
        });

        if (!restaurantResponse.ok) {
          console.error(`Failed to create restaurant: ${restaurantResponse.statusText}`);
          throw new Error('Failed to create restaurant.');
        }

        const newRestaurant = await restaurantResponse.json();
        restaurantId = newRestaurant._id;
        console.log('New restaurant created:', restaurantId);
      }

      // Add the review
      const reviewData = {
        rating: Number(rating),
        comment,
        user: userId, // Use only the user ID
      };

      console.log('Adding review:', reviewData);

      const reviewResponse = await fetch(`${API_URL}/reviews/${restaurantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!reviewResponse.ok) {
        console.error(`Failed to add review: ${reviewResponse.statusText}`);
        throw new Error('Failed to add review.');
      }

      console.log('Review added successfully');
      Alert.alert('Success', 'Review added successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', error.message || 'Failed to save review. Please try again.');
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Restaurant Name</Text>
        <TextInput
          style={styles.input}
          value={restaurantName}
          onChangeText={setRestaurantName}
          placeholder="Enter restaurant name"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item._id}
            style={styles.suggestionsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectRestaurant(item)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>Latitude (optional)</Text>
        <TextInput
          style={styles.input}
          value={lat}
          onChangeText={setLat}
          keyboardType="numeric"
          placeholder="Enter latitude"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>Longitude (optional)</Text>
        <TextInput
          style={styles.input}
          value={lng}
          onChangeText={setLng}
          keyboardType="numeric"
          placeholder="Enter longitude"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>Cuisine</Text>
        <TextInput
          style={styles.input}
          value={cuisine}
          onChangeText={setCuisine}
          placeholder="Enter cuisine type"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="Enter tags (e.g., vegan, family-friendly)"
          placeholderTextColor="#888"
          returnKeyType="next"
        />

        <Text style={styles.label}>Rating (1-5)</Text>
        <TextInput
          style={styles.input}
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          placeholder="Enter rating"
          placeholderTextColor="#888"
          returnKeyType="done"
        />

        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          multiline
          placeholder="Enter your comment"
          placeholderTextColor="#888"
          returnKeyType="done"
        />

        <Button title="Save Review" onPress={handleSave} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#222',
    color: '#FFF',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  suggestionsContainer: {
    maxHeight: 120,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  suggestionText: {
    color: '#FFF',
  },
});
