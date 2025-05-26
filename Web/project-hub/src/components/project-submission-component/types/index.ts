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

export interface ChecklistStatus {
  title: boolean;
  description: boolean;
  team: boolean;
  tools?: boolean;
  apps: boolean;
  projectDescription: boolean;
  code: boolean;
  documentation: boolean;
  coverImage: boolean;
} 