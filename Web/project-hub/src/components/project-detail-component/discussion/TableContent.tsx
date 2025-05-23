import React from "react";
import { ChevronRight, Heart, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";

interface TableContentProps {
  projectId: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  projectId,
  activeTab,
  onTabChange,
}) => {
  const tocItems = [
    { title: "Description", href: "#description", id: "description" },
    { title: "Tools", href: "#tools", id: "tools" },
    { title: "Apps", href: "#apps", id: "apps" },
    { title: "Code", href: "#code", id: "code" },
    { title: "Documentation", href: "#documentation", id: "documentation" },
  ];

  const relatedProjects = [
    {
      title: "ESP32 Bluetooth Scanner",
      description: "Detect and list nearby Bluetooth devices",
      views: 8245,
      href: "#",
    },
    {
      title: "Wi-Fi Deauthenticator",
      description: "Security testing tool for wireless networks",
      views: 12189,
      href: "#",
    },
  ];

  return (
    <div className="space-y-4 pl-8 border-l border-border">
      {/* Table of Contents */}
      <div className="bg-card p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Table of Contents
        </h2>
        <nav>
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 text-sm w-full text-left px-2 py-1 rounded hover:bg-accent ${
                    activeTab === item.id
                      ? "text-foreground font-medium bg-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      activeTab === item.id ? "transform rotate-90" : ""
                    }`}
                  />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Interaction Bar */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          <button className="flex flex-col items-center justify-center py-3 px-4 hover:bg-accent transition-colors">
            <Heart className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">12</span>
          </button>
          <button className="flex flex-col items-center justify-center py-3 px-4 hover:bg-accent transition-colors">
            <MessageSquare className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">3</span>
          </button>
        </div>
      </div>

      {/* Related Projects */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-card px-4 py-3">
          <h3 className="text-foreground font-medium">Related Projects</h3>
        </div>
        <div className="divide-y divide-border">
          {relatedProjects.map((project, index) => (
            <Link
              key={index}
              href={project.href}
              className="block px-4 py-3 hover:bg-accent transition-colors"
            >
              <h4 className="font-medium text-foreground">{project.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>{project.views.toLocaleString()} views</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableContent;
