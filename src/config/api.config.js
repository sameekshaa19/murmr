// src/config/api.config.js

import { API_BASE_URL } from '../utils/constants';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const ENDPOINTS = {
  NOTES: '/notes',
  NOTE_BY_ID: (id) => `/notes/${id}`,
  TRIGGER_NOTE: (id) => `/notes/${id}/trigger`,
  NEARBY_NOTES: '/notes/nearby',
  HEALTH: '/health',
};

export default API_CONFIG;