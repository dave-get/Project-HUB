"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSubmitProjectMutation } from "@/features/projectSubmitApi/projectSubmitApi";
import { useRouter } from "next/navigation";

// Import our organized components and types
import { BasicInfo } from "./sections/BasicInfo";
import { TeamSection } from "./sections/TeamSection";
import { ToolsSection } from "./sections/ToolsSection";
import { AppsSection } from "./sections/AppsSection";
import { ProjectDescription } from "./sections/ProjectDescription";
import { projectSchema, ProjectFormValues } from "./schemas/project";
import { ProgressTracker } from "./ProgressTracker";

export interface ChecklistStatus {
  title: boolean;
  description: boolean;
  team: boolean;
  tools?: boolean;
  apps: boolean;
  projectDescription: boolean;
  code: boolean;
  documentation: boolean;
  coverImage: boolean;
  tags: boolean;
} 
const ProjectSubmission = () => {
  const router = useRouter();
  const [submitProject] = useSubmitProjectMutation();
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
    coverImage: false,
    tags: false
  });
  const [noToolsUsed, setNoToolsUsed] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      tags: [],
      coverImage: undefined,
      elevatorPitch: "",
      projectDescription: "",
      teamMembers: [],
      toolsAndMachines: {
        noToolsUsed: false,
        tools: [],
      },
      appsAndPlatforms: [],
      codeAndDocumentation: {
        repositoryLink: "",
        documentation: {
          fileName: "",
          fileSize: "",
          file: undefined,
        },
      },
      status: false,
      reviewedByTeacherId: "",
    },
    mode: "onChange",
  });

  // Add validation state logging
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form field changed:", { name, type, value });
      const result = projectSchema.safeParse(value);
      if (!result.success) {
        console.log("Validation errors:", result.error.format());
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const calculateProgress = () => {
    const values = form.getValues();
    let completedFields = 0;

    // Define fields in the same order as the checklist
    const checklistItems = [
      { value: !!values.title, name: 'title' },
      { value: !!values.elevatorPitch, name: 'shortDescription' },
      { value: values.tags?.length > 0, name: 'tags' },
      { value: !!values.coverImage, name: 'coverImage' },
      { value: values.teamMembers.length > 0, name: 'team' },
      ...(values.toolsAndMachines.noToolsUsed ? [] : [{ value: (values.toolsAndMachines.tools || []).length > 0, name: 'tools' }]),
      { value: values.appsAndPlatforms.length > 0, name: 'apps' },
      { value: !!values.projectDescription, name: 'projectDescription' },
      { 
        value: !!values.codeAndDocumentation.repositoryLink, 
        name: 'code' 
      },
      { 
        value: !!values.codeAndDocumentation.documentation.file, 
        name: 'documentation' 
      }
    ];

    // Count completed fields
    checklistItems.forEach(field => {
      if (field.value) completedFields++;
    });

    // Calculate percentage based on total number of fields
    const totalFields = checklistItems.length;
    return Math.floor((completedFields / totalFields) * 100);
  };

  const updateChecklistStatus = () => {
    const values = form.getValues();
    const newStatus: ChecklistStatus = {
      title: !!values.title,
      description: !!values.elevatorPitch,
      coverImage: !!values.coverImage,
      tags: values.tags?.length > 0,
      team: values.teamMembers.length > 0,
      apps: values.appsAndPlatforms.length > 0,
      projectDescription: !!values.projectDescription,
      code: !!values.codeAndDocumentation.repositoryLink,
      documentation: !!values.codeAndDocumentation.documentation.file
    };

    // Only add tools status if tools are used
    if (!values.toolsAndMachines.noToolsUsed) {
      newStatus.tools = (values.toolsAndMachines.tools || []).length > 0;
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

      const formData = new FormData();

      // Append basic fields
      formData.append("title", data.title);
      formData.append("elevatorPitch", data.elevatorPitch);
      formData.append("projectDescription", data.projectDescription);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("status", data.status.toString());

      // Append files
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      // Append team members
      formData.append("teamMembers", JSON.stringify(data.teamMembers));

      // Append tools
      formData.append("toolsAndMachines", JSON.stringify({
        tools: data.toolsAndMachines.tools?.map(tool => ({
          name: tool.name,
          description: tool.description
        }))
      }));
      
      formData.append(
        "noToolsUsed",
        JSON.stringify(data.toolsAndMachines.noToolsUsed)
      );

      // Append tool images separately
      data.toolsAndMachines.tools?.forEach((tool, index) => {
        if (tool.image) {
          formData.append("toolImages", tool.image);
        }
      });

      // Append apps
      formData.append(
        "appsAndPlatforms",
        JSON.stringify(
          data.appsAndPlatforms.map((app) => ({
            title: app.title,
            description: app.description,
          }))
        )
      );

      // Append app logos separately
      data.appsAndPlatforms.forEach((app) => {
        if (app.logo) {
          formData.append("appLogos", app.logo);
        }
      });
      
      // Append code and documentation
      formData.append("codeAndDocumentation", JSON.stringify({
        repositoryLink: data.codeAndDocumentation.repositoryLink,
        documentation: {
          fileName: data.codeAndDocumentation.documentation.fileName,
          fileSize: data.codeAndDocumentation.documentation.fileSize
        }
      }));
      
      // Append documentation file separately
      if (data.codeAndDocumentation.documentation.file) {
        formData.append(
          "documentationFiles",
          data.codeAndDocumentation.documentation.file
        );
      }

      if (data.reviewedByTeacherId) {
        formData.append("reviewedByTeacherId", data.reviewedByTeacherId);
      }

      // Debug log the FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await submitProject(formData).unwrap();

      toast.success("Project submitted successfully!", {
        description: "Your project has been sent for review.",
      });

      // Reset form and redirect to project/submit page
      form.reset();
      router.push("/project");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit project", {
        description: error.data?.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground">
            Project Submission
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and submit your awesome project
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
