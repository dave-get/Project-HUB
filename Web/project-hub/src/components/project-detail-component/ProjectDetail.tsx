"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Calendar, Eye, Share2, Bookmark } from "lucide-react";
import CommentSection from "./discussion/Discussion";
import TableContent from "./discussion/TableContent";
import DescriptionTab from "./project-detail-tabs/DescriptionTab";
import ToolsTab from "./project-detail-tabs/ToolsTab";
import AppsTab from "./project-detail-tabs/AppsTab";
import CodeTab from "./project-detail-tabs/CodeTab";
import DocumentationTab from "./project-detail-tabs/DocumentationTab";
import {
  useGetProjectByIdQuery,
  useIncrementViewMutation,
} from "@/features/getProjectsApi/getProjectsApi";
import { Project } from "@/type/project";

const ProjectDetail = ({ id }: { id: string }) => {
  const [expanded, setExpanded] = useState(false);
  const { data } = useGetProjectByIdQuery(id);
  const projectData = data?.project as Project;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const [incrementView] = useIncrementViewMutation();

  useEffect(() => {
    if (id) {
      incrementView(id);
    }
  }, [id, incrementView]);

  console.log("projectData", projectData);
  const tabs = [
    { id: "description", label: "Description" },
    { id: "tools", label: "Tools" },
    { id: "apps", label: "Apps" },
    { id: "code", label: "Code" },
    { id: "documentation", label: "Documentation" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [imageError, setImageError] = useState(false);

  const renderTabContent = () => {
    if (!data) return null;

    switch (activeTab) {
      case "description":
        return (
          <DescriptionTab description={projectData?.projectDescription || ""} />
        );
      case "tools":
        return <ToolsTab tools={projectData?.toolsAndMachines.tools || []} />;
      case "apps":
        return <AppsTab apps={projectData?.appsAndPlatforms || []} />;
      case "code":
        return (
          <CodeTab
            repoUrl={projectData?.codeAndDocumentation?.repositoryLink || ""}
          />
        );
      case "documentation":
        return (
          <DocumentationTab
            documentation={
              projectData?.codeAndDocumentation?.documentation
                ? [projectData.codeAndDocumentation.documentation]
                : []
            }
          />
        );
      default:
        return <p>Select a tab.</p>;
    }
  };

  // Show loading state if data is not available
  if (!data) {
    return (
      <div className="container py-6 bg-background">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
          <div className="h-96 bg-muted rounded-xl mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6 bg-background">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 bg-background p-4 sm:p-6 rounded-lg">
          {/* Title Section */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {projectData?.title}
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            {projectData?.elevatorPitch}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-6 sm:mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {projectData?.createdAt
                ? formatDate(projectData.createdAt)
                : "Date not available"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" aria-hidden="true" />
              {projectData?.views} views
            </span>
          </div>

          {/* Share and Save Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              className="flex items-center gap-2 px-4 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              aria-label="Share project"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              Share
            </button>
            <button
              className="flex items-center gap-2 px-4 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
              aria-label="Save project"
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              Save
            </button>
          </div>

          {/* Image */}
          <div className="w-full h-48 sm:h-72 md:h-96 bg-card rounded-xl overflow-hidden mb-6 border border-border">
            <img
              src={
                !imageError
                  ? projectData?.coverImage || "/placeholder.svg"
                  : "/placeholder.svg"
              }
              alt="Project preview"
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div
              className="flex flex-wrap sm:flex-nowrap justify-between text-sm font-medium"
              role="tablist"
              aria-label="Project information tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 sm:px-4 text-sm rounded-t-md transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-foreground font-medium bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div
            className="mb-8 sm:mb-12 p-4 sm:p-6 border border-border rounded-lg bg-card/50 max-w-full sm:max-w-[985px]"
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={activeTab}
          >
            <div
              className={`prose dark:prose-invert break-words transition-all duration-300 ${
                expanded ? "max-h-[1000px]" : "max-h-56 overflow-hidden"
              }`}
            >
              {renderTabContent()}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          </div>

          {/* Discussion Section */}
          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border max-h-64">
            <CommentSection
              projectId={id}
              comments={projectData?.comments || []}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 mt-4 lg:mt-0">
          <TableContent
            projectId={id}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            likesCount={projectData?.likes?.length || 0}
            commentsCount={projectData?.comments?.length || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
