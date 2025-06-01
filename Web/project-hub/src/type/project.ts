export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface AppPlatform {
  title: string;
  description: string;
  logo: string;
  link?: string;
}

export interface Tool {
  name: string;
  description: string;
  image: string;
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

//
export type Comment = {
  commenterId: string;
  name: string;
  image?: string;
  text: string;
  likes: number; // references to User IDs
  createdAt: Date;
};

// Main Project Submission Response
export type Project = {
  _id: string;
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
  comments: Comment[];
  likes: [string];
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type Projects = {
  projects: Project[];
};
