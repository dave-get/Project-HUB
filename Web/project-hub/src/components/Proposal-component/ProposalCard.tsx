import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Submission } from "@/type/proposal";
import Link from "next/link";

export function ProposalCard({
  proposals,
  layout,
}: {
  proposals: Submission;
  layout: "grid" | "list";
}) {
  const status = proposals?.feedbackList[0]?.status.toLowerCase() || "pending";
  console.log("Proposal status:", status);
  const date = new Date(proposals?.createdAt).toLocaleDateString();
  const time = new Date(proposals?.createdAt).toLocaleTimeString();
  if (layout === "grid") {
    return (
      <Card className="h-[280px] flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium line-clamp-2">
            {proposals?.title}
          </CardTitle>
          {status === "pending" && (
            <Badge className="bg-amber-500">Pending</Badge>
          )}
          {status === "approved" && (
            <Badge className="bg-green-500">Approved</Badge>
          )}
          {status === "rejected" && (
            <Badge className="bg-red-500">Rejected</Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-semibold">Department:</span>{" "}
              {proposals.student.department}
            </div>
            <div className="text-sm text-muted-foreground">
              {proposals?.student?.fullName}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2 border-t mt-auto">
          <div className="text-sm text-muted-foreground">
            {date} {time}
          </div>
          {(status === "approved" || status === "rejected") && (
            <Link href={`/proposal/viewfeedback/${proposals._id}`}>
              <Button variant="link" className="p-0 h-auto">
                View Feedback
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {proposals?.title}
        </CardTitle>
        {status === "pending" && (
          <Badge className="bg-amber-500">Pending</Badge>
        )}
        {status === "approved" && (
          <Badge className="bg-green-500">Approved</Badge>
        )}
        {status === "rejected" && (
          <Badge className="bg-red-500">Rejected</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-semibold">Department:</span>{" "}
            {proposals?.student.department}
          </div>
          <div className="text-sm text-muted-foreground">
            {proposals?.student.fullName}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Submitted:</span> {date} {time}
        </div>
        {(status === "approved" || status === "rejected") && (
          <Link href={`/proposal/viewfeedback/${proposals._id}`}>
            <Button variant="link" className="p-0 h-auto">
              View Feedback
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
