/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#156a17';
const tintColorDark = '#FF5722';

export const Colors = {
  light: {
    text: '#1A1A1A', // Darker for better contrast
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#444', // Slightly darker for visibility
    tabIconDefault: '#8C8C8C',
    tabIconSelected: tintColorLight,
    button: '#156a17',
    buttonText: '#FFFFFF',
    cardBackground: '#F9F9F9', // Light gray for subtle contrast
    divider: '#E0E0E0', // Neutral divider color
  },
  dark: {
    text: '#ECEDEE', // Kept bright for readability
    background: '#151718',
    tint: tintColorDark,
    icon: '#FF5722', // Matches the tint for consistency
    tabIconDefault: '#757575',
    tabIconSelected: tintColorDark,
    button: '#FF5722',
    buttonText: '#151718', // Matches dark mode background
    cardBackground: '#1F1F1F', // Slightly lighter than the background
    divider: '#2C2C2C', // Subtle divider color for dark mode
  },
};
