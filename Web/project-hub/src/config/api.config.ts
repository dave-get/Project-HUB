export const API_BASE_URL = 'https://project-hub-qikh.onrender.com';

// Auth routes
export const AUTH_ROUTES = {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
} as const;


export const USER_ROUTES = {
    BASE: '/api/auth/profile',
    PROFILE: '/api/users',
    UPDATE: '/api/users/update',
    GET_BY_ID: (id: string) => `/api/users/${id}`,
}

// Proposal Feedback routes
export const PROPOSAL_FEEDBACK_ROUTES = {
    BASE: '/api/feedback/proposal',
    BY_ID: (id: string) => `/api/feedback/proposal/${id}`,
} as const;

// Proposal Submit routes
export const PROPOSAL_SUBMIT_ROUTES = {
    SUBMIT: "/api/proposals/submit",
} as const;

// Project Submit routes
export const PROJECT_SUBMIT_ROUTES = {
    SUBMIT: "/api/projects/create",
} as const;

export const PROPOSALS_ROUTES = {
    BASE: '/api/proposals',
}

export const PROJECT_SUBMIT_ROUTES = {
    BASE: 'api/projects/',
    SUBMIT: '/api/projects/create',
}
// Combine all routes for easy access
export const API_ROUTES = {
    AUTH: AUTH_ROUTES,
    PROPOSAL_FEEDBACK: PROPOSAL_FEEDBACK_ROUTES,
    PROPOSALS: PROPOSALS_ROUTES,
    PROJECTS: PROJECT_SUBMIT_ROUTES
} as const;