import { Calendar, Download, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Submission } from "@/type/proposal";

const DocumentationCard = ({
  proposals,
  layout,
}: {
  proposals: Submission;
  layout: "grid" | "list";
}) => {
  const handleDownload = async () => {
    if (!proposals?.attachments?.[0]?.url) return;

    try {
      const response = await fetch(proposals.attachments[0].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = proposals.attachments[0].name || "proposal-document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const formattedDate = proposals?.createdAt
    ? new Date(proposals?.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  if (layout === "grid") {
    return (
      <Card className="h-[280px] flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium line-clamp-2">
            {proposals?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {proposals?.student?.fullName} - {proposals?.student?.department}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {formattedDate}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-2 mt-auto">
          <Link href={`/proposal/submitfeedback/${proposals?._id}`}>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-normal text-primary"
            >
              Give feedback <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{proposals?.attachments?.[0]?.name}</span>
            <span className="text-xs text-muted-foreground">
              {proposals?.attachments?.[0]?.size}
            </span>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // list layout (default)
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{proposals?.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {proposals?.student?.fullName} - {proposals?.student?.department}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {formattedDate}
            </div>

            <Link href={`/proposal/submitfeedback/${proposals?._id}`}>
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-normal text-primary"
              >
                Give feedback <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{proposals?.attachments?.[0]?.name}</span>
            <span className="text-xs text-muted-foreground">
              {proposals?.attachments?.[0]?.size}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentationCard;
