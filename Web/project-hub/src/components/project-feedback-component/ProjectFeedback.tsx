"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  Wrench,
  Github,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateFeedbackMutation } from "@/features/projectFeedbackApi/ProjectFeedbackApi";

const collaborators = [
  {
    id: 1,
    name: "John Doe",
    image: "/avatars/john.png",
    role: "Lead Designer",
  },
  {
    id: 2,
    name: "Sarah Smith",
    image: "/avatars/sarah.png",
    role: "Developer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    image: "/avatars/mike.png",
    role: "UI/UX Designer",
  },
];

const tools = [
  {
    name: "React",
    icon: "/icons/react.svg",
    description: "Frontend library for building user interfaces",
  },
  {
    name: "TypeScript",
    icon: "/icons/typescript.svg",
    description: "Typed superset of JavaScript for better development",
  },
  {
    name: "Tailwind CSS",
    icon: "/icons/tailwind.svg",
    description: "Utility-first CSS framework for rapid UI development",
  },
  {
    name: "Node.js",
    icon: "/icons/nodejs.svg",
    description: "JavaScript runtime for server-side development",
  },
];

const platforms = [
  {
    name: "Web Application",
    icon: "/platforms/web.png",
    description: "Responsive dashboard accessible from any modern browser",
  },
  {
    name: "Mobile App",
    icon: "/platforms/mobile.png",
    description: "Native mobile experience for iOS and Android devices",
  },
  {
    name: "Desktop Client",
    icon: "/platforms/desktop.png",
    description: "Electron-based application for Windows and macOS",
  },
];

const projectTags = [
  "Dashboard",
  "Enterprise",
  "React",
  "TypeScript",
  "Responsive",
];

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string>("");
  const [codeVisible, setCodeVisible] = useState<boolean>(false);

  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileSize = event.target.files[0].size / 1024 / 1024; // size in MB
      if (fileSize > 10) {
        toast.error("File size should not exceed 10MB");
        return;
      }
      setFiles(event.target.files);
      toast.success("File uploaded successfully");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!rating) {
        toast.error("Please provide a rating");
        return;
      }

      if (!feedback.trim()) {
        toast.error("Please provide feedback comments");
        return;
      }

      if (!status) {
        toast.error("Please select a project status");
        return;
      }

      const feedbackData = {
        projectId: "current-project-id", // Replace with actual project ID from props or context
        teacherId: "current-teacher-id", // Replace with actual teacher ID from auth context
        collaboratorIds: collaborators.map((c) => c.id.toString()), // Using the collaborators from your data
        rating,
        feedback,
        status,
        attachments: files ? Array.from(files) : undefined,
      };

      await createFeedback(feedbackData).unwrap();

      toast.success("Feedback submitted successfully!");

      // Reset form after successful submission
      setRating(0);
      setFeedback("");
      setFiles(null);
      setStatus("");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Feedback submission error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "needs-review":
        return "text-amber-600";
      default:
        return "text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground px-6 py-3">
        <Link
          href="/project"
          className="hover:text-foreground text-2xl font-bold cursor-pointer text-gray-900 dark:text-white transition-colors"
        >
          Project
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-blue-500" />
        <span className="hover:text-gray-400 cursor-pointer text-foreground font-medium">
          Feedback
        </span>
      </div>

      {/* Header Section */}
      <div className="border dark:border-gray-700 rounded-lg p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              <Sparkles className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words">
              Enterprise Dashboard Redesign
            </h1>
          </div>
          <p className="text-muted-foreground dark:text-gray-400 text-lg max-w-3xl break-words">
            Complete overhaul of the enterprise dashboard interface with focus
            on user experience and performance optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Cover Image */}
          <div className="flex flex-col h-full">
            <div className="flex-1 border dark:border-gray-700 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Project Cover"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Collaborators List */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-500 shrink-0" />
              <h3 className="text-lg font-semibold dark:text-white break-words">
                Project Collaborators
              </h3>
            </div>
            <div className="flex-1 border dark:border-gray-700 rounded-lg p-4 overflow-y-auto">
              <div className="space-y-4">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors"
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={collaborator.image || "/placeholder.svg"}
                        alt={collaborator.name}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium dark:text-white truncate">
                        {collaborator.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {collaborator.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {projectTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project Details Card */}
      <div className="space-y-8 border dark:border-gray-700 rounded-lg p-6">
        {/* Tools & Technologies */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              <Wrench className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold dark:text-white break-words">
              Tools & Technologies
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                    <img
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={tool.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold dark:text-white text-lg mb-1 break-words">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground break-words">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apps & Platforms */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold dark:text-white break-words">
              Apps & Platforms
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 text-center"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 inline-block">
                  <img
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={platform.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h4 className="font-semibold dark:text-white text-lg mb-2 break-words">
                  {platform.name}
                </h4>
                <p className="text-sm text-muted-foreground break-words">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-6 mt-12">
          <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              <Code2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="break-words">Project Description</span>
          </h3>
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6 overflow-hidden">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg break-words mb-4">
                The Enterprise Dashboard Redesign project aims to revolutionize
                how users interact with complex data sets and system controls.
                Key improvements include:
              </p>
              <ul className="list-none space-y-3 text-muted-foreground">
                {[
                  "Modernized UI components with improved accessibility",
                  "Real-time data visualization with customizable widgets",
                  "Responsive design supporting multiple device formats",
                  "Enhanced performance with optimized data loading",
                  "Dark mode support and customizable themes",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 shrink-0"></div>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <a
            href="https://github.com/your-org/project-name"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white h-10">
              <Github className="w-5 h-5 mr-2" />
              View Code on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Button
            variant="outline"
            className="flex-1 h-10"
            onClick={() => toast.info("Downloading documentation...")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Documentation (PDF)
          </Button>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="space-y-8 border dark:border-gray-700 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
              <Star className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-bold dark:text-white break-words">
              Provide Your Feedback
            </h2>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-10 shrink-0">
              <SelectValue placeholder="Project Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved" className="text-green-600">
                Approve Project
              </SelectItem>
              <SelectItem value="rejected" className="text-red-600">
                Reject Project
              </SelectItem>
              <SelectItem value="needs-review" className="text-amber-600">
                Needs Review
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium dark:text-gray-300 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 shrink-0" />
            <span className="break-words">Rating</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-all duration-200 hover:scale-110 shrink-0"
              >
                <Star
                  className={cn(
                    "w-8 h-8",
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold dark:text-gray-300 break-words">
            Your Feedback
          </label>
          <Textarea
            placeholder="Share your thoughts on the dashboard redesign..."
            className="min-h-[140px] bg-gray-50/50 dark:bg-gray-800/50 border-0 rounded-lg resize-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 w-full"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold dark:text-gray-300 break-words">
            Attachments
          </label>
          <label
            htmlFor="file-upload"
            className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-8 text-center block cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
            />
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                <Download className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 break-words">
                {files && files.length > 0
                  ? files[0].name
                  : "Click to upload or drag and drop"}
              </div>
              <div className="text-xs text-muted-foreground break-words">
                PNG, JPG, PDF up to 10MB
              </div>
            </div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <Button
            variant="outline"
            className="h-10 shrink-0"
            onClick={() => {
              setRating(0);
              setFeedback("");
              setFiles(null);
              toast.info("Form cleared");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-10 bg-gray-900 hover:bg-gray-800 text-white shrink-0"
          >
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
