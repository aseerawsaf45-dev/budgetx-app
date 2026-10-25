import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface BackButtonProps {
  fallbackScreen?: string;
  fallbackTab?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
}

export function BackButton({
  fallbackScreen = 'MainTabs',
  fallbackTab = 'Home',
  onPress,
  style,
  color = COLORS.text,
  size = 19,
}: BackButtonProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (fallbackScreen === 'MainTabs' && fallbackTab) {
        navigation.navigate('MainTabs', { screen: fallbackTab });
      } else {
        navigation.navigate(fallbackScreen);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <ArrowLeft color={color} size={size} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    minWidth: 38,
    minHeight: 38,
    flexShrink: 0,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease',
      },
    }),
  },
});
