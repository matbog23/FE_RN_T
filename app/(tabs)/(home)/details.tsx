import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import useReviews from '@/data/messages'; // Adjust the path as necessary

type RestaurantDetailsRouteParams = {
  restaurant: {
    _id: string;
    name: string;
    cuisine: string;
    location: {
      address: string;
      city: string;
    };
    tags: string[];
  };
};

const RestaurantDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RestaurantDetailsRouteParams }, 'params'>>();
  const { restaurant } = route.params;

  const { data: reviews, isLoading, isError } = useReviews(restaurant?._id);

  if (!restaurant) {
    return <Text>Restaurant not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.subtitle}>{restaurant.cuisine}</Text>
      <Text style={styles.body}>{restaurant.location.address}</Text>
      <Text style={styles.body}>{restaurant.location.city}</Text>
      <Text style={styles.body}>Tags: {restaurant.tags.join(', ')}</Text>

      <Text style={styles.sectionTitle}>Reviews</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isError ? (
        <Text style={styles.errorText}>Failed to load reviews</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.review}>
              <Text style={styles.reviewText}>{item.text}</Text>
              <Text style={styles.reviewSender}>- {item.sender.username}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  review: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reviewText: {
    fontSize: 16,
  },
  reviewSender: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default RestaurantDetailsScreen;
