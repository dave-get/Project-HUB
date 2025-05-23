'use client';

import React from 'react';
import { ProposalCard } from './ProposalCard';
import { useGetProposalsQuery } from '@/features/proposalsApi/proposalsApi';
import { Submission } from '@/type/proposal';

const ApprovedProposals = () => {
  const { data: proposals } = useGetProposalsQuery();
  
  const approvedProposals = proposals?.data?.filter(
    (proposal: Submission) => proposal.feedbackList[0]?.status === "Approved"
  ) || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Approved Proposals</h1>
        <p className="text-muted-foreground">View all approved proposals</p>
      </div>
      
      <div className="grid gap-4">
        {approvedProposals.map((proposal: Submission) => (
          <ProposalCard
            key={proposal._id}
            proposals={proposal}
            layout="list"
          />
        ))}
      </div>
    </div>
  );
};

export default ApprovedProposals;