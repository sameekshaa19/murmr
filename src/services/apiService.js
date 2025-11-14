// src/services/apiService.js

import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api.config';
import { ERROR_MESSAGES } from '../utils/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor (for adding auth tokens in future)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here when implemented
    // const token = await getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response || error);
    
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || ERROR_MESSAGES.NETWORK_ERROR;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

/**
 * API Service Methods
 */
const apiService = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.HEALTH);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all notes for a user
  getNotes: async (userId, tagType = null) => {
    try {
      const params = { userId };
      if (tagType) params.tagType = tagType;
      
      const response = await apiClient.get(ENDPOINTS.NOTES, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single note by ID
  getNote: async (noteId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.NOTE_BY_ID(noteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new note
  createNote: async (noteData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.NOTES, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update note
  updateNote: async (noteId, updateData) => {
    try {
      const response = await apiClient.put(ENDPOINTS.NOTE_BY_ID(noteId), updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete note
  deleteNote: async (noteId) => {
    try {
      const response = await apiClient.delete(ENDPOINTS.NOTE_BY_ID(noteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark note as triggered
  triggerNote: async (noteId) => {
    try {
      const response = await apiClient.put(ENDPOINTS.TRIGGER_NOTE(noteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get nearby notes based on current location
  getNearbyNotes: async (latitude, longitude, userId, maxDistance = 200) => {
    try {
      const response = await apiClient.post(ENDPOINTS.NEARBY_NOTES, {
        latitude,
        longitude,
        userId,
        maxDistance,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;