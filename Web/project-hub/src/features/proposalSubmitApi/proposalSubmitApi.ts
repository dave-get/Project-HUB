import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/baseQuery";
import Cookies from "js-cookie";
import { PROPOSAL_SUBMIT_ROUTES } from "@/config/api.config";

// Define the proposal submission type
export interface ProposalSubmission {
  studentId: string;
  teacherId: string;
  title: string;
  proposalFile: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  };
  status: "pending";
}

// Define the create proposal submission request type
export interface CreateProposalSubmissionRequest {
  studentId: string;
  teacherId: string;
  title: string;
  proposalFile: File;
}

export const proposalSubmitApi = createApi({
  reducerPath: "proposalSubmitApi",
  baseQuery,
  tagTypes: ["ProposalSubmission"],
  endpoints: (builder) => ({
    // Create new proposal submission
    submitProposal: builder.mutation<ProposalSubmission, CreateProposalSubmissionRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("studentId", data.studentId);
        formData.append("teacherId", data.teacherId);
        formData.append("title", data.title);
        formData.append("proposalFile", data.proposalFile);

        return {
          url: PROPOSAL_SUBMIT_ROUTES.SUBMIT,
          method: "POST",
          body: formData,
          token: Cookies.get("access_token"),
          formData: true,
        };
      },
      invalidatesTags: [{ type: "ProposalSubmission", id: "LIST" }],
    }),
  }),
});

export const {
  useSubmitProposalMutation,
} = proposalSubmitApi;
