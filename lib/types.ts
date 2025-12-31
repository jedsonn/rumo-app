// ============ CORE TYPES ============

export type GoalStatus = 'Doing' | 'On Track' | 'For Later' | 'Done' | 'Dropped';
export type GoalPeriod = 'One-year' | 'Three-years' | 'Five-years';
export type GoalCategory = 'Personal' | 'Professional';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly';
export type FocusMode = 'all' | 'this-week' | 'pinned' | 'stale' | 'active';

export interface Goal {
  id: string;
  user_id: string;
  number: number;
  year: number;
  goal: string;
  period: GoalPeriod;
  category: GoalCategory;
  status: GoalStatus;
  action: string | null;
  cost: number;
  notes: string | null;
  pinned: boolean;
  linked_reward_id: string | null;
  progress: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blessing {
  id: string;
  user_id: string;
  text: string;
  category: GoalCategory;
  created_at: string;
}

export interface Reward {
  id: string;
  user_id: string;
  text: string;
  cost: number;
  earned: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  is_blue_theme: boolean;
  is_dark_mode: boolean;
  column_split: number;
  focus_mode: FocusMode;
  created_at: string;
  updated_at: string;
}

// ============ NEW FEATURE TYPES ============

export interface VisionBoardItem {
  id: string;
  user_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: GoalCategory;
  linked_goal_id: string | null;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  created_at: string;
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
  completed_at: string | null;
}

export interface GoalProgressNote {
  id: string;
  goal_id: string;
  user_id: string;
  content: string;
  progress_percent: number | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  recurrence: RecurrenceType;
  target_days_per_week: number;
  color: string;
  active: boolean;
  linked_goal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string | null;
  category: string;
}

// ============ FORM TYPES ============

export interface GoalFormData {
  goal: string;
  period: GoalPeriod;
  category: GoalCategory;
  status: GoalStatus;
  action?: string;
  cost?: number;
  notes?: string;
  pinned?: boolean;
  linked_reward_id?: string | null;
  progress?: number;
  due_date?: string | null;
  number?: number;
}

export interface BlessingFormData {
  text: string;
  category: GoalCategory;
}

export interface RewardFormData {
  text: string;
  cost?: number;
}

export interface VisionBoardItemFormData {
  image_url: string;
  title?: string;
  description?: string;
  category?: GoalCategory;
  linked_goal_id?: string | null;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
}

export interface MilestoneFormData {
  title: string;
  goal_id: string;
}

export interface HabitFormData {
  title: string;
  description?: string;
  category?: GoalCategory;
  recurrence?: RecurrenceType;
  target_days_per_week?: number;
  color?: string;
  linked_goal_id?: string | null;
}

export interface ProgressNoteFormData {
  content: string;
  goal_id: string;
  progress_percent?: number;
}

// ============ CONSTANTS ============

export const STATUSES: GoalStatus[] = ['Doing', 'On Track', 'For Later', 'Done', 'Dropped'];
export const PERIODS: GoalPeriod[] = ['One-year', 'Three-years', 'Five-years'];
export const CATEGORIES: GoalCategory[] = ['Personal', 'Professional'];
export const RECURRENCES: RecurrenceType[] = ['daily', 'weekly', 'monthly'];
export const FOCUS_MODES: FocusMode[] = ['all', 'this-week', 'pinned', 'stale', 'active'];

export const STATUS_COLORS: Record<GoalStatus, { bg: string; text: string; border: string }> = {
  'Doing': { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  'On Track': { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' },
  'For Later': { bg: 'bg-slate-100 dark:bg-slate-700/40', text: 'text-slate-600 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600' },
  'Done': { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  'Dropped': { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
};

export const PERIOD_COLORS: Record<GoalPeriod, { bg: string; text: string; label: string }> = {
  'One-year': { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-300', label: '1yr' },
  'Three-years': { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', label: '3yr' },
  'Five-years': { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', label: '5yr' },
};

export const FOCUS_MODE_LABELS: Record<FocusMode, { label: string; description: string }> = {
  'all': { label: 'All Goals', description: 'Show all goals' },
  'this-week': { label: 'This Week', description: 'Goals due this week' },
  'pinned': { label: 'Pinned', description: 'Only pinned goals' },
  'stale': { label: 'Stale', description: 'Goals not updated in 2+ weeks' },
  'active': { label: 'Active', description: 'Doing & On Track only' },
};

export const HABIT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];
