//src/app/(dashboard)/proposal/page.tsx
import { ProposalCard } from "@/components/ui/proposal-card";
import { proposals } from "@/config/proposals";

export default function ProposalsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Proposals</h1>
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} {...proposal} />
        ))}
      </div>
    </div>
  );
}