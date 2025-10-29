export interface Resource {
  title: string;
  type: 'pdf' | 'link';
  url: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'pdf' | 'quiz' | 'audio';
  completed: boolean;
  resources?: Resource[];
  notes?: string;
  language?: 'English' | 'Hindi' | 'Bilingual';
  videoUrl?: string;
  audioUrl?: string;
  quizContent?: QuizQuestion[];
  summary?: string;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  progress: number;
  imageUrl: string;
  type: 'Free' | 'Paid' | 'Premium';
  price?: string;
  lessons?: Lesson[];
  description?: string;
  instructor?: string;
  enrollments?: number;
  language?: 'English' | 'Hindi' | 'Bilingual';
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  skills: string[];
  resources: string[];
}

export interface Opportunity {
  title: string;
  organization: string;
  category: 'Scholarship' | 'Internship' | 'Admission' | 'Workshop' | 'Job';
  location: string;
  description: string;
  deadline: string;
  url: string;
}

export interface Citation {
  uri: string;
  title: string;
}

export type UserRole = 'Student' | 'Instructor' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string; // YYYY-MM-DD
  enrolledCourses: number;
}

export type TTSVoice = 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';
export const AVAILABLE_VOICES: TTSVoice[] = ['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'];


export interface DetailedCourseStat {
    id: number;
    title: string;
    enrollments: number;
    avgCompletionRate: number; // as a percentage
    revenue: number;
}

export interface AnalyticsData {
    totalUsers: number;
    totalRevenue: number;
    allUsers: User[];
    detailedCourseStats: DetailedCourseStat[];
}


export interface Instructor {
  id: number;
  name: string;
  title: string;
  avatarUrl: string;
  bio: string;
}

export interface ATSAnalysisResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}