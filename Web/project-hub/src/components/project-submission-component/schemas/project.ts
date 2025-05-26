import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_DOC_TYPES } from "../constants";

export const projectSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  coverImage: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  elevatorPitch: z.string()
    .min(50, "Elevator pitch must be at least 50 characters")
    .max(500, "Elevator pitch must be less than 500 characters"),
  projectDescription: z.string()
    .min(100, "Project description must be at least 100 characters")
    .max(5000, "Project description must be less than 5000 characters"),
  teamMembers: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required")
  })).min(1, "At least one team member is required"),
  toolsAndMachines: z.object({
    noToolsUsed: z.boolean(),
    tools: z.array(z.object({
      name: z.string().min(1, "Tool name is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      image: z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
    })).optional()
  }),
  appsAndPlatforms: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    logo: z.instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
  })).min(1, "At least one app or platform is required"),
  codeAndDocumentation: z.object({
    repositoryLink: z.string().url("Please provide a valid repository URL"),
    documentation: z.object({
      fileName: z.string(),
      fileSize: z.string(),
      file: z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (file) => ACCEPTED_DOC_TYPES.includes(file.type),
          "Only .pdf, .doc, and .docx formats are supported."
        )
    })
  }),
  status: z.boolean(),
  reviewedByTeacherId: z.string().optional()
});

export type ProjectFormValues = z.infer<typeof projectSchema>; 