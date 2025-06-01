import ProposalReview from "@/components/view-proposal-feedback-component/view-proposal-feedback";
import React from "react";

interface ProposalViewFeedbackProps {
  params: {
    proposalid: string;
  };
}

const page = ({ params }: ProposalViewFeedbackProps) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Proposal Feedback
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          feedback and evaluation for the research proposal
        </p>
      </div>

      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a
              href="/proposal"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Proposals
            </a>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">
            Feedback
          </li>
        </ol>
      </nav>

      <ProposalReview proposalid={params.proposalid} />
    </div>
  );
};

export default page;
