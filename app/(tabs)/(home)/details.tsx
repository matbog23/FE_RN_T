import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { RouteProp } from '@react-navigation/native';

type RestaurantDetailsRouteParams = {
  restaurant: {
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
    const { restaurant } = route.params;  // Access the full restaurant object passed from the Home Screen
    console.log ('Restaurant details:', restaurant);
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
      </View>
    );
  };
  
  
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      color: '#FFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
      color: '#FFF',
    },
    body: {
      fontSize: 16,
      marginBottom: 10,
      color: '#FFF',
    }
  });
  
  export default RestaurantDetailsScreen;