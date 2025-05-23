"use client";
import { Search, Calendar, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProposalCard } from "./ProposalCard";
import { useState, useEffect } from "react";
import { useGetProposalsQuery } from "@/features/proposalsApi/proposalsApi";
import Link from "next/link";
import { SubmissionResponse } from "@/type/proposal";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import { UserType } from "@/type/profile";
import DocumentationCard from "./teacher-proposalCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProposalsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const { data: proposals, isLoading: isProposalsLoading } = useGetProposalsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const profileData = userData as UserType;
  const Allproposals = proposals as SubmissionResponse;
  const isStudent = profileData?.data?.role === "student";
  const isTeacher = profileData?.data?.role === "teacher";

  if (isUserLoading || isProposalsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }
  if (!profileData?.data?.role) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-center text-muted-foreground">Please log in to view proposals</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
        <p className="text-muted-foreground">
          Submitted proposals & New proposal
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input placeholder="Search proposals..." className="w-full pl-10" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Input type="date" className="w-[180px] pl-10" />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Link href="/proposal/submit">
            <Button variant="outline">New Proposal</Button>
          </Link>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "grid gap-4"
        }
      >
        {Allproposals?.data?.map((proposal) => {
          if (isStudent) {
            return (
              <ProposalCard
                key={proposal._id}
                proposals={proposal}
                layout={viewMode}
              />
            );
          }
          if (isTeacher) {
            return <DocumentationCard key={proposal._id} proposals={proposal} layout={viewMode}/>;
          }
          return null;
        })}
      </div>
    </div>
  );
}

