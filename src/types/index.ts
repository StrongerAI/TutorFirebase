export type UserRole = 'student' | 'teacher' | null;

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  quiz: QuizQuestion[];
}

// For Collaborative Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  members: string[]; // User IDs or names
  status: 'Active' | 'Completed' | 'Planning';
  lastUpdated: string;
}

// For Personalized Recommendations
export interface Recommendation {
  id: string;
  title: string;
  type: 'Course' | 'Book' | 'Article' | 'Video';
  source: string; // e.g., Coursera, YouTube
  url: string;
  description?: string;
}
