
import type { NavItem } from '@/types';
import {
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  FileText,
  BookOpen,
  HelpCircle,
  Sparkles,
  ClipboardList,
  Lightbulb,
  Settings,
  Briefcase,
  Brain, // Keep Brain for consistency if used elsewhere, or change if Skills Guide needs a new icon
  ListChecks,
  PenTool,
  Zap, // Example for Skills Guide icon, or choose another relevant one
} from 'lucide-react';

export const APP_NAME = "TutorTrack.ai";

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/career-coach', label: 'Career Coach', icon: Briefcase },
  { href: '/student/skills-guide', label: 'Skills Guide', icon: Zap }, // Updated Label and potentially icon
  { href: '/student/assignment-help', label: 'Assignment Help', icon: HelpCircle },
  { href: '/student/ai-chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/student/recommendations', label: 'Recommendations', icon: Lightbulb },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/paper-checker', label: 'Paper Checker', icon: FileText },
  { href: '/teacher/quiz-maker', label: 'Quiz Maker', icon: ListChecks },
  { href: '/teacher/curriculum-creator', label: 'Curriculum Creator', icon: PenTool },
  { href: '/teacher/ai-chat', label: 'AI Chat', icon: MessageCircle },
];

export const COMMON_NAV_ITEMS: NavItem[] = [
 // { href: '/settings', label: 'Settings', icon: Settings }, // Example for future
];
