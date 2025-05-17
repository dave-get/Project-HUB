export const API_BASE_URL = 'https://project-hub-qikh.onrender.com';

// Auth routes
export const AUTH_ROUTES = {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
} as const;

// User routes
export const USER_ROUTES = {
    BASE: '/api/auth/me',
} as const;

// Combine all routes for easy access
export const API_ROUTES = {
    AUTH: AUTH_ROUTES,
    USERS: USER_ROUTES,
} as const;