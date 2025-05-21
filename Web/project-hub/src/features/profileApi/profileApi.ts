import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { USER_ROUTES } from "@/config/api.config";
import { UserType } from "@/type/profile";

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
  }),
});

export const { useGetUserQuery } = profileApi;
