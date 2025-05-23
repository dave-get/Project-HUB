"use client";

import { useState } from "react";
import { Star, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type FeedbackType = "UI/UX" | "Functionality" | "Performance" | "Usability";

interface PreviousFeedback {
  type: FeedbackType;
  rating: number;
  comment: string;
  date: string;
  status: "Addressed" | "In Progress";
}

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [selectedTypes, setSelectedTypes] = useState<FeedbackType[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);

  const previousFeedback: PreviousFeedback[] = [
    {
      type: "UI/UX",
      rating: 4,
      comment:
        "Interface is clean and intuitive. Navigation could be improved.",
      date: "2024-01-15",
      status: "Addressed",
    },
    {
      type: "Performance",
      rating: 3,
      comment: "Load times need optimization in the dashboard section.",
      date: "2024-01-14",
      status: "In Progress",
    },
    {
      type: "Functionality",
      rating: 5,
      comment: "New features work perfectly. Great implementation.",
      date: "2024-01-13",
      status: "Addressed",
    },
  ];

  const handleTypeToggle = (type: FeedbackType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

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

  const handleSubmit = () => {
    if (!rating) {
      toast.error("Please provide a rating");
      return;
    }

    if (selectedTypes.length === 0) {
      toast.error("Please select at least one feedback type");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please provide feedback comments");
      return;
    }

    toast.promise(
      // Simulating API call
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Submitting feedback...",
        success: "Feedback submitted successfully!",
        error: "Failed to submit feedback",
      }
    );

    // Reset form after successful submission
    setRating(0);
    setSelectedTypes([]);
    setFeedback("");
    setFiles(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="hover:text-foreground text-2xl font-bold cursor-pointer">
            Project
          </span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="hover:text-gray-400 cursor-pointer text-foreground">Feedback</span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold dark:text-white">
              Enterprise Dashboard Redesign
            </h1>
            <p className="text-muted-foreground dark:text-gray-400 mt-2 max-w-2xl">
              Complete overhaul of the enterprise dashboard interface with focus
              on user experience and performance optimization
            </p>
          </div>
          <div className="bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 px-3 py-1 rounded-md text-sm font-medium">
            Pending Review
          </div>
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400 mt-4">
          Last updated: Jan 15, 2024
        </div>
      </div>

      <Separator className="dark:border-gray-700" />

      {/* Feedback Form */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold dark:text-white">
          Provide Your Feedback
        </h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-6 h-6",
                    rating >= star
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Feedback Type</label>
          <div className="flex flex-wrap gap-6">
            {(
              [
                "UI/UX",
                "Functionality",
                "Performance",
                "Usability",
              ] as FeedbackType[]
            ).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                />
                <label
                  htmlFor={type}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Feedback</label>
          <Textarea
            placeholder="Share your thoughts on the dashboard redesign..."
            className="min-h-[120px]"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-gray-300">
            Attachments
          </label>
          <label
            htmlFor="file-upload"
            className="border border-dashed rounded-md p-8 text-center block cursor-pointer hover:border-blue-500 transition-colors dark:border-gray-700"
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
            />
            <div className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              {files && files.length > 0
                ? files[0].name
                : "Click to upload or drag and drop"}
            </div>
            <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              PNG, JPG, PDF up to 10MB
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setRating(0);
              setSelectedTypes([]);
              setFeedback("");
              setFiles(null);
              toast.info("Form cleared");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </div>
      </div>

      <Separator className="dark:border-gray-700" />

      {/* Previous Feedback */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold dark:text-white">
            Previous Feedback
          </h2>
          <Button variant="link" className="text-sm text-primary p-0">
            View All
          </Button>
        </div>

        {previousFeedback.map((item, index) => (
          <div key={index} className="space-y-2">
            {index > 0 && <Separator className="dark:border-gray-700" />}
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.type}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < item.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{item.date}</span>
            </div>
            <p className="text-sm">{item.comment}</p>
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full w-fit",
                item.status === "Addressed"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
