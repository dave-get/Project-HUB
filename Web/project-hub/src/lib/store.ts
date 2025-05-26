import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from '../features/auth/authApi';
import { profileApi } from '../features/profileApi/profileApi';
import { proposalFeedbackApi } from '../features/proposalFeedbackApi/proposalFeedbackApi';
import { proposalSubmitApi } from '@/features/proposalSubmitApi/proposalSubmitApi';
import { usersApi } from '@/features/usersApi/usersApi';
import { proposalsApi } from '@/features/proposalsApi/proposalsApi';
import { projectSubmitApi } from '@/features/projectSubmitApi/projectSubmitApi';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [proposalFeedbackApi.reducerPath]: proposalFeedbackApi.reducer,
        [proposalSubmitApi.reducerPath]: proposalSubmitApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [proposalsApi.reducerPath]: proposalsApi.reducer,
        [projectSubmitApi.reducerPath]: projectSubmitApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(profileApi.middleware)
            .concat(proposalFeedbackApi.middleware)
            .concat(proposalSubmitApi.middleware)
            .concat(usersApi.middleware)
            .concat(proposalsApi.middleware)
            .concat(projectSubmitApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
