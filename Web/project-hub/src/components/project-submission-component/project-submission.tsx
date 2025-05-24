'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

// Import our organized components and types
import { BasicInfo } from "./sections/BasicInfo";
import { TeamSection } from "./sections/TeamSection";
import { ToolsSection } from "./sections/ToolsSection";
import { AppsSection } from "./sections/AppsSection";
import { ProjectDescription } from "./sections/ProjectDescription";
import { projectSchema, ProjectFormValues } from "./schemas/project";
import { ChecklistStatus } from "./types";
import { ProgressTracker } from "./ProgressTracker";

const ProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checklistStatus, setChecklistStatus] = useState<ChecklistStatus>({
    title: false,
    description: false,
    team: false,
    tools: false,
    apps: false,
    projectDescription: false,
    code: false,
    documentation: false,
    coverImage: false
  });
  const [noToolsUsed, setNoToolsUsed] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      elevatorPitch: "",
      tags: [],
      teamMembers: [],
      workAttribution: "",
      componentsAndSupplies: "",
      toolsAndMachines: "",
      appsAndPlatforms: [],
      projectDescription: "",
      codeLink: "",
    },
  });

  const calculateProgress = () => {
    const values = form.getValues();
    let completedFields = 0;
    
    // Define fields in the same order as the checklist
    const allFields = [
      { value: !!values.title, name: 'title' },
      { value: !!values.elevatorPitch, name: 'description' },
      { value: !!values.coverImage, name: 'coverImage' },
      { value: values.teamMembers.length > 0, name: 'team' },
      { value: values.appsAndPlatforms.length > 0, name: 'apps' },
      { value: !!values.projectDescription, name: 'projectDescription' },
      { value: !!values.codeLink, name: 'code' },
      { value: !!values.documentation, name: 'documentation' }
    ];

    // Add tools field only if tools are used
    if (!noToolsUsed) {
      allFields.splice(4, 0, { value: !!values.toolsAndMachines, name: 'tools' });
    }

    // Count completed fields
    allFields.forEach(field => {
      if (field.value) completedFields++;
    });

    // Calculate percentage based on total number of fields
    const totalFields = noToolsUsed ? 8 : 9;
    return Math.floor((completedFields / totalFields) * 100);
  };

  const updateChecklistStatus = () => {
    const values = form.getValues();
    const newStatus: ChecklistStatus = {
      title: !!values.title,
      description: !!values.elevatorPitch,
      coverImage: !!values.coverImage,
      team: values.teamMembers.length > 0,
      apps: values.appsAndPlatforms.length > 0,
      projectDescription: !!values.projectDescription,
      code: !!values.codeLink,
      documentation: !!values.documentation
    };

    // Only add tools status if tools are used
    if (!noToolsUsed) {
      newStatus.tools = !!values.toolsAndMachines;
    }

    setChecklistStatus(newStatus);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
      updateChecklistStatus();
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    setProgress(calculateProgress());
    updateChecklistStatus();
  }, [noToolsUsed]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      
      // TODO: Implement API call to submit project
      console.log('Project data:', data);
      
      toast.success("Project submitted successfully!", {
        description: "Your project has been sent for review.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit project", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground">Project Submission</h1>
          <p className="text-muted-foreground mt-2">Create and submit your awesome project</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfo form={form} />
                <TeamSection form={form} />
                <ToolsSection 
                  form={form} 
                  noToolsUsed={noToolsUsed} 
                  setNoToolsUsed={setNoToolsUsed} 
                />
                <AppsSection form={form} />
                <ProjectDescription form={form} />

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Right sidebar */}
          <div className="w-full md:w-80 shrink-0 space-y-6">
            <ProgressTracker 
              checklistStatus={checklistStatus} 
              noToolsUsed={noToolsUsed} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
