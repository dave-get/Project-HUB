export const API_BASE_URL = 'https://project-hub-qikh.onrender.com';

// Auth routes
export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
} as const;

// User routes
export const USER_ROUTES = {
    BASE: '/auth/profile',
} as const;

// Combine all routes for easy access
export const API_ROUTES = {
    AUTH: AUTH_ROUTES,
    USERS: USER_ROUTES,
} as const;