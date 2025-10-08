import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Assuming the Loader component is available in your project structure
import Loader from '../components/Loader';
import { useAppContext } from '../context/useContext';
import theme from '../Styles/TheStyle.style'
// Dummy data for bus routes and schedules
const ALL_BUS_ROUTES = [
  { id: '101', name: 'Route 101: City Center to Airport', stops: 15 },
  { id: '102', name: 'Route 102: Old Town to University', stops: 22 },
  { id: '103', name: 'Route 103: Train Station Loop', stops: 18 },
  { id: '201', name: 'Route 201: North Campus Shuttle', stops: 10 },
  { id: '305', name: 'Route 305: Downtown Express', stops: 8 },
];
const { width, height } = Dimensions.get('window');
const DUMMY_SCHEDULES = {
  '101': [
    { stop: 'City Center', time: '8:00 AM' },
    { stop: 'Main Square', time: '8:15 AM' },
    { stop: 'Tech Park', time: '8:30 AM' },
    { stop: 'Mall of India', time: '8:45 AM' },
    { stop: 'Airport Terminal 1', time: '9:00 AM' },
  ],
  '102': [
    { stop: 'Old Town Square', time: '7:45 AM' },
    { stop: 'Central Market', 'time': '8:00 AM' },
    { stop: 'Gandhi Chowk', time: '8:20 AM' },
    { stop: 'University Campus', time: '8:45 AM' },
  ],
};

const { BUTTON_BG, BUTTON_TEXT } = theme.authentication;
const BusTab = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  // const handleSearch = (text) => {
  //   setSearchText(text);
  //   // Simulate loading/API delay when searching
  //   setIsLoading(true);

  //   // In a real app, this would be inside a debounce/throttle function.
  //   setTimeout(() => {
  //     if (text.length > 0) {
  //       const filtered = ALL_BUS_ROUTES.filter(route =>
  //         route.id.includes(text) || route.name.toLowerCase().includes(text.toLowerCase())
  //       );
  //       setFilteredRoutes(filtered);
  //     } else {
  //       setFilteredRoutes([]);
  //     }
  //     setIsLoading(false);
  //   }, 500); // 500ms simulation delay
  // };

  const showSchedule = (busId) => {
    // Simulate loading delay before showing the schedule
    setIsLoading(true);
    setIsModalVisible(true);

    setTimeout(() => {
      const schedule = DUMMY_SCHEDULES[busId] || [];
      setSelectedSchedule({
        id: busId,
        name: ALL_BUS_ROUTES.find(route => route.id === busId)?.name,
        stops: schedule,
      });
      setIsLoading(false);
    }, 300); // Short delay for modal content
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderCenter}>
        <Loader numberOfDots={5} dotColor={ACCENT_COLOR} />
        <Text style={styles.loadingText}>Fetching data...</Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <Text style={styles.headerText}>Bus Finder</Text>
      {/* Bus Number Finder Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Find Bus by Number or Name"
          placeholderTextColor={BUTTON_TEXT}
          value={searchText}
          // onChangeText={handleSearch}
          onChangeText={setSearchText}
        />
      </View>

      {/* Suggested Buses Section (Active Search) */}
      {searchText.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Suggested Routes</Text>
          <FlatList
            data={filteredRoutes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => showSchedule(item.id)}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.routeIdText}>{item.id}</Text>
                  <Text style={styles.routeNameText}>{item.name}</Text>
                </View>
                <Text style={styles.nextIcon}>{">"}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No routes match your search.</Text>}
          />
        </View>
      )}

      {/* Popular Routes Section (No Search Active) */}
      {searchText.length === 0 && (
        <View style={styles.suggestedContainer}>
          <Text style={styles.listTitle}>Popular Routes</Text>
          <FlatList
            data={ALL_BUS_ROUTES.slice(0, 3)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => showSchedule(item.id)}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.routeIdText}>{item.id}</Text>
                  <Text style={styles.routeNameText}>{item.name}</Text>
                  <Text style={styles.routeDetailText}>Stops: {item.stops}</Text>
                </View>
                <Text style={styles.nextIcon}>></Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Modal for Bus Schedule */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedSchedule?.name}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          {/* Show loader inside modal if the schedule is still being fetched */}
          {isLoading ? (
            <View style={styles.modalContentLoader}>
              <Loader numberOfDots={4} dotColor={ACCENT_COLOR} />
              <Text style={styles.loadingText}>Loading schedule...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scheduleList}>
              <Text style={styles.scheduleTitle}>Static Schedule (Real-Time ETA via GPS)</Text>
              {selectedSchedule?.stops.map((stop, index) => (
                <View key={index} style={styles.scheduleItem}>
                  {/* <View style={styles.timelineDot} /> */}
                  <View style={styles.scheduleItemContent}>
                    <Text style={styles.scheduleStop}>{stop.stop}</Text>
                    <Text style={styles.scheduleTime}>{stop.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const ACCENT_COLOR = '#00c6ff'; // Your theme blue
const DARK_BG = '#0f2027';      // Main dark background
const MID_BG = '#1b323c';       // Slightly lighter dark background
const CARD_BG = '#2c4251';      // Card/Input dark background
const TEXT_COLOR = '#fff';      // Light text color for dark background

const styles = StyleSheet.create({
  // --- Main Container and Layout ---
  container: {
    flex: 1,
    backgroundColor: BUTTON_BG,
    paddingVertical: 20,
    height: "90%"
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BUTTON_BG,
  },
  loadingText: {
    color: BUTTON_TEXT,
    marginTop: 15,
    fontSize: 20,
  },
  headerText: {
    color: BUTTON_TEXT,
    fontSize: 35,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 15
  },
  searchSection: {
    padding: 15,
    backgroundColor: BUTTON_TEXT,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  input: {
    height: 48,
    backgroundColor: BUTTON_BG,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: BUTTON_TEXT,
    fontWeight: 'bold',
    flex: 1,
  },
  // --- List Styles ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestedContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BUTTON_TEXT,
    marginBottom: 15,
    alignSelf: 'center'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BUTTON_TEXT,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: BUTTON_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  listItemContent: {
    flex: 1,
    marginRight: 10,
  },
  routeIdText: {
    color: BUTTON_BG,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  routeNameText: {
    color: BUTTON_BG,
    fontSize: 17,
    fontWeight: '600',
  },
  routeDetailText: {
    color: BUTTON_BG,
    fontSize: 13,
    marginTop: 4,
  },
  nextIcon: {
    color: BUTTON_BG,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: BUTTON_BG,
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },

  // --- Modal Styles (Schedule) ---
  modalContainer: {
    flex: 1,
    backgroundColor: BUTTON_TEXT,
  },
  modalContentLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BUTTON_BG,
    borderBottomWidth: 1,
    borderBottomColor: CARD_BG,
  },
  modalTitle: {
    color: BUTTON_TEXT,
    fontSize: 22,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  closeButtonContainer: {
    padding: 5,
    marginLeft: 15,
  },
  closeButton: {
    color: BUTTON_TEXT,
    fontSize: 30,
    fontWeight: '300',
  },
  scheduleList: {
    padding: 20,
  },
  scheduleTitle: {
    color: BUTTON_BG,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BUTTON_BG,
    marginRight: 15,
    borderLeftWidth: 2,
    borderLeftColor: CARD_BG,
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: -20,
  },
  scheduleItemContent: {
    backgroundColor: BUTTON_BG,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scheduleStop: {
    color: BUTTON_TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleTime: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusTab;