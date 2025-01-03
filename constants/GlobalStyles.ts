import { StyleSheet } from 'react-native';

const colors = {
  background: '#121212',
  cardBackground: '#1C1C1C',
  primaryText: '#FFFFFF',
  secondaryText: '#AAAAAA',
  accent: '#FF5722',
  buttonBackground: '#FF5722',
  buttonText: '#FFFFFF',
  divider: '#444444',
};

const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
};

const GlobalStyles = StyleSheet.create({
  // Global Container Style
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  // Section Header
  sectionHeader: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.primaryText,
    marginBottom: 10,
  },

  // Text Styles
  primaryText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: fontWeights.regular,
  },
  secondaryText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: fontWeights.light,
  },

  // Buttons
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: fontWeights.medium,
  },

  // Cards
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.primaryText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 10,
  },

  // Tag Style
  tag: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: fontWeights.medium,
  },
});

export default GlobalStyles;
