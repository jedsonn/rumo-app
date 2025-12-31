// ============ CORE TYPES - MATCHING TEMPLATE EXACTLY ============

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
  check_in_dates: string[]; // Array of ISO date strings for weekly check-ins
  last_check_in: string | null;
  email_digest_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string | null;
  category: string;
}

// ============ CONSTANTS - MATCHING TEMPLATE ============

export const STATUSES: GoalStatus[] = ['Doing', 'On Track', 'For Later', 'Done', 'Dropped'];
export const PERIODS: GoalPeriod[] = ['One-year', 'Three-years', 'Five-years'];
export const CATEGORIES: GoalCategory[] = ['Personal', 'Professional'];
export const PERIOD_ORDER: Record<GoalPeriod, number> = { 'One-year': 1, 'Three-years': 3, 'Five-years': 5 };
export const STATUS_DELAY_MS = 5000; // 5 seconds before goal moves position after status change

// Status colors matching template EXACTLY
export const STATUS_COLORS_LIGHT: Record<GoalStatus, string> = {
  'Doing': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'On Track': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  'For Later': 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  'Done': 'bg-green-500 text-white hover:bg-green-600',
  'Dropped': 'bg-red-100 text-red-600 hover:bg-red-200',
};

export const STATUS_COLORS_DARK: Record<GoalStatus, string> = {
  'Doing': 'bg-blue-900/50 text-blue-300 hover:bg-blue-900',
  'On Track': 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900',
  'For Later': 'bg-slate-700 text-slate-300 hover:bg-slate-600',
  'Done': 'bg-green-600 text-white hover:bg-green-700',
  'Dropped': 'bg-red-900/50 text-red-300 hover:bg-red-900',
};

// Period colors matching template EXACTLY
export const PERIOD_COLORS_LIGHT: Record<GoalPeriod, string> = {
  'One-year': 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200',
  'Three-years': 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200',
  'Five-years': 'bg-violet-100 text-violet-700 hover:bg-violet-200 border-violet-200',
};

export const PERIOD_COLORS_DARK: Record<GoalPeriod, string> = {
  'One-year': 'bg-sky-900/50 text-sky-300 hover:bg-sky-900 border-sky-700',
  'Three-years': 'bg-amber-900/50 text-amber-300 hover:bg-amber-900 border-amber-700',
  'Five-years': 'bg-violet-900/50 text-violet-300 hover:bg-violet-900 border-violet-700',
};
