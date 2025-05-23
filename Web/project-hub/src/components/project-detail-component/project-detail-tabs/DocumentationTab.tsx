import React from "react";
import { FileText, ArrowRight } from "lucide-react";

interface DocumentationLink {
  name: string;
  value: string;
}

type DocumentationType = string | DocumentationLink[];

const DocumentationTab: React.FC<{ documentation: DocumentationType }> = ({
  documentation,
}) => {
  if (typeof documentation === "string") {
    return (
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Documentation
        </h2>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground">{documentation}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Documentation
      </h2>
      <div className="space-y-3">
        {documentation.map((doc, index) => (
          <a
            key={index}
            href={doc.value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {doc.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <span>Download Doc</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default DocumentationTab;
