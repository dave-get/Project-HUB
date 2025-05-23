export const API_BASE_URL = 'https://project-hub-qikh.onrender.com';

// Auth routes
export const AUTH_ROUTES = {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
} as const;

// User routes
export const PROFILE_ROUTES = {
    BASE: '/api/auth/users',
} as const;

export const USER_ROUTES = {
    BASE: '/api/auth/profile',
    UPDATE: '/api/users/update',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
}

// Proposal Feedback routes
export const PROPOSAL_FEEDBACK_ROUTES = {
    BASE: '/feedback/proposal',
    BY_ID: (id: string) => `/feedback/proposal/${id}`,
} as const;

// Proposal Submit routes
export const PROPOSAL_SUBMIT_ROUTES = {
    SUBMIT: "/proposals/submit",
} as const;

export const PROPOSALS_ROUTES = {
    BASE: '/proposals',
}
// Combine all routes for easy access
export const API_ROUTES = {
    AUTH: AUTH_ROUTES,
    USERS: PROFILE_ROUTES,
    PROPOSAL_FEEDBACK: PROPOSAL_FEEDBACK_ROUTES,
    PROPOSALS: PROPOSALS_ROUTES,
} as const;