// src/utils/constants.js

export const APP_NAME = 'Murmr';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.17:3000/api'  // Development
  : 'https://your-production-api.com/api';  // Production

// Audio Settings
export const AUDIO_CONFIG = {
  MAX_DURATION: 180000, // 3 minutes in milliseconds
  RECORDING_OPTIONS: {
    android: {
      extension: '.m4a',
      outputFormat: 'mpeg4',
      audioEncoder: 'aac',
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: 'mpeg4',
      audioQuality: 'high',
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  },
};

// Location Settings
export const LOCATION_CONFIG = {
  GEOFENCE_RADIUS: 150, // meters
  MIN_RADIUS: 50,
  MAX_RADIUS: 500,
  ACCURACY: 'high',
  DISTANCE_FILTER: 10, // meters
};

// Notification Settings
export const NOTIFICATION_CONFIG = {
  CHANNEL_ID: 'murmr-reminders',
  CHANNEL_NAME: 'Murmr Reminders',
  SOUND: 'default',
  PRIORITY: 'high',
};

// Tag Types
export const TAG_TYPES = {
  LOCATION: 'location',
  TIME: 'time',
  MOOD: 'mood',
};

// Mood Options
export const MOODS = [
  { id: 'happy', label: '😊 Happy', emoji: '😊', color: '#F0E491' },
  { id: 'sad', label: '😢 Sad', emoji: '😢', color: '#658C58' },
  { id: 'excited', label: '🤩 Excited', emoji: '🤩', color: '#BBC863' },
  { id: 'anxious', label: '😰 Anxious', emoji: '😰', color: '#31694E' },
  { id: 'calm', label: '😌 Calm', emoji: '😌', color: '#658C58' },
  { id: 'energetic', label: '⚡ Energetic', emoji: '⚡', color: '#F0E491' },
  { id: 'tired', label: '😴 Tired', emoji: '😴', color: '#31694E' },
  { id: 'focused', label: '🎯 Focused', emoji: '🎯', color: '#BBC863' },
];

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@murmr_user_preferences',
  CACHED_NOTES: '@murmr_cached_notes',
  LAST_SYNC: '@murmr_last_sync',
};

// Error Messages
export const ERROR_MESSAGES = {
  AUDIO_PERMISSION: 'Microphone permission is required to record voice notes',
  LOCATION_PERMISSION: 'Location permission is required to tag notes with places',
  NOTIFICATION_PERMISSION: 'Notification permission is required to receive reminders',
  NETWORK_ERROR: 'Network error. Please check your connection',
  RECORDING_FAILED: 'Failed to record audio. Please try again',
  PLAYBACK_FAILED: 'Failed to play audio. Please try again',
  SAVE_FAILED: 'Failed to save note. Please try again',
  DELETE_FAILED: 'Failed to delete note. Please try again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  NOTE_SAVED: 'Note saved successfully! 🎉',
  NOTE_DELETED: 'Note deleted successfully',
  REMINDER_SET: 'Reminder set! You\'ll hear from yourself soon 💚',
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Screen Names (for navigation)
export const SCREENS = {
  HOME: 'Home',
  RECORD: 'Record',
  TAG: 'Tag',
  NOTES_LIST: 'NotesList',
  PLAYBACK: 'Playback',
};

export default {
  APP_NAME,
  APP_VERSION,
  API_BASE_URL,
  AUDIO_CONFIG,
  LOCATION_CONFIG,
  NOTIFICATION_CONFIG,
  TAG_TYPES,
  MOODS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATION,
  SCREENS,
};