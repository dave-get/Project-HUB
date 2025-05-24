import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_DOC_TYPES } from "../constants";

export const projectSchema = z.object({
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

export type ProjectFormValues = z.infer<typeof projectSchema>; 