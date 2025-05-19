import { createApi } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { baseQuery } from '@/lib/baseQuery';
import { AUTH_ROUTES } from '@/config/api.config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
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
                    Cookies.set('access_token', data.accessToken, {
                        expires: 1,
                        secure: true,
                        sameSite: 'strict',
                    });
                } catch (error) {
                    // Silent fail - error is handled by the component
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