import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROJECT_ROUTES } from "@/config/api.config";
import { Projects, Project } from "@/type/project";

interface LikeProjectRequest {
  projectId: string;
  userId: string;
}

export const getProjectsApi = createApi({
  reducerPath: "getProjectsApi",
  baseQuery,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    // Get all projects
    getAllProjects: builder.query<Projects, void>({
      query: () => ({
        url: PROJECT_ROUTES.BASE,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<{ project: Project }, string>({
      query: (id) => ({
        url: `${PROJECT_ROUTES.BASE}/${id}`,
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: ["Project"],
    }),
    // Like a project
    likeProject: builder.mutation<Project, LikeProjectRequest>({
      query: ({ projectId, userId }) => ({
        url: `${PROJECT_ROUTES.BASE}/${projectId}/like`,
        method: "POST",
        body: { userId },
        token: Cookies.get("access_token"),
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useLikeProjectMutation,
} = getProjectsApi;
