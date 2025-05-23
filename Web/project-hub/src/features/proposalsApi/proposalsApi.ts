import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROPOSALS_ROUTES } from "@/config/api.config";
import { SubmissionResponse } from "@/type/proposal";

export const proposalsApi = createApi({
  reducerPath: "proposalApi",
  baseQuery,
  tagTypes: ["proposalApi"],
  endpoints: (builder) => ({
    getProposals: builder.query<SubmissionResponse, void>({
      query: () => ({
        url: PROPOSALS_ROUTES.BASE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: ["proposalApi"],
    }),
  }),
});

export const { useGetProposalsQuery } = proposalsApi;