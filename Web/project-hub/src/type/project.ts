export type ProjectSubmissionResponse = {
    id: string;
    title: string;
    tags: string[];
    coverImage: string;
    elevatorPitch: string;
    projectDescription: string;
    teamMembers: {
      id: string;
      name: string;
      role: string;
    }[];
    toolsAndMachines: {
      noToolsUsed: boolean;
      tools?: {
        name: string;
        description: string;
        image: string;
      }[];
    };
    appsAndPlatforms: {
      title: string;
      description: string;
      logo: string;
    }[];
    codeAndDocumentation: {
      repositoryLink: string;
      documentation: {
        fileName: string;
        fileSize: string;
        fileUrl: string;
      };
    };
    status: boolean;
    reviewedByTeacherId?: string;
    createdAt: string;
    updatedAt: string;
  }