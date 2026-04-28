// ─────────────────────────────────────────────────────────────────────────────
// API CONFIGURATION
// Set EXPO_PUBLIC_API_URL in your .env file to point to your backend.
// ─────────────────────────────────────────────────────────────────────────────

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Token storage ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'auth_token';

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}


// ── Authenticated fetch ───────────────────────────────────────────────────────

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
}

export const Endpoints = {
  auth: {
    session: '/auth/session/',   // GET  — validate existing token
    login: '/auth/login/',       // POST — phone/email + password
    google: '/auth/google/',     // POST — google OAuth
    otp: {
      request: '/auth/otp/request/', // POST — send OTP to phone
      verify: '/auth/otp/verify/',   // POST — verify OTP
    },
  },

  location: {
    current: '/location/current/',     // GET         — user's saved/detected location
    search: '/location/search/',      // GET ?q=     — autocomplete location search
    save: '/location/save/',        // POST        — save selected location
  },

  search: {
    query: '/search/',                 // GET ?q=&city= — global content search
  },

  navigation: {
    menus: '/navigation/menus/',       // GET ?city=  — returns visible menu tabs for the city
  },

  bookmarks: {
    list: '/bookmarks/',             // GET         — list saved bookmarks
    save: '/bookmarks/',             // POST        — save a bookmark
    remove: '/bookmarks/:id/',         // DELETE      — remove a bookmark
  },

  profile: {
    get: '/profile/',               // GET         — fetch user profile
    update: '/profile/',               // PATCH       — update user profile
  },

  bookings: {
    types: '/bookings/types/',         // GET         — booking category types
    list: '/bookings/',               // GET ?type=  — list user bookings
  },
} as const;
