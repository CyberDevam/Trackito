// components/Loader.js
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useAppContext } from '../context/useContext';

// const ACCENT_COLOR = '#00c6ff'; // Your theme blue
const PulseLoader = ({ numberOfDots = 5, dotSize = 10, duration = 1000, delay = 150 }) => {
  const animatedValues = useRef(Array.from({ length: numberOfDots }, () => new Animated.Value(0))).current;
  const { theme:themes } = useAppContext();
  const { BUTTON_BG, BUTTON_TEXT } = themes;
  const dotColor = BUTTON_BG;
  useEffect(() => { 
    const animate = () => {
      Animated.stagger(
        delay, // Delay between each dot's animation start
        animatedValues.map((animatedValue) =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: duration / 2,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            { iterations: -1 } // Loop indefinitely
          )
        )
      ).start();
    };

    animate();

    // Cleanup: stop all animations when the component unmounts
    return () => {
      animatedValues.forEach(value => value.stopAnimation());
    };
  }, [animatedValues, numberOfDots, duration, delay]);

  return (
    <View style={styles.loaderContainer}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dotColor,
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1], // Fade from 50% to 100% opacity
              }),
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2], // Scale from 80% to 120%
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, // Give it some height for vertical centering
  },
  dot: {
    marginHorizontal: 4, // Spacing between dots
  },
});

export default PulseLoader;