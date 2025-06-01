export type profileType = {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  department: string;
  bio: string;
  phone: string;
  location: string;
  imageUrl: string;
  socialLinks: Array<{
    _id: string;
    platform: 'github' | 'linkedin' | 'twitter';
    url: string;
  }>;
  skills: [string];
};

export type UserType = { data: profileType };
