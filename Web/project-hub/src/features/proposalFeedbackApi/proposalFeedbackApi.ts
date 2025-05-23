import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROPOSAL_FEEDBACK_ROUTES } from "@/config/api.config";

// Define the feedback section type
export interface FeedbackSection {
  title: string;
  rating: number;
  strengths: string;
  areasForImprovement: string;
  comments: string;
}

// Define the attachment type
export interface FeedbackAttachment {
  fileName: string;
  size: string;
  downloadLink: string;
}

// Define the feedback type
export interface ProposalFeedback {
  id: string;
  proposalId: string;
  userId: string;
  projectTitle: string;
  sections: FeedbackSection[];
  attachments: FeedbackAttachment[];
  createdAt: string;
  updatedAt: string;
}

// Define the create feedback request type
export interface CreateFeedbackRequest {
  proposalId: string;
  projectTitle: string;
  sections: FeedbackSection[];
  attachments: FeedbackAttachment[];
}

// Define the update feedback request type
export interface UpdateFeedbackRequest {
  id: string;
  projectTitle?: string;
  sections?: FeedbackSection[];
  attachments?: FeedbackAttachment[];
}

export const proposalFeedbackApi = createApi({
  reducerPath: "proposalFeedbackApi",
  baseQuery,
  tagTypes: ["ProposalFeedback"],
  endpoints: (builder) => ({
    // Get feedback for a specific proposal
    getProposalFeedback: builder.query<ProposalFeedback[], string>({
      query: (proposalId) => ({
        url: PROPOSAL_FEEDBACK_ROUTES.BY_ID(proposalId),
        method: "GET",
        token: Cookies.get("access_token"),
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ProposalFeedback" as const, id })),
              { type: "ProposalFeedback", id: "LIST" },
            ]
          : [{ type: "ProposalFeedback", id: "LIST" }],
    }),

    // Create new feedback
    createFeedback: builder.mutation<ProposalFeedback, CreateFeedbackRequest>({
      query: ({ proposalId, ...data }) => ({
        url: PROPOSAL_FEEDBACK_ROUTES.BY_ID(proposalId),
        method: "POST",
        body: data,
        token: Cookies.get("access_token"),
      }),
      invalidatesTags: [{ type: "ProposalFeedback", id: "LIST" }],
    }),

    // Update existing feedback
    updateFeedback: builder.mutation<ProposalFeedback, UpdateFeedbackRequest>({
      query: ({ id, ...data }) => ({
        url: PROPOSAL_FEEDBACK_ROUTES.BY_ID(id),
        method: "PATCH",
        body: data,
        token: Cookies.get("access_token"),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProposalFeedback", id },
        { type: "ProposalFeedback", id: "LIST" },
      ],
    }),

    // Delete feedback
    deleteFeedback: builder.mutation<void, string>({
      query: (id) => ({
        url: PROPOSAL_FEEDBACK_ROUTES.BY_ID(id),
        method: "DELETE",
        token: Cookies.get("access_token"),
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ProposalFeedback", id },
        { type: "ProposalFeedback", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProposalFeedbackQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = proposalFeedbackApi;
