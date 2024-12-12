import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the prop types for the FoodCard component
interface FoodCardProps {
  imageUrl: any;  // URL of the image
  title: string;     // Title of the card (e.g., food name)
  subtitle: string;  // Subtitle (e.g., like cuisine and city)
  restaurant: any; // Pass the entire restaurant object
}

const FoodCard: React.FC<FoodCardProps> = ({ imageUrl, title, subtitle, restaurant }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to the details screen with the restaurant object as a parameter
    navigation.navigate('details', { restaurant }); // Ensure 'restaurant' is being passed
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <ImageBackground source={imageUrl} style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin: 8,
    minWidth: 240,
    width: 'auto',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
  },
});

export default FoodCard;
