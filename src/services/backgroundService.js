// src/services/backgroundService.js

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import locationService from './locationService';
import notificationService from './notificationService';
import apiService from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const LOCATION_TASK_NAME = 'MURMR_BACKGROUND_LOCATION';
const CHECK_INTERVAL = 60000; // Check every 60 seconds

class BackgroundService {
  constructor() {
    this.isRunning = false;
    this.userId = null;
  }

  /**
   * Initialize background service
   */
  async initialize(userId) {
    try {
      this.userId = userId;
      
      // Check if background permission is granted
      const hasPermission = await locationService.hasBackgroundPermission();
      if (!hasPermission) {
        const granted = await locationService.requestBackgroundPermission();
        if (!granted) {
          throw new Error('Background location permission required');
        }
      }

      // Define the background task
      this.defineLocationTask();
      
      return true;
    } catch (error) {
      console.error('Error initializing background service:', error);
      throw error;
    }
  }

  /**
   * Define the background location task
   */
  defineLocationTask() {
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.error('Background task error:', error);
        return;
      }

      if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
          await this.handleLocationUpdate(
            location.coords.latitude,
            location.coords.longitude
          );
        }
      }
    });
  }

  /**
   * Start background location tracking
   */
  async startBackgroundTracking() {
    try {
      if (this.isRunning) {
        console.log('Background tracking already running');
        return;
      }

      const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      if (!isTaskDefined) {
        this.defineLocationTask();
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 50, // Update every 50 meters
        timeInterval: CHECK_INTERVAL,
        foregroundService: {
          notificationTitle: 'Murmr is active',
          notificationBody: 'Checking for location-based reminders',
          notificationColor: '#31694E',
        },
      });

      this.isRunning = true;
      console.log('✅ Background location tracking started');
      return true;
    } catch (error) {
      console.error('Error starting background tracking:', error);
      throw error;
    }
  }

  /**
   * Stop background location tracking
   */
  async stopBackgroundTracking() {
    try {
      const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      
      if (isTaskDefined) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      this.isRunning = false;
      console.log('❌ Background location tracking stopped');
    } catch (error) {
      console.error('Error stopping background tracking:', error);
    }
  }

  /**
   * Handle location update from background task
   */
  async handleLocationUpdate(latitude, longitude) {
    try {
      if (!this.userId) {
        const storedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (storedUserId) {
          const prefs = JSON.parse(storedUserId);
          this.userId = prefs.userId;
        } else {
          return; // No user ID available
        }
      }

      // Fetch nearby notes from API
      const response = await apiService.getNearbyNotes(
        latitude,
        longitude,
        this.userId,
        200 // 200 meters radius
      );

      if (response.data && response.data.length > 0) {
        // Trigger notifications for nearby notes
        for (const note of response.data) {
          await this.triggerNoteReminder(note);
        }
      }
    } catch (error) {
      console.error('Error handling location update:', error);
    }
  }

  /**
   * Trigger reminder notification for a note
   */
  async triggerNoteReminder(note) {
    try {
      // Check if this note was already triggered recently
      const lastTriggered = await this.getLastTriggeredTime(note._id);
      const now = Date.now();
      
      // Don't trigger if triggered within last hour
      if (lastTriggered && (now - lastTriggered) < 3600000) {
        return;
      }

      // Send notification
      await notificationService.sendImmediateNotification(
        '🎙️ Murmr Reminder',
        note.title || 'You have a voice note waiting for you',
        {
          noteId: note._id,
          audioUri: note.audioUri,
          type: 'location_reminder',
        }
      );

      // Mark as triggered in backend
      await apiService.triggerNote(note._id);

      // Store last triggered time locally
      await this.setLastTriggeredTime(note._id, now);

      console.log(`✅ Triggered reminder for note: ${note._id}`);
    } catch (error) {
      console.error('Error triggering note reminder:', error);
    }
  }

  /**
   * Get last triggered time for a note
   */
  async getLastTriggeredTime(noteId) {
    try {
      const key = `@murmr_last_triggered_${noteId}`;
      const timestamp = await AsyncStorage.getItem(key);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Set last triggered time for a note
   */
  async setLastTriggeredTime(noteId, timestamp) {
    try {
      const key = `@murmr_last_triggered_${noteId}`;
      await AsyncStorage.setItem(key, timestamp.toString());
    } catch (error) {
      console.error('Error setting last triggered time:', error);
    }
  }

  /**
   * Check time-based reminders (to be called periodically)
   */
  async checkTimeBasedReminders() {
    try {
      if (!this.userId) return;

      const now = new Date();
      const response = await apiService.getNotes(this.userId, 'time');

      if (response && response.length > 0) {
        for (const note of response) {
          const reminderTime = new Date(note.tagValue.timestamp);
          
          // Check if reminder time has passed and not triggered yet
          if (reminderTime <= now && !note.isTriggered) {
            await this.triggerNoteReminder(note);
          }
        }
      }
    } catch (error) {
      console.error('Error checking time-based reminders:', error);
    }
  }

  /**
   * Schedule time-based reminder
   */
  async scheduleTimeReminder(note) {
    try {
      const reminderTime = new Date(note.tagValue.timestamp);
      
      await notificationService.scheduleTimedNotification(
        '🎙️ Murmr Reminder',
        note.title || 'Time to listen to your voice note',
        reminderTime,
        {
          noteId: note._id,
          audioUri: note.audioUri,
          type: 'time_reminder',
        }
      );

      console.log(`⏰ Scheduled time reminder for: ${reminderTime}`);
    } catch (error) {
      console.error('Error scheduling time reminder:', error);
    }
  }

  /**
   * Check if background task is running
   */
  async isBackgroundTaskRunning() {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      return isRegistered;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get background task status
   */
  async getTaskStatus() {
    try {
      const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      
      return {
        isDefined: isTaskDefined,
        isRegistered: isTaskRegistered,
        isRunning: this.isRunning,
      };
    } catch (error) {
      console.error('Error getting task status:', error);
      return null;
    }
  }

  /**
   * Cleanup
   */
  async cleanup() {
    await this.stopBackgroundTracking();
    this.userId = null;
    this.isRunning = false;
  }
}

// Export singleton instance
export default new BackgroundService();