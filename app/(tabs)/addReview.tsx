import React, { useState, useEffect } from 'react'; 
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '@/constants/GlobalStyles';
import Slider from '@react-native-community/slider';
import { API_URL } from '@/constants/Api';

export default function AddReviewScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState(3);
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
  const handleSelectRestaurant = (restaurant) => {
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
      <ParallaxScrollView
            headerBackgroundColor={{ light: '#121212', dark: '#151718' }}
          >
      <ScrollView contentContainerStyle={[GlobalStyles.container, { flexGrow: 1}]}>
        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.cardTitle}>Restaurant Name</Text>
          <TextInput
            style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
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
              style={GlobalStyles.card}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectRestaurant(item)}
                >
                  <Text style={GlobalStyles.primaryText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.cardTitle}>Location</Text>
          <TextInput
            style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            placeholderTextColor="#888"
            returnKeyType="next"
          />
          <TextInput
            style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
            placeholderTextColor="#888"
            returnKeyType="next"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <TextInput
              style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', flex: 1, marginRight: 8 }]}
              value={lat}
              onChangeText={setLat}
              keyboardType="numeric"
              placeholder="Enter latitude"
              placeholderTextColor="#888"
              returnKeyType="next"
            />
            <TextInput
              style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', flex: 1 }]}
              value={lng}
              onChangeText={setLng}
              keyboardType="numeric"
              placeholder="Enter longitude"
              placeholderTextColor="#888"
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.cardTitle}>Details</Text>
          <TextInput
            style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
            value={cuisine}
            onChangeText={setCuisine}
            placeholder="Enter cuisine type"
            placeholderTextColor="#888"
            returnKeyType="next"
          />
          <TextInput
            style={[GlobalStyles.cardSubtitle, { backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags (e.g., vegan, family-friendly)"
            placeholderTextColor="#888"
            returnKeyType="next"
          />
        </View>

        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.cardTitle}>Rating and Comment</Text>
          <View style={{ marginBottom: 16 }}>
            <Text style={GlobalStyles.primaryText}>Rating: {rating}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={GlobalStyles.primaryText}>1</Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 8 }}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={rating}
                onValueChange={(value) => setRating(value)}
                minimumTrackTintColor="#FF5722"
                maximumTrackTintColor="#888"
              />
              <Text style={GlobalStyles.primaryText}>5</Text>
            </View>
          </View>
          <TextInput
            style={[GlobalStyles.cardSubtitle, { height: 100, backgroundColor: '#222', color: '#FFF', padding: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444', marginBottom: 10 }]}
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="Enter your comment"
            placeholderTextColor="#888"
            returnKeyType="done"
          />
        </View>

        <Button title="Save Review" onPress={handleSave} />
      </ScrollView>
      </ParallaxScrollView>
    </TouchableWithoutFeedback>
  );
}
