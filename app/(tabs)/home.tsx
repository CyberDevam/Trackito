import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
// Assuming Loader is a simple component that shows a spinner/loading animation
import Loader from '../components/Loader';
import theme from '../Styles/TheStyle.style';

// Constants for Theming
const { ACCENT_COLOR, LIGHT_BG, TEXT_COLOR, CARD_BG, DARK_BG } = theme.home;
const { BUTTON_BG, BUTTON_TEXT } = theme.authentication;
// Define the type for map region
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Dummy data for suggestions
const SUGGESTIONS = [
  { id: '1', name: 'City Center' },
  { id: '2', name: 'University Campus' },
  { id: '3', name: 'Train Station' },
  { id: '4', name: 'Tech Park' },
];

// --- Route Finder Modal Component (Unchanged) ---
const RouteFinderModal = ({ isVisible, onClose }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const handleSearch = () => {
    onClose();
  };

  const handleSwap = () => {
    setStartLocation(endLocation);
    setEndLocation(startLocation);
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={modalStyles.modalContainer}>
        {/* Header */}
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.modalTitle}>Find Your Bus Route</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButtonContainer}>
            <Text style={modalStyles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.contentWrapper}>
          {/* Input Fields */}
          <View style={modalStyles.inputGroup}>
            <TextInput
              style={modalStyles.input}
              placeholder="Start Location"
              placeholderTextColor={BUTTON_TEXT}
              value={startLocation}
              onChangeText={setStartLocation}
            />
            <TextInput
              style={modalStyles.input}
              placeholder="End Location"
              placeholderTextColor={BUTTON_TEXT}
              value={endLocation}
              onChangeText={setEndLocation}
            />

            {/* Swap Button */}
            <TouchableOpacity style={modalStyles.swapButton} onPress={handleSwap}>
              <Text style={modalStyles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={[
              modalStyles.searchButton,
              (!startLocation || !endLocation) && modalStyles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={!startLocation || !endLocation}
          >
            <Text style={modalStyles.searchButtonText}>Search Route</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};



// --- Home Component (Updated to include Loader) ---
const Home = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (loc) => {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleRouteFinderPress = () => {
    setIsModalVisible(true);
  };

  if (!region) {
    return (
      <SafeAreaView style={styles.center}>
        {/* FIX: Use the imported Loader component here */}
        <Loader />
        <Text style={styles.loadingText}>{errorMsg || 'Fetching location...'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      />

      {/* Route Finder Button positioned absolutely */}
      <TouchableOpacity
        style={styles.routeButtonContainer}
        onPress={handleRouteFinderPress}
      >
        <View style={styles.routeButton}>
          <Text style={styles.routeButtonText}>📍</Text>
        </View>
      </TouchableOpacity>

      {/* Route Finder Modal */}
      <RouteFinderModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Home;

// --- Main Component Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Changed to a neutral color (like the light background) for the loading screen
    backgroundColor: LIGHT_BG,
  },
  loadingText: {
    color: TEXT_COLOR,
    marginTop: 10, // Add spacing below the loader
  },
  routeButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    zIndex: 10,
  },
  routeButton: {
    backgroundColor: BUTTON_TEXT,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderColor: BUTTON_BG,
    borderWidth: 2,
    shadowColor: BUTTON_BG,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  routeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

// --- Modal Component Styles (Unchanged) ---
const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: BUTTON_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BUTTON_TEXT,
  },
  closeButtonContainer: {
    padding: 5,
  },
  closeButton: {
    color: BUTTON_TEXT,
    fontSize: 30,
    fontWeight: '300',
  },
  contentWrapper: {
    padding: 20,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 50,
    backgroundColor: BUTTON_BG,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: BUTTON_TEXT,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  swapButton: {
    position: 'absolute',
    right: 10,
    top: 50,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  swapIcon: {
    fontSize: 16,
    color: TEXT_COLOR,
  },
  suggestionsContainer: {
    marginBottom: 25,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: BUTTON_BG,
    marginBottom: 10,
    fontWeight: '600',
  },
  suggestionItem: {
    backgroundColor: BUTTON_BG + '22',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: BUTTON_BG,
  },
  suggestionText: {
    color: BUTTON_BG,
    fontSize: 14,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: BUTTON_BG,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: BUTTON_TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});