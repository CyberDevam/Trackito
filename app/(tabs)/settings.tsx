import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../Styles/SettingPage.style';
import { useAppContext } from '../context/useContext';
const { width, height } = Dimensions.get('window');
// const { BUTTON_BG, BUTTON_TEXT } = theme.authentication;
const Settings = () => {
  const { theme: themes, toggleTheme } = useAppContext();
  const { BUTTON_BG, BUTTON_TEXT } = themes;
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const animatedValues = React.useRef([]);
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animatedValues.current.length === 0) {
      animatedValues.current = Array(5)
        .fill()
        .map(() => new Animated.Value(0));
      startAnimations();
      startPulseAnimation(); // Add this line
    }
  }, []);
  React.useEffect(() => {
    toggleTheme();
  }, [darkMode]);

  const startAnimations = () => {
    animatedValues.current.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 15000 + index * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 15000 + index * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const renderAnimatedCircles = () => {
    const circles = [
      { size: 120, top: 50, left: -40, color: 'rgba(0, 198, 255, 0.15)' },
      { size: 180, top: height - 280, left: width - 120, color: 'rgba(32, 58, 67, 0.2)' },
      { size: 90, top: 200, left: -25, color: 'rgba(44, 83, 100, 0.15)' },
      { size: 140, top: 400, left: width - 80, color: 'rgba(0, 198, 255, 0.1)' },
      { size: 70, top: height - 150, left: 30, color: 'rgba(32, 58, 67, 0.15)' },
    ];

    return circles.map((circle, index) => {
      // Add safety check for animatedValues
      if (!animatedValues.current[index]) {
        return null;
      }

      const translateY = animatedValues.current[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
      });

      const rotate = animatedValues.current[index].interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.animatedCircle,
            {
              width: circle.size,
              height: circle.size,
              top: circle.top,
              left: circle.left,
              backgroundColor: circle.color,
              transform: [{ translateY }, { rotate }],
            },
          ]}
        />
      );
    });
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.3],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  const SettingItem = ({ icon, title, subtitle, rightComponent, onPress, isLast = false }) => (
    <TouchableOpacity
      style={[styles.settingItem, isLast && styles.lastItem]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#0f2027" /> */}
      <View style={styles.background}>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⚙️</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Customize your experience</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Notification Settings */}
          <View style={styles.section}>
            <SectionHeader title="Notifications" icon="🔔" />
            <View style={styles.sectionCard}>
              <SettingItem
                icon="📢"
                title="Push Notifications"
                subtitle="Receive app notifications"
                rightComponent={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: BUTTON_BG, true: BUTTON_TEXT }}
                    thumbColor={notifications ? BUTTON_BG : BUTTON_TEXT}
                  />
                }
              />
              <View style={styles.separator} />
              <SettingItem
                icon="📧"
                title="Email Updates"
                subtitle="Get updates via email"
                rightComponent={
                  <Switch
                    value={emailUpdates}
                    onValueChange={setEmailUpdates}
                    trackColor={{ false: BUTTON_BG, true: BUTTON_TEXT }}
                    thumbColor={emailUpdates ? BUTTON_BG : BUTTON_TEXT}
                  />
                }
              />
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <SectionHeader title="Security" icon="🛡️" />
            <View style={styles.sectionCard}>
              <SettingItem
                icon="🔒"
                title="Biometric Login"
                subtitle="Use fingerprint or face ID"
                rightComponent={
                  <Switch
                    value={biometric}
                    onValueChange={setBiometric}
                    trackColor={{ false: BUTTON_BG, true: BUTTON_TEXT }}
                    thumbColor={biometric ? BUTTON_BG : BUTTON_TEXT}
                  />
                }
              />
              <View style={styles.separator} />
              <SettingItem
                icon="🔄"
                title="Auto Sync"
                subtitle="Automatically sync your data"
                rightComponent={
                  <Switch
                    value={autoSync}
                    onValueChange={setAutoSync}
                    trackColor={{ false: BUTTON_BG, true: BUTTON_TEXT }}
                    thumbColor={autoSync ? BUTTON_BG : BUTTON_TEXT}
                  />
                }
              />
            </View>
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <SectionHeader title="Appearance" icon="🎨" />
            <View style={styles.sectionCard}>
              <SettingItem
                icon="🌙"
                title="Dark Theme"
                subtitle="Use dark mode interface"
                rightComponent={
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: BUTTON_BG, true: BUTTON_TEXT }}
                    thumbColor={darkMode ? BUTTON_BG : BUTTON_TEXT}
                  />
                }
              />
              <View style={styles.separator} />
              <SettingItem
                icon="📐"
                title="Font Size"
                subtitle="Adjust text size"
                rightComponent={<Text style={styles.arrow}>Medium ›</Text>}
              />
            </View>
          </View>

          {/* Account Management */}
          <View style={styles.section}>
            <SectionHeader title="Account" icon="👤" />
            <View style={styles.sectionCard}>
              <SettingItem
                icon="📝"
                title="Edit Profile"
                subtitle="Update your personal information"
                rightComponent={<Text style={styles.arrow}>›</Text>}
              />
              <View style={styles.separator} />
              <SettingItem
                icon="🔐"
                title="Change Password"
                subtitle="Update your security settings"
                rightComponent={<Text style={styles.arrow}>›</Text>}
              />
              <View style={styles.separator} />
              <SettingItem
                icon="🌐"
                title="Language"
                subtitle="App language settings"
                rightComponent={<Text style={styles.arrow}>English ›</Text>}
              />
            </View>
          </View>

          {/* Support & About */}
          <View style={styles.section}>
            <SectionHeader title="Support" icon="❓" />
            <View style={styles.sectionCard}>
              <SettingItem
                icon="💬"
                title="Help Center"
                subtitle="Get help with the app"
                rightComponent={<Text style={styles.arrow}>›</Text>}
              />
              <View style={styles.separator} />
              <SettingItem
                icon="📞"
                title="Contact Support"
                subtitle="Reach out to our team"
                rightComponent={<Text style={styles.arrow}>›</Text>}
              />
              <View style={styles.separator} />
              <SettingItem
                icon="📚"
                title="Terms & Privacy"
                subtitle="Legal information"
                rightComponent={<Text style={styles.arrow}>›</Text>}
                isLast={true}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerCard}>
              <Text style={styles.version}>App Version 2.4.1</Text>
              <Text style={styles.build}>Build #2847</Text>
              <Text style={styles.copyright}>© 2024 SecureApp. All rights reserved.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;