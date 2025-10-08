import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppContext } from './context/useContext';
import theme from './Styles/TheStyle.style';
// import theme from './Styles/TheStyle.style';
const { theme:themes } = useAppContext();
const { BUTTON_BG, BUTTON_TEXT } = themes;
const { width, height } = Dimensions.get('window');
const { ACCENT_COLOR, DARK_BG, CARD_BG, TEXT_COLOR, SUBTLE_TEXT, ERROR_COLOR = '#ff4444' } = theme.authentication;

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const Authentication = () => {
  const [step, setStep] = useState('userDetails');
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState({
    username: false,
    email: false,
    phone: false,
    otp: false,
    emailFormat: false,
    phoneLength: false
  });
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    email: '',
    phone: '',
    otp: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpInputs = useRef([]);
  const animatedValues = useRef([]);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Initialize animations with proper safety
  useEffect(() => {
    animatedValues.current = Array(5)
      .fill()
      .map(() => new Animated.Value(0));

    startAnimations();
    startPulseAnimation();
  }, []);

  // Timer effect
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (step === 'otp' && timeLeft === 0) {
      setCanResend(true);
    }

    return () => clearTimeout(timerRef.current);
  }, [step, timeLeft]);

  const startAnimations = () => {
    animatedValues.current.forEach((anim, index) => {
      if (anim) {
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
      }
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const clearErrors = () => {
    setError({
      username: false,
      email: false,
      phone: false,
      otp: false,
      emailFormat: false,
      phoneLength: false
    });
    setErrorMessages({
      username: '',
      email: '',
      phone: '',
      otp: ''
    });
  };

  const handleUserDetailsSubmit = () => {
    const { username, email, phone } = userDetails;

    // Clear previous errors
    clearErrors();

    let hasError = false;
    const newErrorMessages = { username: '', email: '', phone: '', otp: '' };
    const newErrors = {
      username: false,
      email: false,
      phone: false,
      otp: false,
      emailFormat: false,
      phoneLength: false
    };

    // Validate username
    if (!username.trim()) {
      newErrors.username = true;
      newErrorMessages.username = 'Username is required';
      hasError = true;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = true;
      newErrorMessages.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.emailFormat = true;
      newErrorMessages.email = 'Please enter a valid email address';
      hasError = true;
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = true;
      newErrorMessages.phone = 'Phone number is required';
      hasError = true;
    } else if (!validatePhone(phone)) {
      newErrors.phoneLength = true;
      newErrorMessages.phone = 'Please enter a valid 10-digit phone number';
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      setErrorMessages(newErrorMessages);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimeLeft(60);
      setCanResend(false);
      clearErrors();
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserDetails({ ...userDetails, [field]: value });

    // Clear error when user starts typing
    if (error[field as keyof typeof error]) {
      setError({ ...error, [field]: false });
      setErrorMessages({ ...errorMessages, [field]: '' });
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Clear OTP error when user starts typing
    if (error.otp) {
      setError({ ...error, otp: false });
      setErrorMessages({ ...errorMessages, otp: '' });
    }

    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = (otpValue: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (otpValue === '123456') {
        router.push('/home');
        resetForm();
      } else {
        setError({ ...error, otp: true });
        setErrorMessages({ ...errorMessages, otp: 'Invalid OTP. Please try again.' });
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    setTimeLeft(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    otpInputs.current[0]?.focus();

    Alert.alert('Success', 'OTP has been resent to your email');
  };

  const resetForm = () => {
    setStep('userDetails');
    setUserDetails({ username: '', email: '', phone: '' });
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(60);
    setCanResend(false);
    clearErrors();
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0],
  });

  const renderAnimatedCircles = () => {
    const circles = [
      {
        size: moderateScale(80),
        top: verticalScale(50),
        left: moderateScale(30),
        color: 'rgba(0, 198, 255, 0.2)'
      },
      {
        size: moderateScale(120),
        top: height - verticalScale(200),
        left: width - moderateScale(120),
        color: 'rgba(32, 58, 67, 0.3)'
      },
      {
        size: moderateScale(150),
        top: verticalScale(100),
        left: width - moderateScale(150),
        color: 'rgba(44, 83, 100, 0.3)'
      },
      {
        size: moderateScale(100),
        top: height - verticalScale(150),
        left: moderateScale(20),
        color: 'rgba(0, 198, 255, 0.15)'
      },
      {
        size: moderateScale(60),
        top: verticalScale(200),
        left: moderateScale(10),
        color: 'rgba(32, 58, 67, 0.25)'
      },
    ];

    return circles.map((circle, index) => {
      if (!animatedValues.current[index]) {
        return null;
      }

      const translateY = animatedValues.current[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, -verticalScale(20)],
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

  const renderUserDetailsForm = () => (
    <View
      style={styles.scrollContent}
    // showsVerticalScrollIndicator={false}
    // keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign up to access real-time tracking and route planning.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <View style={[
            styles.inputWrapper,
            error.username && styles.inputWrapperError
          ]}>
            <Text style={[
              styles.inputIcon,
              error.username && styles.inputIconError
            ]}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor={error.username ? ERROR_COLOR : SUBTLE_TEXT}
              value={userDetails.username}
              onChangeText={(text) => handleInputChange('username', text)}
            />
          </View>
          {error.username && (
            <Text style={styles.errorText}>{errorMessages.username}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputWrapper,
            (error.email || error.emailFormat) && styles.inputWrapperError
          ]}>
            <Text style={[
              styles.inputIcon,
              (error.email || error.emailFormat) && styles.inputIconError
            ]}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={(error.email || error.emailFormat) ? ERROR_COLOR : SUBTLE_TEXT}
              keyboardType="email-address"
              value={userDetails.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>
          {(error.email || error.emailFormat) && (
            <Text style={styles.errorText}>{errorMessages.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[
            styles.inputWrapper,
            (error.phone || error.phoneLength) && styles.inputWrapperError
          ]}>
            <Text style={[
              styles.inputIcon,
              (error.phone || error.phoneLength) && styles.inputIconError
            ]}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={(error.phone || error.phoneLength) ? ERROR_COLOR : SUBTLE_TEXT}
              keyboardType="phone-pad"
              value={userDetails.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              maxLength={10}
            />
          </View>
          {(error.phone || error.phoneLength) && (
            <Text style={styles.errorText}>{errorMessages.phone}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleUserDetailsSubmit}
          disabled={isLoading}
        >
          <View style={styles.buttonBackground}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOtpForm = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <View style={styles.logo}>
          <View style={styles.gpsIcon}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit verification code sent to{'\n'}
          <Text style={styles.emailText}>{userDetails.email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpInputs.current[index] = ref)}
              style={[
                styles.otpInput,
                error.otp && styles.otpInputError
              ]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleOtpKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error.otp && (
          <Text style={styles.errorText}>{errorMessages.otp}</Text>
        )}

        <Text style={styles.timer}>
          Resend code in <Text style={styles.timerText}>{timeLeft}</Text> seconds
        </Text>

        <TouchableOpacity
          style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
          onPress={handleResendOtp}
          disabled={!canResend}
        >
          <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
            Resend Verification Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (isLoading || otp.some(digit => digit === '')) && styles.buttonDisabled]}
          onPress={() => verifyOtp(otp.join(''))}
          disabled={isLoading || otp.some(digit => digit === '')}
        >
          <View style={styles.buttonBackground}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BG} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(40) : 0}
      >
        <View style={styles.background}>
          {renderAnimatedCircles()}

          <View style={styles.content}>
            <View style={styles.card}>
              {step === 'userDetails' && renderUserDetailsForm()}
              {step === 'otp' && renderOtpForm()}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  background: {
    flex: 1,
    backgroundColor: BUTTON_TEXT,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: moderateScale(400),
    minHeight: verticalScale(500),
    backgroundColor: BUTTON_TEXT,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(25),
    paddingVertical: verticalScale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(5) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(10),
    elevation: 8,
  },
  animatedCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  formContainer: {
    width: '100%',
  },

  // Logo/Pulse
  logo: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
    position: 'relative',
    height: verticalScale(120),
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: moderateScale(120),
    height: moderateScale(120),
    backgroundColor: 'rgba(0, 198, 255, 0.1)',
    borderRadius: moderateScale(60),
  },
  gpsIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: BUTTON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BUTTON_BG,
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(10),
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  lockIcon: {
    fontSize: moderateScale(35),
    color: TEXT_COLOR,
  },

  // Text
  title: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    textAlign: 'center',
    color: BUTTON_BG,
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: BUTTON_BG,
    marginBottom: verticalScale(30),
    lineHeight: moderateScale(22),
  },
  emailText: {
    fontWeight: '600',
    color: BUTTON_BG,
  },

  // Input Styles
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: BUTTON_BG,
    marginBottom: verticalScale(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    backgroundColor: BUTTON_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(5),
    elevation: 2,
    borderLeftWidth: moderateScale(3),
    borderLeftColor: ACCENT_COLOR,
    minHeight: verticalScale(50),
  },
  inputWrapperError: {
    borderLeftColor: ERROR_COLOR,
    shadowColor: ERROR_COLOR,
    shadowOpacity: 0.3,
  },
  inputIcon: {
    fontSize: moderateScale(18),
    paddingHorizontal: moderateScale(15),
    color: ACCENT_COLOR,
    textAlignVertical: 'center',
  },
  inputIconError: {
    color: ERROR_COLOR,
  },
  input: {
    flex: 1,
    padding: moderateScale(15),
    fontSize: moderateScale(16),
    color: BUTTON_TEXT,
    backgroundColor: 'transparent',
    minHeight: verticalScale(50),
  },

  // Error Text
  errorText: {
    color: ERROR_COLOR,
    fontSize: moderateScale(12),
    marginTop: verticalScale(5),
    marginLeft: moderateScale(5),
    fontWeight: '500',
  },

  // Button Styles
  button: {
    marginTop: verticalScale(30),
    borderRadius: moderateScale(30),
    overflow: 'hidden',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: moderateScale(5) },
    shadowOpacity: 0.6,
    shadowRadius: moderateScale(10),
    elevation: 10,
  },
  buttonBackground: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(20),
    alignItems: 'center',
    backgroundColor: BUTTON_BG,
    minHeight: verticalScale(55),
    justifyContent: 'center',
  },
  buttonText: {
    color: BUTTON_TEXT,
    fontSize: moderateScale(17),
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.2,
  },

  // OTP Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(20),
    paddingHorizontal: moderateScale(10),
    gap: 2,
  },
  otpInput: {
    width: moderateScale(44),
    height: verticalScale(55),
    borderWidth: moderateScale(2),
    borderColor: BUTTON_BG,
    borderRadius: moderateScale(10),
    textAlign: 'center',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: BUTTON_BG,
    backgroundColor: BUTTON_TEXT,
    shadowColor: BUTTON_BG,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(5),
    elevation: 3,
  },
  otpInputError: {
    borderColor: ERROR_COLOR,
    shadowColor: ERROR_COLOR,
    color: ERROR_COLOR,
  },
  timer: {
    textAlign: 'center',
    color: BUTTON_BG,
    fontSize: moderateScale(14),
    marginVertical: verticalScale(15),
  },
  timerText: {
    fontWeight: 'bold',
    color: BUTTON_BG,
  },
  resendButton: {
    alignItems: 'center',
    marginVertical: verticalScale(10),
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: BUTTON_BG,
    minHeight: verticalScale(45),
    justifyContent: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
    borderColor: BUTTON_BG,
  },
  resendText: {
    color: BUTTON_BG,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: BUTTON_BG,
  },
});

export default Authentication;