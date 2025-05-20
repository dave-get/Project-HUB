'use client';

import React, { useState } from 'react';

// Define the Proposal interface
interface Proposal {
  id: number;
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  submittedTime: string;
  status: "Pending" | "Approved" | "Rejected";
}

// Sample proposals data
const proposals: Proposal[] = [
  {
    id: 1,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Approved",
  },
  {
    id: 2,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Rejected",
  },
  {
    id: 3,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Pending",
  },
];

// Define the props for the ProposalCard component
interface ProposalCardProps {
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  showFeedbackBtn: boolean;
}

// ProposalCard component
const ProposalCard: React.FC<ProposalCardProps> = ({
  title,
  department,
  submitter,
  submittedDate,
  status,
  showFeedbackBtn,
}) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-md relative">
      <h3 className="font-semibold text-black">{title}</h3>
      <p className="text-sm text-black">Department: {department}</p>
      <p className="text-sm text-black">Submitted by: {submitter}</p>
      <p className="text-sm text-black">Submitted on: <span className="text-right">{submittedDate}</span></p>
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 rounded-full text-white ${
          status === "Approved" ? "bg-green-600" : status === "Rejected" ? "bg-red-600" : "bg-yellow-600"
        }`}>
          {status}
        </span>
      </div>
      {showFeedbackBtn && (
        <div className="text-right mt-2">
          <button className="px-3 py-1 text-black border border-black rounded hover:bg-black hover:text-white">
            View Proposal
          </button>
        </div>
      )}
    </div>
  );
};

// Main Proposals Page component
const ProposalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState("All Priorities");
  const [date, setDate] = useState("");

  return (
    <div className="bg-gray-100 h-screen p-6 overflow-y-auto font-sans">
      <h1 className="text-2xl font-bold mb-2 text-black">Proposals</h1>
      <p className="text-gray-600 mb-6">Submitted proposal & New proposal</p>

      <div className="flex gap-3 mb-6 items-center">
        <input
          type="search"
          placeholder="Search proposals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border rounded-md border-gray-300 p-2 bg-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border rounded-md border-gray-300 p-2 bg-gray-200 text-black"
        >
          <option className="bg-gray-200 text-black">All Priorities</option>
          <option className="bg-white text-black">High</option>
          <option className="bg-white text-black">Medium</option>
          <option className="bg-white text-black">Low</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md border-gray-300 p-2 bg-white text-black"

        />
        <button className="bg-gray-300 text-black rounded-md px-4 py-2">
          New Proposal
        </button>
      </div>

      <h2 className="text-lg font-bold mb-2 text-black">Pending Proposals</h2>
      {proposals.filter(p => p.status === "Pending").map(proposal => (
        <ProposalCard key={proposal.id} {...proposal} showFeedbackBtn={false} />
      ))}

      <h2 className="text-lg font-bold mb-2 text-black">Approved Proposals</h2>
      {proposals.filter(p => p.status === "Approved").map(proposal => (
        <ProposalCard key={proposal.id} {...proposal} showFeedbackBtn={true} />
      ))}

      <h2 className="text-lg font-bold mb-2 text-black">Rejected Proposals</h2>
      {proposals.filter(p => p.status === "Rejected").map(proposal => (
        <ProposalCard key={proposal.id} {...proposal} showFeedbackBtn={false} />
      ))}
    </div>
  );
};

export default ProposalsPage;