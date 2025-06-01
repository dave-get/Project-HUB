import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectHeaderProps {
  title: string;
  submissionDate: string;
  status: string;
}

export function ProjectHeader({
  title,
  submissionDate,
  status,
}: ProjectHeaderProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "feedback-badge-approved";
      case "Pending":
        return "feedback-badge-pending";
      case "Rejected":
        return "feedback-badge-rejected";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-800";
    }
  };

  return (
    <Card className="mb-6 feedback-card transition-colors duration-200">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold feedback-text mb-3">{title}</h1>
        <div className="flex items-center gap-4 text-sm feedback-text-muted">
          <span>
            {new Date(submissionDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <Badge className={getStatusClass(status)}>{status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
