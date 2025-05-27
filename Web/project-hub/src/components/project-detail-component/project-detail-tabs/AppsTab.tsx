import React from "react";
import { AppPlatform } from "@/type/project";
import Image from "next/image";

const AppsTab = ({ apps }: { apps: AppPlatform[] }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">Apps</h2>
      <div className="space-y-4">
        {apps.map((app, index) => {
          if (typeof app === "string") {
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card"
              >
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-2xl">App</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{app}</h3>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
            >
              <div className="relative w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {app.logo ? (
                  <Image
                    src={app.logo}
                    alt={app.title}
                    className="w-full h-full object-cover"
                    fill
                  />
                ) : (
                  <span className="text-muted-foreground text-2xl">App</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{app.title}</h3>
                {app.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {app.description}
                  </p>
                )}
                {app.link && (
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/90 hover:underline mt-2 inline-block"
                  >
                    View App →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AppsTab;
