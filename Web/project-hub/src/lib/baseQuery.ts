import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/config/api.config';
import Cookies from 'js-cookie';

export const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        const token = Cookies.get('access_token');
        // console.log('Token in baseQuery:', token); // Debug log
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
}); 