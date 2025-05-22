import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/config/api.config';
import Cookies from 'js-cookie';

export const baseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers) => {
        const token = Cookies.get('access_token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
}); 