/**
 * api.js
 * Central fetch helper for FreshPick.
 *
 * In development: VITE_API_URL is empty, so all requests go to /api/...
 * and Vite's proxy forwards them to http://localhost:8000.
 *
 * In production: set VITE_API_URL=https://your-backend.onrender.com
 * and all requests will go directly to the deployed backend.
 */

const BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Authenticated fetch — automatically adds Bearer token from localStorage.
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
  return fetch(`${BASE}${path}`, { ...options, headers });
}

/**
 * Public fetch — no auth header.
 */
export async function publicFetch(path, options = {}) {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
}
