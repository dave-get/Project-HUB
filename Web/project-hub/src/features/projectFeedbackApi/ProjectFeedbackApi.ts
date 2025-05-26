import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROJECT_FEEDBACK_ROUTES } from "@/config/api.config";

// Define the project feedback type
export interface ProjectFeedback {
  id: string;
  projectId: string;
  teacherId: string;
  collaboratorIds: string[];
  userId: string;
  rating: number;
  feedback: string;
  status: string;
  attachments: ProjectAttachment[];
}

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
  feedback: string;
  status: string;
  attachments?: File[];
}

// Define the update feedback request type
export interface UpdateProjectFeedbackRequest {
  id: string;
  teacherId?: string;
  collaboratorIds?: string[];
  rating?: number;
  feedback?: string;
  status?: string;
  attachments?: ProjectAttachment[];
}

export const projectFeedbackApi = createApi({
  reducerPath: "projectFeedbackApi",
  baseQuery,
  tagTypes: ["ProjectFeedback"],
  endpoints: (builder) => ({
    // Get feedback for a specific project
    getProjectFeedback: builder.query<ProjectFeedback[], string>({
      query: (projectId) => ({
        url: PROJECT_FEEDBACK_ROUTES.BY_ID(projectId),
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ProjectFeedback" as const,
                id,
              })),
              { type: "ProjectFeedback", id: "LIST" },
            ]
          : [{ type: "ProjectFeedback", id: "LIST" }],
    }),

    // Create new feedback
    createFeedback: builder.mutation<
      ProjectFeedback,
      CreateProjectFeedbackRequest
    >({
      query: ({ projectId, ...data }) => {
        const formData = new FormData();
        formData.append("projectId", projectId);
        formData.append("teacherId", data.teacherId);
        formData.append(
          "collaboratorIds",
          JSON.stringify(data.collaboratorIds)
        );
        formData.append("rating", data.rating.toString());
        formData.append("feedback", data.feedback);
        formData.append("status", data.status);

        if (data.attachments) {
          data.attachments.forEach((file) => {
            formData.append("attachments", file);
          });
        }

        return {
          url: PROJECT_FEEDBACK_ROUTES.BY_ID(projectId),
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
