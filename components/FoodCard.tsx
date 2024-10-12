import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface FoodCardProps {
  imageUrl: any;  // URL of the image
  title: string;     // Title of the card (e.g., food name)
  subtitle: string;  // Subtitle (e.g., like percentage)
}

const FoodCard: React.FC<FoodCardProps> = ({ imageUrl, title, subtitle }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
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
