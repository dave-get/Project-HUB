import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "../features/auth/authApi";
import { profileApi } from "../features/profileApi/profileApi";
import { proposalFeedbackApi } from "../features/proposalFeedbackApi/proposalFeedbackApi";
import { proposalSubmitApi } from "@/features/proposalSubmitApi/proposalSubmitApi";
import { usersApi } from "@/features/usersApi/usersApi";
import { proposalsApi } from "@/features/proposalsApi/proposalsApi";
import { projectFeedbackApi } from "@/features/projectFeedbackApi/ProjectFeedbackApi";
import { projectSubmitApi } from "@/features/projectSubmitApi/projectSubmitApi";
import { getProjectsApi } from "@/features/getProjectsApi/getProjectsApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [proposalFeedbackApi.reducerPath]: proposalFeedbackApi.reducer,
    [proposalSubmitApi.reducerPath]: proposalSubmitApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [proposalsApi.reducerPath]: proposalsApi.reducer,
    [projectFeedbackApi.reducerPath]: projectFeedbackApi.reducer,
    [projectSubmitApi.reducerPath]: projectSubmitApi.reducer,
    [getProjectsApi.reducerPath]: getProjectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(proposalFeedbackApi.middleware)
      .concat(proposalSubmitApi.middleware)
      .concat(usersApi.middleware)
      .concat(proposalsApi.middleware)
      .concat(projectFeedbackApi.middleware)
      .concat(projectSubmitApi.middleware)
      .concat(getProjectsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
