// src/context/NotesContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';
import backgroundService from '../services/backgroundService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { showErrorAlert, showSuccessAlert, generateId } from '../utils/helpers';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize app - get or create user ID
   */
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);

      // Get or create user ID
      let storedPrefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      let currentUserId;

      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        currentUserId = prefs.userId;
      } else {
        // Generate new user ID (in production, this would be from auth)
        currentUserId = generateId();
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PREFERENCES,
          JSON.stringify({ userId: currentUserId })
        );
      }

      setUserId(currentUserId);

      // Initialize services
      await notificationService.initialize();
      await backgroundService.initialize(currentUserId);

      // Fetch notes
      await fetchNotes(currentUserId);

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      showErrorAlert('Failed to initialize app. Please restart.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all notes from API
   */
  const fetchNotes = async (uid = userId) => {
    try {
      setLoading(true);
      const response = await apiService.getNotes(uid);
      setNotes(response || []);
      
      // Cache notes locally
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_NOTES, JSON.stringify(response || []));
    } catch (error) {
      console.error('Error fetching notes:', error);
      
      // Try to load from cache
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_NOTES);
      if (cached) {
        setNotes(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new note
   */
  const createNote = async (noteData) => {
    try {
      setLoading(true);

      const response = await apiService.createNote({
        ...noteData,
        userId,
      });

      // Add to local state
      setNotes(prev => [response, ...prev]);

      // Schedule notification if time-based
      if (noteData.tagType === 'time') {
        await backgroundService.scheduleTimeReminder(response);
      }

      showSuccessAlert(SUCCESS_MESSAGES.NOTE_SAVED);
      return response;
    } catch (error) {
      console.error('Error creating note:', error);
      showErrorAlert(ERROR_MESSAGES.SAVE_FAILED);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update note
   */
  const updateNote = async (noteId, updateData) => {
    try {
      setLoading(true);

      const response = await apiService.updateNote(noteId, updateData);

      // Update local state
      setNotes(prev =>
        prev.map(note => (note._id === noteId ? response : note))
      );

      showSuccessAlert('Note updated successfully');
      return response;
    } catch (error) {
      console.error('Error updating note:', error);
      showErrorAlert('Failed to update note');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete note
   */
  const deleteNote = async (noteId, audioUri) => {
    try {
      setLoading(true);

      // Delete from API
      await apiService.deleteNote(noteId);

      // Delete audio file
      if (audioUri) {
        await audioService.deleteAudio(audioUri);
      }

      // Remove from local state
      setNotes(prev => prev.filter(note => note._id !== noteId));

      showSuccessAlert(SUCCESS_MESSAGES.NOTE_DELETED);
    } catch (error) {
      console.error('Error deleting note:', error);
      showErrorAlert(ERROR_MESSAGES.DELETE_FAILED);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get notes by tag type
   */
  const getNotesByTagType = useCallback((tagType) => {
    return notes.filter(note => note.tagType === tagType);
  }, [notes]);

  /**
   * Get notes by mood
   */
  const getNotesByMood = useCallback((moodId) => {
    return notes.filter(
      note => note.tagType === 'mood' && note.tagValue.moodId === moodId
    );
  }, [notes]);

  /**
   * Start background location tracking
   */
  const startBackgroundTracking = async () => {
    try {
      await backgroundService.startBackgroundTracking();
      return true;
    } catch (error) {
      console.error('Error starting background tracking:', error);
      return false;
    }
  };

  /**
   * Stop background location tracking
   */
  const stopBackgroundTracking = async () => {
    try {
      await backgroundService.stopBackgroundTracking();
    } catch (error) {
      console.error('Error stopping background tracking:', error);
    }
  };

  /**
   * Refresh notes
   */
  const refreshNotes = async () => {
    await fetchNotes();
  };

  const value = {
    // State
    notes,
    loading,
    userId,
    isInitialized,

    // Actions
    createNote,
    updateNote,
    deleteNote,
    fetchNotes,
    refreshNotes,
    getNotesByTagType,
    getNotesByMood,
    startBackgroundTracking,
    stopBackgroundTracking,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export default NotesContext;