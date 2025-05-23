'use client';

import React from 'react';

interface Proposal {
  id: number;
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  submittedTime: string;
  status: "Rejected"; // Narrowed to only Rejected
}

const rejectedProposals: Proposal[] = [
  {
    id: 2,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Rejected",
  },
  // Add more rejected proposals as needed
];

const RejectedProposals = () => {
  return (
    <div className="bg-gray-100 p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-black">Rejected Proposals</h1>
      
      <div className="space-y-4">
        {rejectedProposals.map(proposal => (
          <div key={proposal.id} className="border rounded-lg p-4 bg-white shadow-md relative">
            <h3 className="font-semibold text-black">{proposal.title}</h3>
            <p className="text-sm text-black">Department: {proposal.department}</p>
            <p className="text-sm text-black">Submitted by: {proposal.submitter}</p>
            <p className="text-sm text-black">Submitted on: {proposal.submittedDate}</p>
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 rounded-full text-white bg-red-600">
                {proposal.status}
              </span>
            </div>
            {/* No View button for rejected proposals */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RejectedProposals;