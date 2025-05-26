"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Attachments } from "./attachments";
import { FeedbackSection } from "./feedback-section";
import { AuthorInfo } from "./author-info";
import { ProjectHeader } from "./proposal-header";
import { useGetProposalsQuery } from "@/features/proposalsApi/proposalsApi";
import { SubmissionResponse } from "@/type/proposal";
import { useGetTeachersQuery } from "@/features/usersApi/usersApi";

const ProposalReview = ({ proposalid }: { proposalid: string }) => {
  const { data } = useGetProposalsQuery();
  const { data: teachersData } = useGetTeachersQuery();

  const proposalData = data as SubmissionResponse;
  const proposal = proposalData?.data?.find(
    (proposal) => proposal._id === proposalid
  );

  const feedbackTeacherId = proposal?.feedbackList?.[0]?.teacher;
  const feedbackTeacher = teachersData?.find(
    (teacher) => teacher._id === feedbackTeacherId
  );

  console.log("Proposal Data:", proposal);
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Project Header */}
        <ProjectHeader
          title={proposal?.title || ""}
          submissionDate={proposal?.feedbackList[0].createdAt || ""}
          status={proposal?.feedbackList[0].status || "Pending"}
        />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* Author Information */}
                <AuthorInfo
                  name={feedbackTeacher?.fullName || "Unknown Teacher"}
                  department={feedbackTeacher?.department || ""}
                  avatar={feedbackTeacher?.imageUrl || ""}
                />

                {/* Feedback Sections */}
                <div className="space-y-8 mb-8">
                  {proposal?.feedbackList[0].sections?.map(
                    (feedback, index) => (
                      <FeedbackSection
                        key={index}
                        title={feedback.title}
                        rating={feedback.rating}
                        strengths={feedback.strengths}
                        areasForImprovement={feedback.areasForImprovement}
                        comments={feedback.comments}
                      />
                    )
                  )}
                </div>

                {/* Submit Button */}
                {proposal?.feedbackList[0]?.status === "Approved" ? (
                  <div className="flex justify-end pt-6 border-t">
                    <Button
                      size="lg"
                      className="bg-slate-700 hover:bg-slate-800"
                    >
                      Submit Project
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Attachments
              attachments={proposal?.feedbackList[0]?.attachments || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalReview;
