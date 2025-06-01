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
import Link from "next/link";
import { UserType } from "@/type/profile";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
const ProposalReview = ({ proposalid }: { proposalid: string }) => {
  const { data } = useGetProposalsQuery();
  const { data: teachers } = useGetTeachersQuery();
  const { data: user } = useGetUserQuery();

  const proposalData = data as SubmissionResponse;
  const proposal = proposalData?.data?.find(
    (proposal) => proposal._id === proposalid
  );

  const teacherData = user as UserType;
  const feedbackTeacherId = proposal?.feedbackList?.[0]?.teacher;
  const feedbackTeacher = teachers?.find(
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
          status={
            proposal?.feedbackList[proposal?.feedbackList.length - 1].status ||
            "Pending"
          }
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
                {proposal?.feedbackList[proposal?.feedbackList.length - 1]?.status === "Approved" &&
                teacherData?.data?.role !== "teacher" ? (
                  <div className="flex justify-end pt-6 border-t">
                    <Link href={`/project/submit`}>
                      <Button
                        size="lg"
                        className="bg-slate-700 hover:bg-slate-800"
                      >
                        Submit Project
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Attachments
              attachments={
                proposal?.feedbackList[proposal?.feedbackList.length - 1]
                  ?.attachments || []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalReview;
