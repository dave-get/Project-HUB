// src/components/ui/proposal-card.tsx
'use client';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
};

interface ProposalCardProps {
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  submittedTime: string;
  status: keyof typeof statusStyles;
  showFeedbackBtn?: boolean;
}

export const ProposalCard = ({
  title,
  department,
  submitter,
  submittedDate,
  submittedTime,
  status,
  showFeedbackBtn = false,
}: ProposalCardProps) => {
  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-sm flex justify-between items-start flex-col sm:flex-row gap-4">
      {/* Your card content here */}
    </div>
  );
};