'use client';

import { Upload, Plus, Save, Trash2, User, PenToolIcon as Tool, Laptop, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

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
  teamMembers: z.array(z.string()).min(1, "At least one team member is required"),
  workAttribution: z.string().min(10, "Work attribution must be at least 10 characters"),
  componentsAndSupplies: z.string().min(10, "Components and supplies must be at least 10 characters"),
  toolsAndMachines: z.string().optional(),
  appsAndPlatforms: z.string().min(10, "Apps and platforms must be at least 10 characters"),
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

const ProjectSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [progress, setProgress] = useState(40);

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
      appsAndPlatforms: "",
      projectDescription: "",
      codeLink: "",
    },
  });

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

  const handleAddMember = () => {
    if (memberInput.trim() && !form.getValues("teamMembers").includes(memberInput.trim())) {
      form.setValue("teamMembers", [...form.getValues("teamMembers"), memberInput.trim()]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    form.setValue(
      "teamMembers",
      form.getValues("teamMembers").filter((member) => member !== memberToRemove)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Project Submission</h1>
            <p className="text-gray-500 mt-1">Create and submit your awesome project</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
            Save Draft
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Project Title and Description Card */}
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Project Title</h2>
                    <p className="text-gray-500 text-sm mb-6">Make it catchy! A good title helps your project stand out.</p>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your project title"
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project in one short sentence"
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                          <FormControl>
                            <div className="flex justify-center">
                              <div className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center">
                                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                    <Upload className="h-6 w-6 text-indigo-600" />
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="cover-image-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) onChange(file);
                                    }}
                                    {...field}
                                  />
                                  <label
                                    htmlFor="cover-image-upload"
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    Upload Cover Image
                                  </label>
                                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                  {value && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      Selected file: {(value as File).name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Team Members Card */}
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">The Team</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-gray-600">Add team members who contributed to this project</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          id="notAuthorCheckbox"
                          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="notAuthorCheckbox" className="cursor-pointer">
                          I'm not the author
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {form.getValues("teamMembers").map((member) => (
                        <div key={member} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Avatar className="h-10 w-10 bg-indigo-600">
                            <AvatarFallback>{member[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member}</p>
                            <p className="text-xs text-gray-500">Team Member</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveMember(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a team member"
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddMember();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddMember}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tools and Machines Card */}
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">Tools and Machines</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-gray-600">Add tools and machines used in your project</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          id="noToolsUsed"
                          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
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
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Laptop className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">Apps and Platforms</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-sm text-gray-600 mb-6">Add software, apps, or platforms used in your project</p>

                    <FormField
                      control={form.control}
                      name="appsAndPlatforms"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="List the apps and platforms used in your project"
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Project Description Card */}
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">Project Description</CardTitle>
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
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[200px]"
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
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b px-8 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Tool className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800">Code and Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FormField
                      control={form.control}
                      name="codeLink"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Code Repository Link (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter GitHub or other repository link"
                              className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                          <FormLabel>Project Documentation</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                                <Upload className="h-6 w-6 text-indigo-600" />
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                id="documentation-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onChange(file);
                                }}
                                {...field}
                              />
                              <label
                                htmlFor="documentation-upload"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                Click to upload or drag and drop
                              </label>
                              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                              {value && (
                                <p className="text-sm text-gray-600 mt-2">
                                  Selected file: {(value as File).name}
                                </p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Right sidebar */}
          <div className="w-full md:w-80 shrink-0 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden sticky top-6">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">Project Checklist</h3>
                <p className="text-xs text-gray-500 mb-3">Complete these sections to publish your project</p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-600">Completion</span>
                    <span className="font-medium text-indigo-600">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-1.5 bg-gray-100"
                    indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">Project Title & Description</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">The Team</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-xs text-gray-500">Components and Supplies</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-xs text-gray-500">Tools and Machines</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-xs text-gray-500">Apps and Platforms</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">Project Description</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-xs text-gray-500">Code</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium">Downloadable Files</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                    <span className="text-xs text-gray-500">Documentation</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm text-sm py-1.5">
                    Preview Project
                  </Button>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 flex items-center gap-1 hover:text-indigo-600 hover:bg-indigo-50 px-2"
                    >
                      <Save className="h-3 w-3" />
                      Save Draft
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600 hover:bg-red-50 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
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
    </div>
  );
};

export default ProjectSubmission;
