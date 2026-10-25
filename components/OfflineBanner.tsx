import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity } from 'react-native';
import { WifiOff, Wifi, CloudOff, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      return window.navigator.onLine !== false;
    }
    return true;
  });

  const [hasBeenOffline, setHasBeenOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const reconnectedTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      if (hasBeenOffline) {
        setShowReconnected(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();

        if (reconnectedTimeoutRef.current) {
          clearTimeout(reconnectedTimeoutRef.current);
        }
        reconnectedTimeoutRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            setShowReconnected(false);
          });
        }, 3200);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasBeenOffline(true);
      setShowReconnected(false);
      if (reconnectedTimeoutRef.current) {
        clearTimeout(reconnectedTimeoutRef.current);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!window.navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectedTimeoutRef.current) {
        clearTimeout(reconnectedTimeoutRef.current);
      }
    };
  }, [hasBeenOffline, fadeAnim]);

  if (isOnline && !showReconnected) {
    return null;
  }

  const isReconnected = isOnline && showReconnected;

  return (
    <Animated.View
      style={[
        styles.container,
        isReconnected ? styles.reconnectedBorder : styles.offlineBorder,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.contentRow}>
        <View style={[styles.statusDot, isReconnected ? styles.dotGreen : styles.dotAmber]} />
        {isReconnected ? (
          <CheckCircle size={15} color="#38E586" strokeWidth={2.4} />
        ) : (
          <WifiOff size={15} color="#FBBF24" strokeWidth={2.4} />
        )}

        <Text style={styles.messageText}>
          {isReconnected ? (
            <Text>
              <Text style={styles.boldText}>Back Online</Text> — Local data synced
            </Text>
          ) : (
            <Text>
              <Text style={styles.boldText}>Offline Mode</Text> — All expenses & calculations saved locally
            </Text>
          )}
        </Text>

        <View style={[styles.badge, isReconnected ? styles.badgeGreen : styles.badgeAmber]}>
          <Text style={[styles.badgeText, isReconnected ? styles.badgeTextGreen : styles.badgeTextAmber]}>
            {isReconnected ? 'ACTIVE' : 'SAVING LOCALLY'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    paddingVertical: 9,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: '#0D111C',
    borderWidth: 1,
    zIndex: 9999,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.45)',
      },
    }),
  },
  offlineBorder: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  reconnectedBorder: {
    borderColor: 'rgba(56, 229, 134, 0.35)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotAmber: {
    backgroundColor: '#FBBF24',
  },
  dotGreen: {
    backgroundColor: '#38E586',
  },
  messageText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontFamily: 'Outfit_500Medium',
  },
  boldText: {
    fontFamily: 'Outfit_700Bold',
    color: '#FFFFFF',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgeGreen: {
    backgroundColor: 'rgba(56, 229, 134, 0.15)',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Outfit_700Bold',
    letterSpacing: 0.5,
  },
  badgeTextAmber: {
    color: '#FBBF24',
  },
  badgeTextGreen: {
    color: '#38E586',
  },
});
