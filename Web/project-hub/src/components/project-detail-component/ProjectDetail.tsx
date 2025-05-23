"use client";

import type React from "react";
import { useState } from "react";
import { Calendar, Eye, Share2, Bookmark } from "lucide-react";
import CommentSection from "./discussion/Discussion";
import TableContent from "./discussion/TableContent";
import DescriptionTab from "./project-detail-tabs/DescriptionTab";
import ToolsTab from "./project-detail-tabs/ToolsTab";
import AppsTab from "./project-detail-tabs/AppsTab";
import CodeTab from "./project-detail-tabs/CodeTab";
import DocumentationTab from "./project-detail-tabs/DocumentationTab";

interface ProjectDetailProps {
  id: string;
  data?: {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    views: number;
    imageUrl: string;
    description: string;
    tools: (
      | string
      | {
          name: string;
          description: string;
          image: string | null;
        }
    )[];
    apps: (
      | string
      | {
          name: string;
          description: string;
          image: string | null;
        }
    )[];
    code: string;
    documentation: string | { name: string; value: string }[];
    discussion?: string;
  };
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ id, data }) => {
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
        return <DescriptionTab description={data.description} />;
      case "tools":
        return <ToolsTab tools={data.tools} />;
      case "apps":
        return <AppsTab apps={data.apps} />;
      case "code":
        return <CodeTab repoUrl={data.code} />;
      case "documentation":
        return <DocumentationTab documentation={data.documentation} />;
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
    <div className="px-16 py-6 bg-background">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 bg-background p-6 rounded-lg">
          {/* Title Section */}
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {data.title}
          </h1>
          <p className="text-muted-foreground text-sm mb-4">{data.subtitle}</p>

          {/* Meta Info */}
          <div className="flex items-center space-x-8 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {data.date}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" aria-hidden="true" />
              {data.views} views
            </span>
          </div>

          {/* Share and Save Buttons */}
          <div className="flex space-x-4 mb-6">
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
          <div className="w-full h-96 bg-card rounded-xl overflow-hidden mb-6 border border-border">
            <img
              src={
                !imageError
                  ? data.imageUrl || "/placeholder.svg"
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
              className="flex justify-between text-sm font-medium"
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
                  className={`py-2 px-4  rounded-t-md transition-colors ${
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
            className="mb-12 p-6 border border-border rounded-lg bg-card/50"
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={activeTab}
          >
            <div className="prose dark:prose-invert max-w-none">
              {renderTabContent()}
            </div>
          </div>

          {/* Discussion Section */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <CommentSection />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <TableContent
            projectId={id}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
