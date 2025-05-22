import React from "react";
import { Wrench } from "lucide-react";

type Tool =
  | string
  | {
      name: string;
      description: string;
      image: string | null;
    };

interface ToolsTabProps {
  tools: Tool[];
}

const ToolsTab: React.FC<ToolsTabProps> = ({ tools }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Tools and Machines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => {
          if (typeof tool === "string") {
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card"
              >
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{tool}</h3>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Wrench className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{tool.name}</h3>
                {tool.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ToolsTab;
