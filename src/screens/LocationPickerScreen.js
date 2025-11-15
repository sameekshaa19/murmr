// src/screens/LocationPickerScreen.js - OpenStreetMap Version

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '../utils/theme';

const LocationPickerScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLocation, setInitialLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setInitialLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission needed');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setSelectedLocation(coords);
      setInitialLocation(coords);
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('No Location', 'Please select a location first');
      return;
    }

    const { audioDetails, title } = route.params || {};

    navigation.navigate('Tag', {
      audioDetails,
      title,
      pickedLocation: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`,
      },
    });
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${initialLocation.latitude}, ${initialLocation.longitude}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var marker = null;

        map.on('click', function(e) {
          if (marker) {
            map.removeLayer(marker);
          }
          
          marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setSelectedLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.currentButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.buttonText}>📍 Use Current Location</Text>
        </TouchableOpacity>

        {selectedLocation && (
          <>
            <Text style={styles.coordsText}>
              📍 {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm Location ✓</Text>
            </TouchableOpacity>
          </>
        )}

        {!selectedLocation && (
          <Text style={styles.infoText}>
            🗺️ Tap anywhere on the map to select
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.strong,
  },
  currentButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
  },
  coordsText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginVertical: SPACING.sm,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    color: COLORS.darkGray,
    fontFamily: FONTS.regular,
  },
});

export default LocationPickerScreen;