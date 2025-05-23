'use client';

import { Upload, Plus, Save, Trash2, User, PenToolIcon as Tool, Laptop, CheckCircle2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

type TeamMember = {
  name: string;
  role: string;
};

type AppPlatform = {
  title: string;
  description: string;
  logo: File;
};

type NewAppForm = {
  title: string;
  description: string;
  logo: File | null;
};

const projectSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  coverImage: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG and WEBP images are allowed"
    ),
  elevatorPitch: z.string()
    .min(50, "Elevator pitch must be at least 50 characters")
    .max(500, "Elevator pitch must be less than 500 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  teamMembers: z.array(z.object({
    name: z.string(),
    role: z.string().min(1, "Role is required")
  })).min(1, "At least one team member is required"),
  workAttribution: z.string().min(10, "Work attribution must be at least 10 characters"),
  componentsAndSupplies: z.string().min(10, "Components and supplies must be at least 10 characters"),
  toolsAndMachines: z.string().optional(),
  appsAndPlatforms: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    logo: z.instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only JPEG, PNG and WEBP images are allowed"
      )
  })).min(1, "At least one app or platform is required"),
  projectDescription: z.string()
    .min(100, "Project description must be at least 100 characters")
    .max(5000, "Project description must be less than 5000 characters"),
  codeLink: z.string().url("Please enter a valid URL").optional(),
  documentation: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 10MB")
    .refine(
      (file) => ACCEPTED_DOC_TYPES.includes(file.type),
      "Only PDF and DOC files are allowed"
    ),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const students = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Mike Johnson" },
  { id: 4, name: "Sarah Williams" },
  { id: 5, name: "David Brown" },
];

const ProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checklistStatus, setChecklistStatus] = useState({
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
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [apps, setApps] = useState<Array<{
    title: string;
    description: string;
    logo: File;
  }>>([]);
  const [newApp, setNewApp] = useState({
    title: "",
    description: "",
    logo: null as File | null
  });

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
    const totalFields = 9;
    let completedFields = 0;
    
    const values = form.getValues();
    if (values.title) completedFields++;
    if (values.elevatorPitch) completedFields++;
    if (values.teamMembers.length > 0) completedFields++;
    if (values.toolsAndMachines) completedFields++;
    if (values.appsAndPlatforms.length > 0) completedFields++;
    if (values.projectDescription) completedFields++;
    if (values.codeLink) completedFields++;
    if (values.documentation) completedFields++;
    if (values.coverImage) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const updateChecklistStatus = () => {
    const values = form.getValues();
    setChecklistStatus({
      title: !!values.title,
      description: !!values.elevatorPitch,
      team: values.teamMembers.length > 0,
      tools: !!values.toolsAndMachines,
      apps: values.appsAndPlatforms.length > 0,
      projectDescription: !!values.projectDescription,
      code: !!values.codeLink,
      documentation: !!values.documentation,
      coverImage: !!values.coverImage
    });
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
      updateChecklistStatus();
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

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

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues("tags").includes(tagInput.trim())) {
      form.setValue("tags", [...form.getValues("tags"), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((tag) => tag !== tagToRemove)
    );
  };

  const handleStudentSelect = (student: { id: number; name: string }) => {
    setSelectedStudent(student);
    setOpen(false);
    setIsRoleModalOpen(true);
  };

  const handleRoleConfirm = () => {
    if (selectedStudent && roleInput.trim()) {
      const newMember = {
        name: selectedStudent.name,
        role: roleInput.trim()
      };
      
      const currentMembers = form.getValues("teamMembers");
      if (!currentMembers.some(member => member.name === newMember.name)) {
        form.setValue("teamMembers", [...currentMembers, newMember]);
      }
      
      setRoleInput("");
      setSelectedStudent(null);
      setIsRoleModalOpen(false);
    }
  };

  const handleRemoveMember = (memberToRemove: TeamMember) => {
    const currentMembers = form.getValues("teamMembers");
    form.setValue(
      "teamMembers",
      currentMembers.filter((member) => member.name !== memberToRemove.name)
    );
  };

  const handleAddApp = () => {
    if (newApp.title && newApp.description && newApp.logo) {
      const appToAdd = {
        title: newApp.title,
        description: newApp.description,
        logo: newApp.logo
      };
      const updatedApps = [...apps, appToAdd];
      setApps(updatedApps);
      form.setValue("appsAndPlatforms", updatedApps);
      setNewApp({ title: "", description: "", logo: null });
    }
  };

  const handleRemoveApp = (index: number) => {
    const updatedApps = apps.filter((_, i) => i !== index);
    setApps(updatedApps);
    form.setValue("appsAndPlatforms", updatedApps);
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
                {/* Project Title and Description Card */}
                <Card className="border-border">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-foreground mb-2">Project Title</h2>
                    <p className="text-muted-foreground text-sm mb-6">Make it catchy! A good title helps your project stand out.</p>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your project title"
                              className="w-full border-input bg-background text-foreground focus:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elevatorPitch"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-foreground">Short Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project in one short sentence"
                              className="w-full border-input bg-background text-foreground focus:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem className="mt-8">
                          <FormLabel className="text-foreground">Cover Image</FormLabel>
                          <FormControl>
                            <label
                              htmlFor="cover-image-upload"
                              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="cover-image-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    form.setValue("coverImage", file, { shouldValidate: true });
                                  }
                                }}
                                {...field}
                              />
                              <span className="text-sm font-medium text-foreground">
                                Click to upload or drag and drop
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                              {value && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Selected file: {(value as File).name}
                                </p>
                              )}
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Team Members Card */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">The Team</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground mb-6">Add team members who contributed to this project</p>

                    <div className="space-y-4 mb-6">
                      {form.getValues("teamMembers").map((member) => (
                        <div key={member.name} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                          <Avatar className="h-10 w-10 bg-primary">
                            <AvatarFallback className="text-primary-foreground">{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveMember(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Search team member..."
                          className="w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setOpen(true)}
                        />
                        {open && (
                          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                            <div className="max-h-60 overflow-auto">
                              {students
                                .filter(student => 
                                  student.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((student) => (
                                  <div
                                    key={student.id}
                                    className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                                    onClick={() => {
                                      handleStudentSelect(student);
                                      setSearchQuery("");
                                    }}
                                  >
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{student.name}</span>
                                  </div>
                                ))}
                              {students.filter(student => 
                                student.name.toLowerCase().includes(searchQuery.toLowerCase())
                              ).length === 0 && (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                  No students found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tools and Machines Card */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">Tools and Machines</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-muted-foreground">Add tools and machines used in your project</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          id="noToolsUsed"
                          className="h-4 w-4 rounded text-primary focus:ring-primary border-input bg-background"
                        />
                        <label htmlFor="noToolsUsed">No tools used</label>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="toolsAndMachines"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="List any tools and machines used in your project"
                              className="w-full border-input bg-background text-foreground focus:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Apps and Platforms Card */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Laptop className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">Apps and Platforms</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground mb-6">Add software, apps, or platforms used in your project</p>

                    <div className="space-y-6">
                      {apps.map((app, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {app.logo && (
                                <div className="h-10 w-10 rounded-lg overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(app.logo)}
                                    alt={app.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-foreground">{app.title}</h4>
                                <p className="text-sm text-muted-foreground">{app.description}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveApp(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="grid gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                              App/Platform Title
                            </label>
                            <Input
                              placeholder="Enter app or platform name"
                              value={newApp.title}
                              onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                              Description
                            </label>
                            <Textarea
                              placeholder="Describe how this app/platform was used in your project"
                              value={newApp.description}
                              onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                              Logo
                            </label>
                            <label
                              htmlFor="app-logo-upload"
                              className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="app-logo-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setNewApp({ ...newApp, logo: file });
                                  }
                                }}
                              />
                              <span className="text-sm font-medium text-foreground">
                                Click to upload or drag and drop
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                              {newApp.logo && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Selected file: {newApp.logo.name}
                                </p>
                              )}
                            </label>
                          </div>
                        </div>
                        <Button
                          onClick={handleAddApp}
                          disabled={!newApp.title || !newApp.description || !newApp.logo}
                          className="w-full"
                        >
                          Add App/Platform
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Description Card */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">Project Description</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of your project"
                              className="w-full border-input bg-background text-foreground focus:ring-ring min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Code and Documentation Card */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/50 border-b border-border px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">Code and Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="codeLink"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="text-foreground">Code Repository Link (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter GitHub or other repository link"
                              className="w-full border-input bg-background text-foreground focus:ring-ring"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="documentation"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Project Documentation</FormLabel>
                          <FormControl>
                            <label
                              htmlFor="documentation-upload"
                              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                id="documentation-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    form.setValue("documentation", file, { shouldValidate: true });
                                  }
                                }}
                                {...field}
                              />
                              <span className="text-sm font-medium text-foreground">
                                Click to upload or drag and drop
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                              {value && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Selected file: {(value as File).name}
                                </p>
                              )}
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

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
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.title ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.title ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Project Title
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.description ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.description ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Short Description
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.coverImage ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.coverImage ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Cover Image
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.team ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.team ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      The Team
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.tools ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.tools ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Tools and Machines
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.apps ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.apps ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Apps and Platforms
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.projectDescription ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.projectDescription ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Project Description
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.code ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.code ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Code
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-muted">
                    {checklistStatus.documentation ? (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"></div>
                    )}
                    <span className={`text-xs ${checklistStatus.documentation ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      Documentation
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tool Modal */}
      <Dialog open={toolModalOpen} onOpenChange={setToolModalOpen}>
        <DialogContent className="sm:max-w-md p-0 border-0 shadow-xl">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <DialogHeader className="border-b px-6 py-4 bg-gray-50">
            <DialogTitle className="text-lg font-bold text-gray-800">Add New Tool</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name</label>
              <Input
                placeholder="Enter tool name"
                className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool Description</label>
              <Textarea
                placeholder="Describe how this tool was used in your project"
                className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all h-24"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md">
                Add Tool
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setToolModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Selection Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role for {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter team member's role"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleModalOpen(false);
                setSelectedStudent(null);
                setRoleInput("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleConfirm}
              disabled={!roleInput.trim()}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSubmission;
