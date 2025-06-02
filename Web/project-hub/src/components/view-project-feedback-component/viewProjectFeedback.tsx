import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, MessageSquare, Download, File } from "lucide-react";
import { useGetProjectFeedbackQuery } from "@/features/projectFeedbackApi/ProjectFeedbackApi";
import { ProjectFeedback, ProjectFeedbackList } from "@/type/project-feedback";
import { useGetProjectByIdQuery } from "@/features/getProjectsApi/getProjectsApi";
import { Project } from "@/type/project";

export default function ViewProjectFeedback({
  projectId,
}: {
  projectId: string;
}) {
  const { data: feedback } = useGetProjectFeedbackQuery(projectId);
  const { data: project } = useGetProjectByIdQuery(projectId);
  const projectData = project as Project | undefined;
  const feedbacks = feedback as ProjectFeedbackList | undefined;
  const feedbackData = feedbacks?.feedback[feedbacks?.feedback.length - 1];

  const handleDownload = async () => {
    if (!feedbackData?.attachments?.[0]?.url) return;

    try {
      const response = await fetch(feedbackData?.attachments[0].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = feedbackData?.attachments[0].fileName || "proposal-document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const renderStars = (rating?: number) => {
    const safeRating = rating || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < safeRating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase() || "") {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Project Feedback</h1>
          <p className="text-gray-600">
            Review and manage project feedback submissions
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold mb-2">
                  {projectData?.title}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(feedbackData?.status)}>
                    {feedbackData?.status || ""}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Submitted on {formatDate(feedbackData?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Rating:
                </span>
                <div className="flex items-center gap-1">
                  {renderStars(feedbackData?.rating)}
                </div>
                <span className="text-sm text-gray-600 ml-1">
                  ({feedbackData?.rating}/5)
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-400 mb-2">
                    Feedback Details
                  </h3>
                  <div className="rounded-lg p-4 border">
                    <p className="text-gray-400 leading-relaxed">
                      {feedbackData?.feedbackText}
                    </p>
                  </div>
                </div>
              </div>

              {feedbackData?.attachments &&
                feedbackData.attachments.length > 0 && (
                  <div className="flex items-start gap-3">
                    <File className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-400 mb-2">
                        Attachments
                      </h3>
                      <div className="rounded-lg p-4 border">
                        <div className="space-y-2">
                          {feedbackData.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <File className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {attachment.fileName}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {(attachment.size / (1024 * 1024)).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </div>
                              <button
                                onClick={() => handleDownload()}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
