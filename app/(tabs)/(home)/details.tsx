import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import useReviews from '@/data/review-get';

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

  // Debugging the reviews data
  console.log('Reviews:', reviews);

  const renderStars = (rating: any) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 !== 0; // Determine if there's a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining empty stars

    return (
      <View style={styles.starsContainer}>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <Icon key={`full-${index}`} name="star" size={16} color="#FFD700" />
          ))}
        {halfStar && <Icon name="star-half-o" size={16} color="#FFD700" />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <Icon key={`empty-${index}`} name="star-o" size={16} color="#FFD700" />
          ))}
      </View>
    );
  };

  if (!restaurant) {
    return <Text style={styles.errorText}>Restaurant not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.subtitle}>{restaurant.cuisine}</Text>
      <Text style={styles.body}>{restaurant.location.address}</Text>
      <Text style={styles.body}>{restaurant.location.city}</Text>
      <Text style={styles.body}>Tags: {restaurant.tags?.join(', ') || 'No tags available'}</Text>

      <Text style={styles.sectionTitle}>Reviews</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00f" />
      ) : isError ? (
        <Text style={styles.errorText}>Failed to load reviews</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.review}>
              <Text style={styles.reviewText}>{item.comment || 'No comment available'}</Text>
              <Text style={styles.reviewSender}>- {item.user?.username || 'Anonymous'}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(item.rating)}
              </View>
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
    backgroundColor: '#000', // Ensures proper dark mode support
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFF',
  },
  body: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFF',
  },
  review: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Adjusted for better dark mode contrast
  },
  reviewText: {
    fontSize: 16,
    color: '#FFF',
  },
  reviewSender: {
    fontSize: 14,
    color: '#AAA', // Light gray for better readability in dark mode
  },
  errorText: {
    fontSize: 16,
    color: '#F66', // Softer red for dark mode
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFF',
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
});

export default RestaurantDetailsScreen;
