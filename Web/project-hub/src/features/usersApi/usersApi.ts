import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { profileType } from "@/type/profile";
import { USER_ROUTES } from "@/config/api.config";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get all users with optional filtering
    getUsers: builder.query<profileType[], void>({
      query: (params) => ({
        url: USER_ROUTES.PROFILE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: ["User"],
    }),
    getStudents: builder.query<profileType[], void>({
      query: () => ({
        url: USER_ROUTES.PROFILE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      transformResponse: (response: any) => {
        const users = Array.isArray(response) ? response : response?.data || [];
        return users.filter((user: profileType) => user.role === "student");
      },
      providesTags: ["User"],
    }),
    // Get teachers only
    getTeachers: builder.query<profileType[], void>({
      query: () => ({
        url: USER_ROUTES.PROFILE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      transformResponse: (response: any) => {
        const users = Array.isArray(response) ? response : response?.data || [];
        return users.filter((user: profileType) => user.role === "teacher");
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetTeachersQuery, useGetStudentsQuery } =
  usersApi;
