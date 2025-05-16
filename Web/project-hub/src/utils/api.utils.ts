import { API_BASE_URL } from '@/config/api.config';
import { getAuthToken } from './cookie.utils';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    const { requiresAuth = true, ...fetchOptions } = options;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new ApiError(response.status, error.message || 'An error occurred');
    }

    return response.json();
};

// GET request
export const get = <T>(endpoint: string, options?: RequestOptions) => {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
};

// POST request
export const post = <T>(endpoint: string, data?: any, options?: RequestOptions) => {
    return apiRequest<T>(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
};

// PUT request
export const put = <T>(endpoint: string, data?: any, options?: RequestOptions) => {
    return apiRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
};

// DELETE request
export const del = <T>(endpoint: string, options?: RequestOptions) => {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
};

// PATCH request
export const patch = <T>(endpoint: string, data?: any, options?: RequestOptions) => {
    return apiRequest<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
    });
}; 