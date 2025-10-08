import { Dimensions, StyleSheet } from 'react-native';
import theme from "./TheStyle.style";

const { width, height } = Dimensions.get('window');
const { BUTTON_BG, BUTTON_TEXT } = theme.authentication;
const styles = StyleSheet.create({
  gsContainer: {
    flex: 1,
    width,
    height,
    backgroundColor: BUTTON_TEXT, // fallback for gradient
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },

  gsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BUTTON_BG,
    marginTop: 40,
    textAlign: 'center',
    zIndex: 2,
  },
  gsSubtitle: {
    fontSize: 16,
    color: BUTTON_BG,
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: '80%',
    zIndex: 2,
  },

  gsButton: {
    backgroundColor: BUTTON_BG,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    zIndex: 2,
    shadowColor: BUTTON_BG,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  gsButtonText: {
    fontSize: 18,
    color: BUTTON_TEXT,
    fontWeight: 'bold',
  },

  gpsIcon: {
    width: 50,
    height: 50,
    zIndex: 2,
    marginTop: 20,
  },

  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0, 198, 255, 0.2)',
    borderRadius: 60,
    top: 120,
    zIndex: 1,
  },
});
export default styles;