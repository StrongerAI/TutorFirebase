
import type { NavItem } from '@/types';
import {
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  FileText,
  HelpCircle,
  Lightbulb,
  Briefcase,
  Zap,
  ListChecks,
  PenTool,
  FileSignature,
  ClipboardList,
  ClipboardCheck,
  Search,
} from 'lucide-react';

export const APP_NAME = "TutorTrack";

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Academics',
    icon: GraduationCap,
    children: [
      { href: '/student/assignment-help', label: 'Assignment Help', icon: HelpCircle },
      { href: '/student/recommendations', label: 'Recommendations', icon: Lightbulb },
      { href: '/student/practice-quizzes', label: 'Practice Quizzes', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Career Support',
    icon: Briefcase,
    children: [
      { href: '/student/career-coach', label: 'Career Coach', icon: Briefcase },
      { href: '/student/resume-builder', label: 'Resume Builder', icon: FileSignature },
      { href: '/student/skills-guide', label: 'Skills Guide', icon: Zap },
      { href: '/student/scholarship-finder', label: 'Scholarship Finder', icon: Search },
    ],
  },
  { href: '/student/ai-chat', label: 'AI Chat', icon: MessageCircle },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Teaching Tools',
    icon: ClipboardList,
    children: [
      { href: '/teacher/paper-checker', label: 'Paper Checker', icon: FileText },
      { href: '/teacher/quiz-maker', label: 'Quiz Maker', icon: ListChecks },
      { href: '/teacher/curriculum-creator', label: 'Curriculum Creator', icon: PenTool },
    ],
  },
  { href: '/teacher/ai-chat', label: 'AI Chat', icon: MessageCircle },
];

export const COMMON_NAV_ITEMS: NavItem[] = [
 // { href: '/settings', label: 'Settings', icon: Settings }, // Example for future
];
