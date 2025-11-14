// src/services/audioService.js

import { Audio } from 'expo-av';
import { AUDIO_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import * as FileSystem from 'expo-file-system';
import { generateId } from '../utils/helpers';

class AudioService {
  constructor() {
    this.recording = null;
    this.sound = null;
    this.recordingUri = null;
  }

  /**
   * Initialize audio mode
   */
  async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw new Error('Failed to initialize audio');
    }
  }

  /**
   * Start recording
   */
  async startRecording() {
    try {
      // Request permissions first
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error(ERROR_MESSAGES.AUDIO_PERMISSION);
      }

      await this.initializeAudio();

      // Create recording
      const { recording } = await Audio.Recording.createAsync(
        AUDIO_CONFIG.RECORDING_OPTIONS
      );

      this.recording = recording;
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error(ERROR_MESSAGES.RECORDING_FAILED);
    }
  }

  /**
   * Stop recording and return audio details
   */
  async stopRecording() {
    try {
      if (!this.recording) {
        throw new Error('No active recording');
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      // Generate unique filename
      const filename = `murmr_${generateId()}.m4a`;
      const newUri = `${FileSystem.documentDirectory}${filename}`;

      // Move file to permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      const audioDetails = {
        uri: newUri,
        duration: status.durationMillis,
        filename,
      };

      this.recording = null;
      return audioDetails;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw new Error(ERROR_MESSAGES.RECORDING_FAILED);
    }
  }

  /**
   * Get recording status
   */
  async getRecordingStatus() {
    if (!this.recording) return null;
    try {
      return await this.recording.getStatusAsync();
    } catch (error) {
      console.error('Error getting recording status:', error);
      return null;
    }
  }

  /**
   * Cancel recording
   */
  async cancelRecording() {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  }

  /**
   * Load and play audio
   */
  async playAudio(uri) {
    try {
      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      await this.initializeAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      await sound.playAsync();
      return sound;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw new Error(ERROR_MESSAGES.PLAYBACK_FAILED);
    }
  }

  /**
   * Pause audio
   */
  async pauseAudio() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  /**
   * Resume audio
   */
  async resumeAudio() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  }

  /**
   * Stop audio
   */
  async stopAudio() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  /**
   * Get playback status
   */
  async getPlaybackStatus() {
    if (!this.sound) return null;
    try {
      return await this.sound.getStatusAsync();
    } catch (error) {
      console.error('Error getting playback status:', error);
      return null;
    }
  }

  /**
   * Set playback position
   */
  async setPositionAsync(position) {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
      }
    } catch (error) {
      console.error('Error setting position:', error);
    }
  }

  /**
   * Playback status update callback
   */
  onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      console.log('Playback finished');
    }
  };

  /**
   * Delete audio file
   */
  async deleteAudio(uri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting audio:', error);
      return false;
    }
  }

  /**
   * Cleanup
   */
  async cleanup() {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  }
}

// Export singleton instance
export default new AudioService();