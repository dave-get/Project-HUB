import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import {  USER_ROUTES } from "@/config/api.config";
import { UserType, profileType } from "@/type/profile";

export const profileApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<UserType, void>({
      query: () => ({
        url: USER_ROUTES.BASE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<UserType, FormData>({
      query: (data) => {
        const formData = new FormData();
        if (data.get("file")) formData.append("imageUrl", data.get("file") as File);
        if (data.get('fullName')) formData.append("fullName", data.get("fullName") as string);
        if (data.get('phone')) formData.append("phone", data.get("phone") as string);
        if (data.get('location')) formData.append("location", data.get("location") as string);
        if (data.get('bio')) formData.append("bio", data.get("bio") as string);
        if (data.get('department')) formData.append("department", data.get("department") as string);
        if (data.get('socialLinks')) formData.append("socialLinks", data.get("socialLinks") as string);
        if (data.get('skills')) formData.append("skills", data.get("skills") as string);
        if (data.get('currentPassword')) formData.append("currentPassword", data.get("currentPassword") as string);
        if (data.get('password')) formData.append("password", data.get("password") as string);
        
        

        return {
          url: USER_ROUTES.UPDATE,
          method: "PUT",
          body: formData,
          token: Cookies.get("access_token"),
          formData: true,
        };
      },
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<{ message: string }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: `${USER_ROUTES.BASE}/change-password`,
        method: "POST",
        body: data,
        token: Cookies.get("access_token"),
      }),
    }),
  }),
});

export const { 
  useGetUserQuery, 
  useUpdateUserMutation, 
  useChangePasswordMutation,
} = profileApi;
