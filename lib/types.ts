// ============ CORE TYPES ============

export type GoalStatus = 'Doing' | 'On Track' | 'For Later' | 'Done' | 'Dropped';
export type GoalPeriod = 'One-year' | 'Three-years' | 'Five-years';
export type GoalCategory = 'Personal' | 'Professional';

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
  created_at: string;
  updated_at: string;
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
}

export interface BlessingFormData {
  text: string;
  category: GoalCategory;
}

export interface RewardFormData {
  text: string;
  cost?: number;
}

// ============ CONSTANTS ============

export const STATUSES: GoalStatus[] = ['Doing', 'On Track', 'For Later', 'Done', 'Dropped'];
export const PERIODS: GoalPeriod[] = ['One-year', 'Three-years', 'Five-years'];
export const CATEGORIES: GoalCategory[] = ['Personal', 'Professional'];

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
