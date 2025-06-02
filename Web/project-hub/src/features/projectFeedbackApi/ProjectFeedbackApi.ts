import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROJECT_FEEDBACK_ROUTES } from "@/config/api.config";
import { ProjectFeedback, ProjectFeedbackList } from "@/type/project-feedback";

// Define the attachment type
export interface ProjectAttachment {
  fileName: string;
  size: string;
  downloadLink: string;
}

// Define the create feedback request type
export interface CreateProjectFeedbackRequest {
  projectId: string;
  teacherId: string;
  collaboratorIds: string[];
  rating: number;
  feedbackText: string;
  status: string;
  attachments?: File[];
}

export const projectFeedbackApi = createApi({
  reducerPath: "projectFeedbackApi",
  baseQuery,
  tagTypes: ["ProjectFeedback"],
  endpoints: (builder) => ({
    // Get feedback for a specific project
    getProjectFeedback: builder.query<ProjectFeedback, string>({
      query: (projectId) => ({
        url: PROJECT_FEEDBACK_ROUTES.BY_ID(projectId),
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "ProjectFeedback" as const, id: result.id },
              { type: "ProjectFeedback", id: "LIST" },
            ]
          : [{ type: "ProjectFeedback", id: "LIST" }],
    }),

    // Create new feedback
    createFeedback: builder.mutation<
      ProjectFeedback,
      CreateProjectFeedbackRequest
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("projectId", data.projectId);
        formData.append("teacherId", data.teacherId);
        formData.append(
          "collaboratorsId",
          JSON.stringify(data.collaboratorIds)
        );
        formData.append("rating", data.rating.toString());
        formData.append("feedbackText", data.feedbackText);
        formData.append("status", data.status);

        if (data.attachments) {
          data.attachments.forEach((file) => {
            formData.append("attachments", file);
          });
        }

        return {
          url: PROJECT_FEEDBACK_ROUTES.BASE,
          method: "POST",
          body: formData,
          token: Cookies.get("access_token"),
        };
      },
      invalidatesTags: [{ type: "ProjectFeedback", id: "LIST" }],
    }),
  }),
});

export const { useGetProjectFeedbackQuery, useCreateFeedbackMutation } =
  projectFeedbackApi;
