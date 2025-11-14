// src/services/locationService.js

import * as Location from 'expo-location';
import { LOCATION_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { calculateDistance } from '../utils/helpers';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.locationSubscription = null;
  }

  /**
   * Get current location
   */
  async getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error(ERROR_MESSAGES.LOCATION_PERMISSION);
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  async getAddressFromCoords(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return {
          street: address.street,
          city: address.city,
          region: address.region,
          country: address.country,
          postalCode: address.postalCode,
          name: address.name,
          formattedAddress: this.formatAddress(address),
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  /**
   * Format address object to string
   */
  formatAddress(address) {
    const parts = [];
    if (address.name) parts.push(address.name);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    return parts.join(', ') || 'Unknown location';
  }

  /**
   * Start watching location changes
   */
  async startWatchingLocation(callback) {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error(ERROR_MESSAGES.LOCATION_PERMISSION);
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_CONFIG.DISTANCE_FILTER,
          timeInterval: 5000, // Update every 5 seconds
        },
        (location) => {
          this.currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };
          
          if (callback) callback(this.currentLocation);
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  /**
   * Stop watching location
   */
  stopWatchingLocation() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  /**
   * Check if current location is within a geofence
   */
  isWithinGeofence(targetLat, targetLon, radius = LOCATION_CONFIG.GEOFENCE_RADIUS) {
    if (!this.currentLocation) return false;

    const distance = calculateDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      targetLat,
      targetLon
    );

    return distance <= radius;
  }

  /**
   * Check multiple geofences at once
   */
  checkGeofences(geofences) {
    if (!this.currentLocation) return [];

    return geofences.filter(fence => {
      return this.isWithinGeofence(
        fence.latitude,
        fence.longitude,
        fence.radius
      );
    });
  }

  /**
   * Calculate distance to target location
   */
  getDistanceToLocation(targetLat, targetLon) {
    if (!this.currentLocation) return null;

    return calculateDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      targetLat,
      targetLon
    );
  }

  /**
   * Format distance for display
   */
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /**
   * Request background location permission
   */
  async requestBackgroundPermission() {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting background permission:', error);
      return false;
    }
  }

  /**
   * Check if background permission is granted
   */
  async hasBackgroundPermission() {
    try {
      const { status } = await Location.getBackgroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking background permission:', error);
      return false;
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.stopWatchingLocation();
    this.currentLocation = null;
  }
}

// Export singleton instance
export default new LocationService();