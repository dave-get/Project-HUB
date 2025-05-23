import React from "react";
import { Github, ArrowRight } from "lucide-react";

interface CodeTabProps {
  repoUrl: string;
}

const CodeTab: React.FC<CodeTabProps> = ({ repoUrl }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Source Code
      </h2>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent transition"
      >
        <div className="flex items-center gap-3">
          <Github className="w-5 h-5 text-foreground" />
          <span className="text-sm font-medium text-foreground">
            Github Repository
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary">
          <span>View Code</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </a>
    </section>
  );
};

export default CodeTab;
