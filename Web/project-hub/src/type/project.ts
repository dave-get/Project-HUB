export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface AppPlatform {
  title: string;
  description: string;
  logo: File;
}

export interface Tool {
  name: string;
  description: string;
  image: File;
}

// Tools and Machines
export type ToolsAndMachines = {
  noToolsUsed: boolean;
  tools?: Tool[];
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
  appsAndPlatforms: AppPlatform[];
  codeAndDocumentation: CodeAndDocumentation;
  status: boolean;
  reviewedByTeacherId?: string;
  createdAt: string;
  updatedAt: string;
};