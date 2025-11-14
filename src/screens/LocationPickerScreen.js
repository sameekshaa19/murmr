// src/screens/LocationPickerScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '../utils/theme';

const LocationPickerScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;

    // Send back to TagScreen
    navigation.navigate("Tag", {
      pickedLocation: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
    });
  };

  return (
    <View style={styles.container}>
      
      {/* Map (OpenStreetMap) */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}   // forces non-google provider
        onPress={handleMapPress}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={[]}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}
      </MapView>

      {/* Bottom UI */}
      <View style={styles.bottomContainer}>
        {selectedLocation ? (
          <>
            <Text style={styles.coordsText}>
              📍 {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </Text>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmLocation}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmButtonText}>Confirm Location ✔</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.tapInstruction}>
            Tap anywhere on the map to drop a pin
          </Text>
        )}
      </View>

    </View>
  );
};

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.soft,
  },
  tapInstruction: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: "center",
  },
  coordsText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  confirmButtonText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default LocationPickerScreen;
