import { z } from "zod";

export const feedbackSectionSchema = z.object({
  title: z.string(),
  rating: z.number().min(0).max(5),
  strengths: z.string().min(1, "Strengths are required"),
  areasForImprovement: z.string().min(1, "Areas for improvement are required"),
  comments: z.string().min(1, "Comments are required"),
});

export const feedbackFormSchema = z.object({
  proposalId: z.string(),
  projectTitle: z.string(),
  sections: z.array(feedbackSectionSchema),
  attachments: z.array(z.object({
    fileName: z.string(),
    size: z.string(),
    downloadLink: z.string(),
  })).optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
export type FeedbackSection = z.infer<typeof feedbackSectionSchema>; 