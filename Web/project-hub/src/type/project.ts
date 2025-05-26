// Team Member
export type TeamMember = {
  id: string;
  name: string;
  role: string;
};

// Tool
export type Tool = {
  name: string;
  description: string;
  image: string;
};

// Tools and Machines
export type ToolsAndMachines = {
  noToolsUsed: boolean;
  tools?: Tool[];
};

// App or Platform
export type AppOrPlatform = {
  title: string;
  description: string;
  logo: string;
};

// Documentation
export type Documentation = {
  fileName: string;
  fileSize: string;
  fileUrl: string;
};

// Code and Documentation
export type CodeAndDocumentation = {
  repositoryLink: string;
  documentation: Documentation;
};

// Main Project Submission Response
export type ProjectSubmissionResponse = {
  id: string;
  title: string;
  tags: string[];
  coverImage: string;
  elevatorPitch: string;
  projectDescription: string;
  teamMembers: TeamMember[];
  toolsAndMachines: ToolsAndMachines;
  appsAndPlatforms: AppOrPlatform[];
  codeAndDocumentation: CodeAndDocumentation;
  status: boolean;
  reviewedByTeacherId?: string;
  createdAt: string;
  updatedAt: string;
};
