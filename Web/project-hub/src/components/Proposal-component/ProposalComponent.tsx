'use client';

import React, { useState } from 'react';

interface Proposal {
  id: number;
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  submittedTime: string;
  status: "Pending" | "Approved" | "Rejected";
}

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
    title: "Mobile App Launch",
    department: "IT",
    submitter: "Maria Lee",
    submittedDate: "May 16, 2023",
    submittedTime: "10:00 AM",
    status: "Rejected",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    department: "Marketing",
    submitter: "David Kim",
    submittedDate: "May 17, 2023",
    submittedTime: "2:00 PM",
    status: "Pending",
  },
  {
    id: 4,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "10:30 AM",
    status: "Approved",
  },
  {
    id: 5,
    title: "Website Redesign Project",
    department: "Marketing",
    submitter: "Alex Johnson",
    submittedDate: "May 15, 2023",
    submittedTime: "9:30 AM",
    status: "Pending",
  },
];

interface ProposalCardProps {
  title: string;
  department: string;
  submitter: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  showFeedbackBtn: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  title,
  department,
  submitter,
  submittedDate,
  status,
  showFeedbackBtn,
}) => {
  return (
    <div className="border rounded-lg p-4 pt-6 bg-white shadow-md relative w-full">
      <h3 className="font-semibold text-black pr-20">{title}</h3>
      <p className="text-sm text-black">Department: {department}</p>
      <p className="text-sm text-black">Submitted by: {submitter}</p>
      <p className="text-sm text-black">Submitted on: {submittedDate}</p>
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

const ProposalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState("All Priorities");
  const [date, setDate] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const renderSection = (title: string, filteredProposals: Proposal[]) => (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2 text-black">{title}</h2>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
        : "flex flex-col gap-4"}>
        {filteredProposals.map(proposal => (
          <ProposalCard 
            key={proposal.id} 
            {...proposal} 
            showFeedbackBtn={proposal.status === "Approved"} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6 overflow-y-auto font-sans">
      <h1 className="text-2xl font-bold mb-2 text-black">Proposals</h1>
      <p className="text-gray-600 mb-6">Submitted proposal & New proposal</p>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
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
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
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
        <button
          className="ml-auto bg-white border border-gray-400 text-black px-4 py-2 rounded-md"
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        >
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </button>
      </div>

      {renderSection("Pending Proposals", proposals.filter(p => p.status === "Pending"))}
      {renderSection("Approved Proposals", proposals.filter(p => p.status === "Approved"))}
      {renderSection("Rejected Proposals", proposals.filter(p => p.status === "Rejected"))}
    </div>
  );
};

export default ProposalsPage;
