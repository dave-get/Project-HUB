export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface AppPlatform {
  title: string;
  description: string;
<<<<<<< HEAD
  logo: File;
=======
  logo: string;
  link?: string;
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527
}

export interface Tool {
  name: string;
  description: string;
<<<<<<< HEAD
  image: File;
=======
  image: string;
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527
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

<<<<<<< HEAD
// Main Project Submission Response
export type ProjectSubmissionResponse = {
  id: string;
=======
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
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527
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
<<<<<<< HEAD
  createdAt: string;
  updatedAt: string;
};
=======
  comments: Comment[];
  likes: [string];
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type Projects = {
  projects: Project[];
};
>>>>>>> 6a3efad20f050be25ea398baffa86831bd787527
