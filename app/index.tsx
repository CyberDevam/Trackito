import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from './Styles/GetStarted.style';
import { useAppContext } from "./context/useContext";
export default function Index() {
  const { theme } = useAppContext();
  const { BUTTON_BG, BUTTON_TEXT } = theme;
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  const { width, height } = Dimensions.get('window');
  return (
    <SafeAreaView style={styles.gsContainer}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={BUTTON_TEXT}/> */}
      <Animated.Image
        source={require("./Styles/LOGO2.jpg")}
        style={{
          width: 192,
          height: 192,
          resizeMode: 'contain', // Equivalent to Tailwind's 
          width: width * 0.45,
          height: width * 0.45,
          borderRadius: width * 0.225,
          borderWidth: 3,
          borderColor: BUTTON_BG
        }}
      />

      {/* Title */}
      <Text style={styles.gsTitle}>Track Your Journey</Text>

      {/* Subtitle */}
      <Text style={styles.gsSubtitle}>
        Real-time location updates at your fingertips.
      </Text>

      {/* Button */}
      <Pressable style={styles.gsButton} onPress={() => router.push('/home')}>
        <Text style={styles.gsButtonText}>Get Started →</Text>
      </Pressable>
      {/* <Pressable style={styles.gsButton} onPress={() => router.push('/authentication')}>
        <Text style={styles.gsButtonText}>Get Started →</Text>
      </Pressable> */}
    </SafeAreaView>
  );
}