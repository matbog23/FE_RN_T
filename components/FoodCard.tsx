import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

interface FoodCardProps {
  imageUrl: any;  // URL of the image
  title: string;     // Title of the card (e.g., food name)
  subtitle: string;  // Subtitle (e.g., like percentage)
  href: string;     // URL to navigate to (either internal route or external URL)
}

const FoodCard: React.FC<FoodCardProps> = ({ imageUrl, title, subtitle, href }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (href.startsWith('http') || href.startsWith('https')) {
      // Open external link
      Linking.openURL(href).catch(err => console.error("Failed to open URL:", err));
    } else {
      // Navigate to an internal screen
      navigation.navigate(href as never); // Ensure your `href` value is a valid route name
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <Image source={imageUrl} style={styles.image} />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
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
    margin: 10,
    minWidth: 240,
    width: 'auto',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default FoodCard;
