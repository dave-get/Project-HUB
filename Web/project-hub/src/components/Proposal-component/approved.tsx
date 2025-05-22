'use client';

import React from 'react';

interface Proposal {
  id: number;
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  submittedTime: string;
  status: "Approved"; // Narrowed to only Approved
}

const approvedProposals: Proposal[] = [
  {
    id: 1,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Approved",
  },
  // Add more approved proposals as needed
];

const ApprovedProposals = () => {
  return (
    <div className="bg-gray-100 p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-black">Approved Proposals</h1>
      
      <div className="space-y-4">
        {approvedProposals.map(proposal => (
          <div key={proposal.id} className="border rounded-lg p-4 bg-white shadow-md relative">
            <h3 className="font-semibold text-black">{proposal.title}</h3>
            <p className="text-sm text-black">Department: {proposal.department}</p>
            <p className="text-sm text-black">Submitted by: {proposal.submitter}</p>
            <p className="text-sm text-black">Submitted on: {proposal.submittedDate}</p>
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 rounded-full text-white bg-green-600">
                {proposal.status}
              </span>
            </div>
            <div className="text-right mt-2">
              <button className="px-3 py-1 text-black border border-black rounded hover:bg-black hover:text-white">
                View Proposal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedProposals;