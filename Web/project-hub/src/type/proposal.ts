export type Attachment = {
  name: string;
  url: string;
  type: string;
  size: number;
  _id: string;
  id: string;
};

export type UserInfo = {
  _id: string;
  fullName: string;
  email: string;
  department?: string; // Optional for teacher
};

export type Submission = {
  _id: string;
  title: string;
  student: UserInfo;
  teacher: Omit<UserInfo, 'department'>;
  status: string;
  attachments: Attachment[];
  feedbackList: any[]; // Adjust type if feedback structure is known
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type SubmissionResponse = {
  success: boolean;
  count: number;
  data: Submission[];
};
