import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
<<<<<<< HEAD
import { PROJECT_SUBMIT_ROUTES } from "@/config/api.config";
import { ProjectFormValues } from "@/components/project-submission-component/schemas/project";
import { ProjectSubmissionResponse } from "@/type/project";
=======
import { PROJECT_ROUTES } from "@/config/api.config";
import { ProjectFormValues } from "@/components/project-submission-component/schemas/project";
import { Project } from "@/type/project";
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527

// Define the project submission response type

export const projectSubmitApi = createApi({
  reducerPath: "projectSubmitApi",
  baseQuery,
  tagTypes: ["ProjectSubmission"],
  endpoints: (builder) => ({
    // Create new project submission
<<<<<<< HEAD
    submitProject: builder.mutation<ProjectSubmissionResponse, FormData>({
      query: (data) => {
        console.log('Submitting project to:', PROJECT_SUBMIT_ROUTES.SUBMIT);
        return {
          url: PROJECT_SUBMIT_ROUTES.SUBMIT,
=======
    submitProject: builder.mutation<Project, FormData>({
      query: (data) => {
        // console.log('Submitting project to:', PROJECT_ROUTES.SUBMIT);
        return {
          url: PROJECT_ROUTES.SUBMIT,
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527
          method: "POST",
          body: data,
          token: Cookies.get("access_token"),
          formData: true,
        };
      },
      invalidatesTags: [{ type: "ProjectSubmission", id: "LIST" }],
    }),
  }),
});

export const {
  useSubmitProjectMutation,
} = projectSubmitApi; 