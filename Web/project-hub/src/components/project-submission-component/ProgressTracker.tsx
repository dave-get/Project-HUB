import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressTrackerProps {
  checklistStatus: {
    title: boolean;
    description: boolean;
    team: boolean;
    tools?: boolean;
    apps: boolean;
    projectDescription: boolean;
    code: boolean;
    documentation: boolean;
    coverImage: boolean;
  };
  noToolsUsed: boolean;
}

export const ProgressTracker = ({ checklistStatus, noToolsUsed }: ProgressTrackerProps) => {
  const baseChecklistItems = [
    { key: 'title', label: 'Project Title' },
    { key: 'description', label: 'Short Description' },
    { key: 'coverImage', label: 'Cover Image' },
    { key: 'team', label: 'The Team' },
    { key: 'apps', label: 'Apps and Platforms' },
    { key: 'projectDescription', label: 'Project Description' },
    { key: 'code', label: 'Code' },
    { key: 'documentation', label: 'Documentation' }
  ];

  const toolsItem = { key: 'tools', label: 'Tools and Machines' };

  const checklistOrder = noToolsUsed 
    ? baseChecklistItems 
    : [
        ...baseChecklistItems.slice(0, 4),
        toolsItem,
        ...baseChecklistItems.slice(4)
      ];

  // Dynamic progress calculation
  const totalItems = checklistOrder.length;
  const completedItems = checklistOrder.filter(
    item => checklistStatus[item.key as keyof typeof checklistStatus]
  ).length;

  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <Card className="border-border sticky top-6">
      <CardContent className="p-4">
        <h3 className="font-bold text-foreground mb-1">Project Checklist</h3>
        <p className="text-xs text-muted-foreground mb-3">Complete these sections to publish your project</p>

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-muted-foreground">Completion</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-muted"
            indicatorClassName="bg-primary"
          />
        </div>

        <div className="space-y-1.5 mt-4">
          {checklistOrder.map(item => (
            <div key={item.key} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
              {checklistStatus[item.key as keyof typeof checklistStatus] ? (
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
              )}
              <span className={`text-xs ${
                checklistStatus[item.key as keyof typeof checklistStatus] 
                  ? 'font-medium text-foreground' 
                  : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
