import { Tabs } from 'expo-router';
import { Bus, Home, Settings } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Themes from '../Styles/TheStyle.style';
import AppProvider from '../context/useContext';
// --- THEME CONSTANTS ---
const ACCENT_COLOR = '#00c6ff';
const DARK_BG = '#0f2027';
const CARD_BG = '#1b323c';
const GLASS_BG = 'rgba(27, 50, 60, 0.9)';

const { BUTTON_BG, BUTTON_TEXT } = Themes.authentication;
// --- Custom Icon Component with Enhanced Animations ---
const TabBarIcon = ({ IconComponent, color, size, focused, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (focused) {
      // Bounce animation when focused
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations when not focused
      scaleAnim.setValue(1);
      bounceAnim.setValue(0);
    }
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim }
          ]
        }
      ]}
    >
      <View style={[
        styles.iconWrapper,
        focused && styles.activeCapsule
      ]}>
        <IconComponent
          color={focused ? DARK_BG : color}
          size={size ?? 24}
          fill={focused ? BUTTON_TEXT : 'transparent'}
        />
      </View>

      {/* Active indicator dot */}
      {focused && (
        <Animated.View style={[
          styles.activeDot,
          {
            opacity: scaleAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]} />
      )}
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: BUTTON_TEXT,
          tabBarInactiveTintColor: BUTTON_BG,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                IconComponent={Home}
                color={color}
                size={size}
                focused={focused}
                index={0}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="bus"
          options={{
            title: 'Bus',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                IconComponent={Bus}
                color={color}
                size={size}
                focused={focused}
                index={1}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                IconComponent={Settings}
                color={color}
                size={size}
                focused={focused}
                index={2}
              />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // Glass morphism effect
    backgroundColor: BUTTON_TEXT,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 20,
    paddingTop: 12,
    position: 'absolute',
    bottom: 2,
    left: 20,
    right: 20,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 10,
    width: '60%',
    borderWidth: 2,
    borderColor: BUTTON_BG,
    overflow: 'hidden',

    // Premium shadow
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },

  iconContainer: {
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  iconWrapper: {
    padding: 5,
    borderRadius: 16,
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
  },

  // Enhanced active capsule
  activeCapsule: {
    backgroundColor: BUTTON_BG,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,

    // Glow effect
    shadowColor: BUTTON_BG,
    // shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,

    // Subtle gradient effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Floating active indicator dot
  activeDot: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BUTTON_BG,

    // Dot glow
    shadowColor: BUTTON_BG,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});

// Optional: Add a background blur overlay for enhanced glass effect
const GlassOverlay = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={[
      StyleSheet.absoluteFill,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 25,
      }
    ]} />
  </View>
);