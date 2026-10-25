import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 7, paddingHorizontal: 14 };
      case 'large':
        return { paddingVertical: 15, paddingHorizontal: 26 };
      default:
        return { paddingVertical: 11, paddingHorizontal: 20 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12.5;
      case 'large':
        return 15.5;
      default:
        return 14;
    }
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.primaryTextOnFill : COLORS.primary}
        />
      ) : (
        <>
          {icon && (
            <View
              style={[
                styles.iconWrapper,
                variant === 'primary' ? styles.primaryIconPill : styles.outlineIconPill,
              ]}
            >
              {icon}
            </View>
          )}
          <Text
            style={[
              styles.text,
              { fontSize: getFontSize() },
              variant === 'primary' && styles.textPrimary,
              variant === 'outline' && styles.textOutline,
              variant === 'secondary' && styles.textSecondary,
              variant === 'danger' && styles.textDanger,
              variant === 'ghost' && styles.textGhost,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={loading || disabled}
        activeOpacity={0.84}
        style={[styles.container, styles.primaryShadow, style]}
      >
        <LinearGradient
          colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, getPadding()]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        styles.base,
        getPadding(),
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.38)',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: RADIUS.full,
    gap: SPACING.sm,
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  secondary: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  outline: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
  },
  danger: {
    backgroundColor: COLORS.dangerMuted,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.32)',
    borderTopColor: 'rgba(248, 113, 113, 0.5)',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.42,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryIconPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineIconPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  textPrimary: {
    color: COLORS.primaryTextOnFill,
    fontWeight: '700',
  },
  textOutline: {
    color: COLORS.text,
  },
  textSecondary: {
    color: COLORS.text,
  },
  textDanger: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  textGhost: {
    color: COLORS.textMuted,
  },
});
