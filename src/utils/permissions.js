// src/utils/permissions.js

import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';
import { ERROR_MESSAGES } from './constants';

/**
 * Request microphone permission for audio recording
 */
export const requestAudioPermission = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Microphone Permission Required',
        ERROR_MESSAGES.AUDIO_PERMISSION,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openAppSettings() }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting audio permission:', error);
    return false;
  }
};

/**
 * Request location permission (foreground)
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        ERROR_MESSAGES.LOCATION_PERMISSION,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openAppSettings() }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Request background location permission (required for geofencing)
 */
export const requestBackgroundLocationPermission = async () => {
  try {
    // First check if foreground permission is granted
    const foreground = await Location.getForegroundPermissionsAsync();
    
    if (foreground.status !== 'granted') {
      const foregroundRequest = await Location.requestForegroundPermissionsAsync();
      if (foregroundRequest.status !== 'granted') {
        return false;
      }
    }
    
    // Then request background permission
    const { status } = await Location.requestBackgroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Required',
        'Murmr needs background location access to trigger reminders when you visit tagged places.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openAppSettings() }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting background location permission:', error);
    return false;
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notification Permission Required',
        ERROR_MESSAGES.NOTIFICATION_PERMISSION,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openAppSettings() }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Check if audio permission is granted
 */
export const checkAudioPermission = async () => {
  const { status } = await Audio.getPermissionsAsync();
  return status === 'granted';
};

/**
 * Check if location permission is granted
 */
export const checkLocationPermission = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Check if background location permission is granted
 */
export const checkBackgroundLocationPermission = async () => {
  const { status } = await Location.getBackgroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Check if notification permission is granted
 */
export const checkNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

/**
 * Request all necessary permissions at once
 */
export const requestAllPermissions = async () => {
  const audio = await requestAudioPermission();
  const location = await requestLocationPermission();
  const notifications = await requestNotificationPermission();
  
  return {
    audio,
    location,
    notifications,
    allGranted: audio && location && notifications,
  };
};

/**
 * Open app settings (platform-specific)
 */
const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Alert.alert(
      'Open Settings',
      'Please go to Settings > Murmr and enable the required permissions.',
      [{ text: 'OK' }]
    );
  } else {
    // On Android, you can use Linking to open app settings
    // import { Linking } from 'react-native';
    // Linking.openSettings();
    Alert.alert(
      'Open Settings',
      'Please go to Settings > Apps > Murmr > Permissions and enable the required permissions.',
      [{ text: 'OK' }]
    );
  }
};

export default {
  requestAudioPermission,
  requestLocationPermission,
  requestBackgroundLocationPermission,
  requestNotificationPermission,
  checkAudioPermission,
  checkLocationPermission,
  checkBackgroundLocationPermission,
  checkNotificationPermission,
  requestAllPermissions,
};