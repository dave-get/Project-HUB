import { createApi } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { baseQuery } from '@/lib/baseQuery';
import { AUTH_ROUTES } from '@/config/api.config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: AUTH_ROUTES.LOGIN,
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Store access token in cookie
                    Cookies.set('access_token', data.access_token, {
                        expires: 1, // 1 day
                        secure: true,
                        sameSite: 'strict',
                    });
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: AUTH_ROUTES.LOGOUT,
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Remove access token from cookie
                    Cookies.remove('access_token');
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
} = authApi; 