import { StyleSheet } from "react-native";
import theme from './TheStyle.style';
const { BUTTON_BG, BUTTON_TEXT } = theme.authentication;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BUTTON_TEXT,
    paddingVertical: 40,
  },
  background: {
    flex: 1,
    backgroundColor: BUTTON_TEXT,
  },
  animatedCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    backgroundColor: BUTTON_BG,
    borderRadius: 70,
    top: 10,
  },
  headerIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: BUTTON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BUTTON_TEXT,
    shadowColor: BUTTON_BG,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  headerIconText: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: BUTTON_BG,
    marginBottom: 6,
    textShadowColor: BUTTON_BG,
    // textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: BUTTON_BG,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BUTTON_BG,
    // textShadowColor: 'rgba(0, 0, 0, 0.3)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 3,
  },
  sectionCard: {
    backgroundColor: BUTTON_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BUTTON_TEXT,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 22,
    backgroundColor: BUTTON_BG,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: BUTTON_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: BUTTON_BG,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 14,
    color: BUTTON_TEXT,
    lineHeight: 18,
  },
  settingRight: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 15,
    color: BUTTON_BG,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: BUTTON_BG,
    marginHorizontal: 22,
  },
  footer: {
    marginBottom: 50,
  },
  footerCard: {
    backgroundColor: BUTTON_BG,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BUTTON_BG,
  },
  version: {
    fontSize: 15,
    fontWeight: '600',
    color: BUTTON_TEXT,
    marginBottom: 4,
  },
  build: {
    fontSize: 13,
    color: BUTTON_TEXT,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: BUTTON_TEXT,
    textAlign: 'center',
  },
});
export default styles;