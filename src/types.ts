export type User = {
  id: string;
  username: string;
  avatar: string;
  name: string;
  courses: string[];
};

export type Course = {
  id: string;
  code: string;
  title: string;
  cover: string;
};

export type Pointer = {
  id: string;
  courseId?: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  createdAt: number;
};

export type Reel = {
  id: string;
  userId: string;
  courseId?: string;
  videoUrl: string;
  thumbUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  shares?: number;
  views?: number;
  createdAt: number;
};

export type Post = {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  shares?: number;
  createdAt: number;
  isPointer?: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  courseId?: string;
};

export type ChatLog = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  courseId?: string;
};

export type Share = {
  id: string;
  contentId: string;
  contentType: 'reel' | 'post' | 'pointer';
  method: 'copy_link' | 'twitter' | 'facebook' | 'whatsapp' | 'telegram' | 'email';
  timestamp: string;
  url: string;
};

export type UploadType = 'reel' | 'post';

// Job Hunt Types
export type JobType = 'TA' | 'Grader' | 'Research Assistant' | 'Tutor' | 'Lab Assistant';
export type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export type Job = {
  id: string;
  title: string;
  department: string;
  courseCode?: string;
  jobType: JobType;
  description: string;
  requirements: string[];
  payRate: number;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  postedDate: string;
  tags: string[];
  contactEmail: string;
  isRemote: boolean;
  location?: string;
};

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedDate: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  postingUrl?: string;
  deadline?: string;
  interviewDate?: string;
  offerDetails?: string;
  rejectionReason?: string;
};

export type JobFilters = {
  keyword: string;
  department: string;
  jobType: JobType | '';
  status: ApplicationStatus | '';
  sortBy: 'newest' | 'deadline' | 'pay';
  sortOrder: 'asc' | 'desc';
};

// Authentication Types
export type UserStatus = 'PENDING_EMAIL' | 'ACTIVE' | 'SUSPENDED';

export type AuthUser = {
  id: string;
  fullName: string;
  passwordHash: string;
  university: string;
  graduationMonth: number;
  graduationYear: number;
  universityEmail: string;
  status: UserStatus;
  createdAt: number;
  updatedAt: number;
};

export type EmailVerificationToken = {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
};

export type University = {
  id: string;
  name: string;
  primaryDomain?: string;
  country: string;
  state?: string;
};

export type SignupFormData = {
  fullName: string;
  password: string;
  confirmPassword: string;
  university: string;
  graduationMonth: number;
  graduationYear: number;
  universityEmail: string;
};

// Support System Types
export type SupportTicketStatus = 'OPEN' | 'CLOSED';

export type SupportTicket = {
  id: string;
  userId?: string;
  email: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  createdAt: number;
  updatedAt?: number;
};

export type SupportFormData = {
  email: string;
  subject: string;
  message: string;
};

// Advisor System Types
export type Advisor = {
  id: string;
  name: string;
  email: string;
  department: string;
  timezone: string;
  isOnline: boolean;
  officeHours: OfficeHours[];
  avatar?: string;
  bio?: string;
  specialties: string[];
};

export type OfficeHours = {
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual: boolean;
};

export type AdvisorRequest = {
  id: string;
  userId: string;
  advisorId: string;
  message: string;
  preferredSlots?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: number;
  responseAt?: number;
};

export type AdvisorRequestFormData = {
  advisorId: string;
  message: string;
  preferredSlots?: string;
};
