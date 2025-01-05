import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import useReviews from '@/data/review-get';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '@/constants/GlobalStyles';

const RestaurantDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: { restaurant: any } }, 'params'>>();
  const { restaurant } = route.params;

  const { data: reviews, isLoading, isError } = useReviews(restaurant?._id);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starsContainer}>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <Icon key={`full-${index}`} name="star" size={16} color="#FFD700" style={styles.star} />
          ))}
        {halfStar && <Icon name="star-half-o" size={16} color="#FFD700" style={styles.star} />}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <Icon key={`empty-${index}`} name="star-o" size={16} color="#FFD700" style={styles.star} />
          ))}
      </View>
    );
  };

  if (!restaurant) {
    return <Text style={GlobalStyles.errorText}>Restaurant not found.</Text>;
  }

  return (
    <View style={GlobalStyles.container}>

      {/* Restaurant Information */}
      <Text style={GlobalStyles.sectionHeader}>Restaurant Information</Text>
      <View style={[GlobalStyles.card, styles.infoCard]}>
        <Text style={GlobalStyles.cardTitle}>{restaurant.name} - {restaurant.averageRating ? `⭐ ${restaurant.averageRating}` : 'No ratings yet'}</Text>
        <View style={styles.infoRow}>
          <Icon name="cutlery" size={16} color="#FFF" style={styles.infoIcon} />
          <Text style={GlobalStyles.cardSubtitle}>{restaurant.cuisine}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={16} color="#FFF" style={styles.infoIcon} />
          <Text style={GlobalStyles.primaryText}>{restaurant.location.address}, {restaurant.location.city}</Text>
        </View>
        <Text style={GlobalStyles.secondaryText}>Tags: {restaurant.tags?.join(', ') || 'No tags available'}</Text>
      </View>

      {/* Reviews Section */}
      <Text style={GlobalStyles.sectionHeader}>Customer Reviews</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={GlobalStyles.accent} />
      ) : isError ? (
        <Text style={GlobalStyles.errorText}>Failed to load reviews</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[GlobalStyles.card, styles.reviewCard]}>
              <Text style={GlobalStyles.primaryText}>{item.comment || 'No comment available'}</Text>
              <Text style={GlobalStyles.secondaryText}>- {item.user?.username || 'Anonymous'}</Text>
              <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  infoCard: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  reviewCard: {
    marginVertical: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  star: {
    marginHorizontal: 2,
  },
});

export default RestaurantDetailsScreen;
