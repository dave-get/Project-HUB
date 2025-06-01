import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROJECT_ROUTES } from "@/config/api.config";

export interface Comment {
  commenterId: string;
  name: string;
  image?: string;
  text: string;
  likes: number;
  createdAt: Date;
  _id?: string;
}

export interface CreateCommentRequest {
  projectId: string;
  commenterId: string;
  name: string;
  text: string;
  image?: string;
}

export interface DeleteCommentRequest {
  projectId: string;
  commentId: string;
}

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery,
  tagTypes: ["Comments", "Project"],
  endpoints: (builder) => ({
    // Add a new comment
    addComment: builder.mutation<Comment, CreateCommentRequest>({
      query: ({ projectId, ...commentData }) => ({
        url: `${PROJECT_ROUTES.BASE}/${projectId}/comment`,
        method: "POST",
        body: commentData,
        token: Cookies.get("access_token"),
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Comments", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<void, DeleteCommentRequest>({
      query: ({ projectId, commentId }) => ({
        url: `${PROJECT_ROUTES.BASE}/${projectId}/comment/${commentId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Comments", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
  }),
});

export const { useAddCommentMutation, useDeleteCommentMutation } = commentsApi;
