export type ProjectAttachment = {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  size: number;
};

export type ProjectFeedback = {
  id: string; // corresponds to _id
  projectId: string;
  teacherId: string;
  collaboratorIds: string[];
  rating: number;
  feedbackText: string;
  status: "approved" | "pending" | "rejected"; // more specific type
  attachments: ProjectAttachment[];
  createdAt: string; // or Date
  updatedAt: string; // or Date
};

export type ProjectFeedbackList = {
  feedback: ProjectFeedback[];
};
