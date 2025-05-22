"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateFeedbackMutation } from "@/features/proposalFeedbackApi/proposalFeedbackApi";
import { feedbackFormSchema, type FeedbackFormData, type FeedbackSection } from "@/lib/validations/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StarRating from "./star-rating";
import { toast } from "sonner";

const DEFAULT_SECTIONS = [
  {
    title: "Research Methodology",
    rating: 0,
    strengths: "",
    areasForImprovement: "",
    comments: "",
  },
  {
    title: "Literature Review",
    rating: 0,
    strengths: "",
    areasForImprovement: "",
    comments: "",
  },
  {
    title: "Technical Implementation",
    rating: 0,
    strengths: "",
    areasForImprovement: "",
    comments: "",
  },
  {
    title: "Innovation & Impact",
    rating: 0,
    strengths: "",
    areasForImprovement: "",
    comments: "",
  },
];

interface EvaluationFormProps {
  proposalId: string;
}

const EvaluationForm = ({ proposalId }: EvaluationFormProps) => {
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      proposalId,
      projectTitle: "AI in Healthcare",
      sections: DEFAULT_SECTIONS,
      attachments: [],
    },
  });

  const sections = watch("sections");

  const handleRatingChange = (index: number, rating: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], rating };
    setValue("sections", newSections);
  };

  const handleSectionChange = (
    index: number,
    field: keyof FeedbackSection,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setValue("sections", newSections);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    const files =
      (event as React.ChangeEvent<HTMLInputElement>).target?.files ||
      (event as React.DragEvent<HTMLDivElement>).dataTransfer?.files;
    
    if (files) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      const newFiles = Array.from(files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast.error("Invalid file type", {
            description: `File "${file.name}" has an unsupported type.`,
          });
          return false;
        }
        if (file.size > maxSize) {
          toast.error("File too large", {
            description: `File "${file.name}" exceeds the maximum size of 10MB.`,
          });
          return false;
        }
        return true;
      });

      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Here you would typically upload the files to your storage service
      // and get back the URLs. For now, we'll just create mock attachments
      const mockAttachments = newFiles.map((file) => ({
        fileName: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        downloadLink: `https://storage.example.com/feedback/${file.name}`,
      }));

      setValue("attachments", [...(watch("attachments") || []), ...mockAttachments]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileSelect(event);
  };

  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    setValue(
      "attachments",
      (watch("attachments") || []).filter((att: { fileName: string }) => att.fileName !== fileName)
    );
  };

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      await createFeedback({
        ...data,
        attachments: data.attachments || []
      }).unwrap();
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">
            <Input
              {...register("projectTitle")}
              className="text-lg font-semibold border-none p-0"
            />
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <span>Proposal ID: {watch("proposalId")}</span> •{" "}
            <span>Submitted: 2025-05-15</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <div className="flex justify-between text-sm">
            <span>Primary Investigator: Dr. Jane Smith</span>
            <span>Department: Medical Informatics</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Evaluation Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {sections.map((section: FeedbackSection, index: number) => (
            <div key={section.title} className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{section.title}</h3>
                <StarRating
                  rating={section.rating}
                  onRatingChange={(rating) => handleRatingChange(index, rating)}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={section.strengths}
                    onChange={(e) =>
                      handleSectionChange(index, "strengths", e.target.value)
                    }
                    className="resize-none"
                  />
                  {errors.sections?.[index]?.strengths && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.sections[index]?.strengths?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Areas for Improvement</Label>
                  <Textarea
                    value={section.areasForImprovement}
                    onChange={(e) =>
                      handleSectionChange(
                        index,
                        "areasForImprovement",
                        e.target.value
                      )
                    }
                    className="resize-none"
                  />
                  {errors.sections?.[index]?.areasForImprovement && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.sections[index]?.areasForImprovement?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Comments</Label>
                  <Textarea
                    value={section.comments}
                    onChange={(e) =>
                      handleSectionChange(index, "comments", e.target.value)
                    }
                    className="resize-none"
                  />
                  {errors.sections?.[index]?.comments && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.sections[index]?.comments?.message}
                    </p>
                  )}
                </div>
              </div>
              {index < sections.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attach Files */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attach Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              multiple
              accept=".pdf,.doc,.docx"
            />
            {attachedFiles.length === 0 ? (
              <>
                <p className="text-blue-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </>
            ) : (
              <div className="mt-2 text-left w-full">
                <p className="text-sm font-medium mb-2">Attached Files:</p>
                <ul className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded"
                    >
                      <span className="truncate max-w-[300px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file.name);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Overall Score:{" "}
            {(
              sections.reduce((acc: number, section: FeedbackSection) => acc + section.rating, 0) /
              sections.length
            ).toFixed(1)}{" "}
            / 5
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast.success("Draft saved", {
                  description: "Your feedback has been saved as a draft.",
                });
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Evaluation"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EvaluationForm;
